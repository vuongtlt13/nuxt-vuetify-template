import { Ref } from '@vue/composition-api';
import { defaultSuccessCallbackFn, SuccessCallbackFunction } from '~/utils';
import Vue from 'vue';
import { i18n } from '~/plugins/i18n';

interface UseDeleteModalOption<T> {
  deleteRecordFn: (data: T, isSilent: boolean) => Promise<any>
  selectedItem: Ref,
  selectedRows: Ref,
  clearSelectionAndReloadFn: any,
  successCallbackFn?: SuccessCallbackFunction
  successCallbackOption?: any
}

function useConfirmDelete<T>(option: UseDeleteModalOption<T>) {
  const deleteItemConfirm = (data: T, isReload = true) => {
    const callbackFn = option.successCallbackFn || defaultSuccessCallbackFn
    return option.deleteRecordFn(data, false).then((resp) => {
      callbackFn(resp, option.successCallbackOption)
      option.clearSelectionAndReloadFn()
    })
  }

  const showDeleteItem = (item: never) => {
    option.selectedItem.value = Object.assign({}, item)
    Vue.swal.fire({
      title: i18n.t('crud.delete_title').toString(),
      text: i18n.t('crud.confirm_delete_text').toString(),
      icon: 'error',
      confirmButtonText: 'OK',
      showCancelButton: true
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        return deleteItemConfirm(item);
      }
    });
  }

  const deleteSelectedRows = () => {
    return option.selectedRows.value.map((item: any, index: number) => {
      let isReload = index == option.selectedRows.value.length - 1;
      return deleteItemConfirm(item, isReload)
    })
  }

  return {
    showDeleteItem,
    deleteItemConfirm,
    deleteSelectedRows
  }
}

export default useConfirmDelete;
