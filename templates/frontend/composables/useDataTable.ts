import { nextTick, ref } from '@vue/composition-api';
import Vue from 'vue';
import { i18n } from '~/plugins/i18n';
import { NOTIFICATION_DURATION } from '~/utils/constants';

const useDataTable = (defaultValue = {}) => {

  // store data of table
  const items = ref([])

  const itemsPerPage = ref(25)

  // store a single selected row
  const selectedItem = ref({ ...defaultValue })

  // store all selected rows
  const selectedRows = ref([])

  // store value for trigger reload datatable, could reload every 3 seconds
  const draw = ref(1)

  // delayTime for refresh
  const delayTime = ref(0)

  const reloadTableFn = () => {
    if ((+new Date() / 1000) - delayTime.value >= 3) {
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
  }

  const resetSelectedRow = () => {
    nextTick(() => {
      selectedItem.value = { ...defaultValue }
    })
  }

  const clearSelectionAndReload = () => {
    selectedRows.value = [];
    resetSelectedRow()
    reloadTableFn()
  }
  return {
    items,
    itemsPerPage,
    selectedItem,
    selectedRows,
    draw,
    reloadTableFn,
    resetSelectedRow,
    clearSelectionAndReload
  }
}

export default useDataTable;
