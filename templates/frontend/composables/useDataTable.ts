import { nextTick, Ref, ref, watch } from '@nuxtjs/composition-api';
import Vue from 'vue';
import { i18n } from '~/plugins/i18n';
import { KeyCode, NOTIFICATION_DURATION } from '~/utils/constants';
import $ from 'jquery';
import customerEMeterHistoryHeaderDataTable from '~/datatables/customer-e-meter-history/header';
import {
  AxiosOption,
  DataTableHandler,
  DataTableValidateAndUpdateRowCallbackFunc,
  DataTableValidateAndUpdateRowFunc,
  FetchDatatableFunc,
  SelectedCellDataTable,
} from '~/types';
import { makeValidateAndUpdateRowDatatableFunc, scrollIntoView } from '~/utils';
import { DataOptions, DataTableHeader } from 'vuetify';
import { makeOptionFromResponse } from '~/utils/api';

interface UseDataTableOption {
  fetchDataFunc: FetchDatatableFunc
  headers: DataTableHeader[]
  initFetchExtraParams?: any
  initItemPerPage?: number
  editable?: boolean
  validateAndUpdateRowCallback?: DataTableValidateAndUpdateRowCallbackFunc
  axiosOption?: AxiosOption
}

const useDataTable = (option: UseDataTableOption): DataTableHandler => {
  // store data of table
  const items = ref([])

  const extraData = ref({
    options: {}
  } as any)

  const totalItem = ref(0)

  const itemsPerPage = ref(option.initItemPerPage || 25)

  const searchKeyword = ref('')

  const options = ref<DataOptions>({
    page: 1,
    itemsPerPage: itemsPerPage.value,
    sortBy: [],
    sortDesc: []
  } as unknown as DataOptions)

  watch(itemsPerPage, (currentValue) => {
    options.value.itemsPerPage = currentValue
  })

  // store all selected rows
  const selectedRows = ref([])

  const defaultSelectedCell = {
    row: "",
    column: "",
    value: "",
    origin: "",
    item: {},
    render: false
  } as SelectedCellDataTable

  const selectedCell: Ref<SelectedCellDataTable> = ref({
    ...defaultSelectedCell
  })

  const resetSelectedCell = () => {
    selectedCell.value = {
      ...defaultSelectedCell
    }
  }

  const closeEditor = () => {
    nextTick(() => {
      selectedCell.value.value = selectedCell.value.origin;
      nextTick(() => {
        selectedCell.value.render = false;
      })
    })
    // selectedCell.value.render = false;
  }

  // store value for trigger reload datatable, could reload every 3 seconds
  const draw = ref(1)

  const fetchExtraParams = ref<any>(option.initFetchExtraParams || {} as any)

  watch(fetchExtraParams, () => {
    reloadTableFn()
  }, {
    deep: true
  })

  // delayTime for refresh
  const delayTime = ref(0)

  const reloadTableFn = (delay = false) => {
    if (delay) {
      if ((+new Date() / 1000) - delayTime.value >= 0.5) {
        draw.value += 1
        delayTime.value = +new Date() / 1000
      } else {
        Vue.notify({
          type: 'warning',
          title: i18n.t('notification.warning_title').toString(),
          text: i18n.t('crud.reload_to_fast').toString(),
          duration: NOTIFICATION_DURATION
        })
      }
    } else {
      draw.value += 1
    }
  }

  const selectAllItems = () => {
    nextTick(() => {
      if (selectedRows.value.length > 0) {
        selectedRows.value = []
      } else {
        selectedRows.value.push(...items.value)
      }
    })
  }

  const clearSelectionAndReload = (delay: boolean | undefined = false) => {
    selectedRows.value = [];
    resetSelectedCell();
    reloadTableFn(delay);
  }

  const updateSelectedCell = (row: any, column: any) => {
    selectedCell.value.row = row
    selectedCell.value.column = column
  }

  const fetchDatatableFunc = (loading: Ref, options: DataOptions) => {
    loading.value = true
    option.fetchDataFunc(options, searchKeyword.value, option.headers, fetchExtraParams.value)
      .then((data: any) => {
        items.value = data.items
        totalItem.value = data.total
        let extra = {
          ...data.extra
        }
        extra.options = makeOptionFromResponse(data.options || {});
        extraData.value = extra
      }).finally(() => {
      loading.value = false
    })
  }

  const exportData = (action: string) => {
    // return () => {
    //   console.log("ok");
    //
    // }
    console.log(action);
    return option.fetchDataFunc(options.value, searchKeyword.value, option.headers, fetchExtraParams.value, action)
  }

  const headers = option.headers

  let validateAndUpdateRow: DataTableValidateAndUpdateRowFunc | undefined = undefined;

  if (option.editable) {
    const changeActiveCell = (evt: any) => {
      $('div.editable-datatable').find('table > tbody > tr > td').removeClass('selectedCell');
      let activeCell = $(evt.target).closest('td');
      activeCell.addClass('selectedCell')

      let data: any = items.value[activeCell.parent().index()]
      let row = data.id;
      let column = customerEMeterHistoryHeaderDataTable()[activeCell.index()].value
      if (selectedCell.value.row != row || selectedCell.value.column != column) {
        selectedCell.value.row = row
        selectedCell.value.column = column
        selectedCell.value.value = data[column]
        selectedCell.value.origin = data[column]
        selectedCell.value.item = data
        selectedCell.value.render = false
      }
    }
    validateAndUpdateRow = makeValidateAndUpdateRowDatatableFunc(option.validateAndUpdateRowCallback, option.axiosOption)
    const computeSelectedCell = () => {
      return [selectedCell.value.render, selectedCell.value.item, selectedCell.value.row, selectedCell.value.column, selectedCell.value.value]
    }
    watch(computeSelectedCell, (n, o) => {
      if (o[0] && !n[0] && validateAndUpdateRow) {
        let oldSelectedCell: SelectedCellDataTable = {
          row: o[2],
          column: o[3],
          value: o[4],
          origin: o[4],
          item: o[1],
          render: false
        }
        validateAndUpdateRow!(false, oldSelectedCell.item, oldSelectedCell)
      }
    })
    $(function () {
      $('div.editable-datatable').off('click').on('click', 'table tbody tr td', changeActiveCell)
      $('body').off('keydown').on('keydown', (evt: any) => {
        if ([KeyCode.DownArrow, KeyCode.UpArrow, KeyCode.LeftArrow, KeyCode.RightArrow, KeyCode.Enter, KeyCode.Escape].indexOf(evt.keyCode) > -1) {
          evt.preventDefault();
          let activeCell = $('div.editable-datatable table td.selectedCell');
          if (activeCell.length > 0) {
            let newCell = null;
            switch (evt.keyCode) {
              case KeyCode.DownArrow:
                newCell = activeCell.parent().next().children().eq(activeCell.index());
                break;
              case KeyCode.UpArrow:
                newCell = activeCell.parent().prev().children().eq(activeCell.index());
                break;
              case KeyCode.RightArrow:
                newCell = activeCell.next('td');
                break;
              case KeyCode.LeftArrow:
                newCell = activeCell.prev('td');
                break;
              case KeyCode.Enter:
                newCell = activeCell.parent().next().children().eq(activeCell.index());
                break;
              case KeyCode.Escape:
                break;
            }

            if (newCell !== null) {
              newCell.trigger('click')
              scrollIntoView(newCell, "div.editable-datatable > div.v-data-table__wrapper")
            }
          }
        } else {
          if (!selectedCell.value.render) {
            selectedCell.value.render = true
          }
        }
      });
    })
  }

  return {
    items,
    totalItem,
    extraData,
    headers,
    itemsPerPage,
    selectedRows,
    selectedCell,
    draw,
    options,
    exportData,
    searchKeyword,
    fetchExtraParams,
    selectAllItems,
    reloadTableFn,
    clearSelectionAndReload,
    updateSelectedCell,
    resetSelectedCell,
    validateAndUpdateRow,
    closeEditor,
    fetchDatatableFunc
  }
}

export default useDataTable;
