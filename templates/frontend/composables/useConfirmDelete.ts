import { Ref } from '@vue/composition-api';
import { defaultSuccessCallbackFn, SuccessCallbackFunction } from '~/utils';
import Vue from 'vue';
import { i18n } from '~/plugins/i18n';
import { AxiosOption } from '~/types';
import { JobHandler, wrappedAxiosHandler } from '~/utils/job-handler';

interface UseDeleteModalOption<T> {
  deleteRecordFn: (data: T, axiosOpts?: AxiosOption) => Promise<any>
  selectedItem: Ref,
  selectedRows: Ref,
  clearSelectionAndReloadFn: any,
  successCallbackFn?: SuccessCallbackFunction
  successCallbackOption?: any,
  keyFn?: (data: T) => any,

}

function useConfirmDelete<T> (option: UseDeleteModalOption<T>) {
  const keyFunc = option.keyFn
    ? (option.keyFn)
    :  (
      (data: any) => {
        return data.id
      }
    )

  const deleteItem = (data: T, isReload = false, axiosOpts?: AxiosOption) => {
    const callbackFn = option.successCallbackFn || defaultSuccessCallbackFn
    const id = keyFunc(data)
    return option.deleteRecordFn(id, axiosOpts).then((resp) => {
      callbackFn(resp, option.successCallbackOption)
      if (isReload) option.clearSelectionAndReloadFn()
    })
  }

  const showDeleteItemConfirm = (item: never) => {
    option.selectedItem.value = Object.assign({}, item)
    Vue.swal.fire({
      title: i18n.t('crud.delete_title').toString(),
      text: i18n.t('crud.confirm_delete_text').toString(),
      icon: 'error',
      confirmButtonText: 'OK',
      showCancelButton: true
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        return deleteItem(item, true);
      }
    });
  }

  const showDeleteItemsConfirm = () => {
    if (option.selectedRows.value.length > 0) {
      Vue.swal.fire({
        title: i18n.t('crud.delete_title').toString(),
        text: i18n.t('crud.confirm_delete_multi_text').toString(),
        icon: 'error',
        confirmButtonText: 'OK',
        showCancelButton: true
      }).then(({ isConfirmed }) => {
        if (isConfirmed) {
          return deleteSelectedRows();
        }
      });
    }
  }

  const handlerFn = async (data: any) => {
    return wrappedAxiosHandler(deleteItem(data.item, data.isReload, {
        notifyWhenSuccess: false,
        notifyWhenError: false
      }
    ))
  }

  const deleteSelectedRows = () => {
    if (option.selectedRows.value.length == 1) return deleteItem(option.selectedRows.value[0], true);
    else {
      const jobHandler = new JobHandler(
        handlerFn,
        undefined,
        option.selectedRows.value.map((item: any, index: number) => {
          let isReload = index == option.selectedRows.value.length - 1;
          return { item, isReload }
        }),
        {
          finishText: i18n.t('crud.delete_multi_done').toString()
        }
      )
      return jobHandler.start()
    }
  }

  return {
    showDeleteItemConfirm,
    showDeleteItemsConfirm,
    deleteItem,
    deleteSelectedRows
  }
}

export default useConfirmDelete;
