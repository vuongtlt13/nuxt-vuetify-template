import { nextTick, Ref, ref, watch } from '@nuxtjs/composition-api'
import Vue from 'vue'
import $ from 'jquery'
import { DataOptions, DataTableHeader } from 'vuetify'
import { i18n } from '~/plugins/i18n'
import { KeyCode, NOTIFICATION_DURATION } from '~/utils/constants'
import {
  AxiosOption,
  DataTableHandler,
  DataTableUpdateRowCallbackFunc,
  DataTableUpdateRowFunc,
  FetchDatatableFunc,
  SelectedCellDataTable
} from '~/types'
import { makeUpdateRowDatatableFunc, scrollIntoView } from '~/utils'
import { makeOptionFromResponse } from '~/utils/api'

interface UseDataTableOption {
  fetchDataFunc: FetchDatatableFunc
  headers: DataTableHeader[]
  initFetchExtraParams?: any
  initItemPerPage?: number
  editable?: boolean
  editUpdateRowCallback?: DataTableUpdateRowCallbackFunc
  editValidateData?: (item: any) => boolean
  editAxiosOption?: AxiosOption
}

const useDataTable = (option: UseDataTableOption): DataTableHandler => {
  // store data of table
  const items = ref([])

  const focused = ref(false)

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
    options.value.page = 1
  })

  // store all selected rows
  const selectedRows = ref([])

  const defaultSelectedCell = {
    row: '',
    column: '',
    value: '',
    origin: '',
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
      selectedCell.value.value = selectedCell.value.origin
      nextTick(() => {
        selectedCell.value.render = false
      })
    })
    // selectedCell.value.render = false;
  }

  // store value for trigger reload datatable, could reload every 3 seconds
  const draw = ref(1)

  const fetchExtraParams = ref<any>(option.initFetchExtraParams || {} as any)

  watch(fetchExtraParams, () => {
    options.value.page = 1
    clearSelectionAndReload()
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
    selectedRows.value = []
    resetSelectedCell()
    reloadTableFn(delay)
  }

  const updateSelectedCell = (row: any, column: any) => {
    selectedCell.value.row = row
    selectedCell.value.column = column
  }

  const fetchDatatableFunc = (loading: Ref, options: DataOptions) => {
    loading.value = true
    option.fetchDataFunc({
      options,
      keyword: searchKeyword.value,
      headers: option.headers,
      params: fetchExtraParams.value
    })
      .then((data: any) => {
        items.value = data.items
        totalItem.value = data.total
        const extra = {
          ...data.extra
        }
        extra.options = makeOptionFromResponse(data.options || {})
        extraData.value = extra
      })
      .finally(() => {
        loading.value = false
      })
  }

  const exportData = (action: string) => {
    return option.fetchDataFunc({
      options: options.value,
      keyword: searchKeyword.value,
      headers: option.headers,
      params: fetchExtraParams.value,
      action: action
    })
  }

  const headers = option.headers

  let updateRowFunc: DataTableUpdateRowFunc | undefined

  if (option.editable) {
    const changeActiveCell = (evt: any) => {
      $('div.editable-datatable').find('table > tbody > tr > td').removeClass('selectedCell')
      const activeCell = $(evt.target).closest('td')
      activeCell.addClass('selectedCell')

      const data: any = items.value[activeCell.parent().index()]
      const row = data.id
      const column = option.headers[activeCell.index()].value
      if (selectedCell.value.row !== row || selectedCell.value.column !== column) {
        selectedCell.value.row = row
        selectedCell.value.column = column
        selectedCell.value.value = data[column]
        selectedCell.value.origin = data[column]
        selectedCell.value.item = data
        selectedCell.value.render = false
      }
    }

    updateRowFunc = makeUpdateRowDatatableFunc(option.editUpdateRowCallback, option.editAxiosOption)

    const computeSelectedCell = () => {
      return [
        selectedCell.value.render,
        selectedCell.value.item,
        selectedCell.value.row,
        selectedCell.value.column,
        selectedCell.value.value,
        selectedCell.value.origin
      ]
    }

    watch(computeSelectedCell, (n, o) => {
      if (o[0] && !n[0] && updateRowFunc) {
        const oldSelectedCell: SelectedCellDataTable = {
          row: o[2],
          column: o[3],
          value: o[4],
          origin: o[5],
          item: o[1],
          render: false
        }
        const isValid = (!option.editValidateData) || option.editValidateData(oldSelectedCell.item)
        updateRowFunc!(!isValid, oldSelectedCell.item, oldSelectedCell)
      }
    })

    $(function () {
      $('div.editable-datatable').off('click').on('click', 'table tbody tr td', changeActiveCell)

      $('body').off('keydown').on('keydown', (evt: any) => {
        if ([KeyCode.DownArrow, KeyCode.UpArrow, KeyCode.LeftArrow, KeyCode.RightArrow, KeyCode.Enter, KeyCode.Escape].includes(evt.keyCode)) {
          evt.preventDefault()
          const activeCell = $('div.editable-datatable table td.selectedCell')
          if (activeCell.length > 0) {
            let newCell = null
            switch (evt.keyCode) {
              case KeyCode.DownArrow:
                newCell = activeCell.parent().next().children().eq(activeCell.index())
                break
              case KeyCode.UpArrow:
                newCell = activeCell.parent().prev().children().eq(activeCell.index())
                break
              case KeyCode.RightArrow:
                newCell = activeCell.next('td')
                break
              case KeyCode.LeftArrow:
                newCell = activeCell.prev('td')
                break
              case KeyCode.Enter:
                newCell = activeCell.parent().next().children().eq(activeCell.index())
                break
              case KeyCode.Escape:
                break
            }

            if (newCell !== null) {
              newCell.trigger('click')
              scrollIntoView(newCell, 'div.editable-datatable > div.v-data-table__wrapper')
            }
          }
        } else if (!selectedCell.value.render) {
          selectedCell.value.render = true
        }
      })

      let table = $('div.editable-datatable table')[0];
      window.addEventListener('click', function(e){
        // @ts-ignore
        focused.value = e.target !== null && table.contains(e.target);
        // if (focused.value) {
        //   console.log("Focused")
        // } else {
        //   console.log("Not Focused")
        // }
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
    focused,
    options,
    exportData,
    searchKeyword,
    fetchExtraParams,
    selectAllItems,
    reloadTableFn,
    clearSelectionAndReload,
    updateSelectedCell,
    resetSelectedCell,
    updateRowFunc,
    closeEditor,
    fetchDatatableFunc
  }
}

export default useDataTable
