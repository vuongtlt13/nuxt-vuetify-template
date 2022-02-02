import { nextTick, ref } from '@vue/composition-api';

const useDataTable = () => {
  // store data of table
  const items = ref([])

  const itemsPerPage = 25

  // store a single selected row
  const selectedItem = ref({})

  // store all selected rows
  const selectedRows = ref([])

  // store value for trigger reload datatable
  const draw = ref(1)
  const reloadTableFn = () => {
    draw.value += 1
  }

  const resetSelectedRow = () => {
    nextTick(() => {
      selectedItem.value = {}
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
