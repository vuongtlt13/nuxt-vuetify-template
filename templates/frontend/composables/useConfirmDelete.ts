import { Ref } from '@vue/composition-api';
import { defaultSuccessCallbackFn, SuccessCallbackFunction } from '~/utils';
import Vue from 'vue';
import { i18n } from '~/plugins/i18n';
import { AxiosOption, JobStatus } from '~/types';
import { JobHandler, wrappedAxiosHandler } from '~/utils/job-handler';

interface UseDeleteModalOption<T> {
  deleteRecordFn: (data: T, axiosOpts?: AxiosOption) => Promise<any>
  selectedItem: Ref,
  selectedRows: Ref,
  clearSelectionAndReloadFn: any,
  successCallbackFn?: SuccessCallbackFunction
  successCallbackOption?: any
}

function useConfirmDelete<T> (option: UseDeleteModalOption<T>) {
  const deleteItem = (data: T, isReload = false, axiosOpts?: AxiosOption) => {
    const callbackFn = option.successCallbackFn || defaultSuccessCallbackFn
    return option.deleteRecordFn(data, axiosOpts).then((resp) => {
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

  return {
    showDeleteItemConfirm,
    showDeleteItemsConfirm,
    deleteItem,
    deleteSelectedRows
  }
}

export default useConfirmDelete;
