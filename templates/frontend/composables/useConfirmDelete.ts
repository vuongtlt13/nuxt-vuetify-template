import {
  CallbackOptions,
  defaultSuccessCallbackFn,
  ErrorCallbackFunction,
  FinallyCallbackFunction,
  SuccessCallbackFunction
} from '~/utils';
import Vue from 'vue';
import { i18n } from '~/plugins/i18n';
import { AxiosOption } from '~/types';
import { Ref } from '@nuxtjs/composition-api';

interface UseDeleteModalOption<T> {
  selectedRows?: Ref
  deleteRecordFn: (id: any, axiosOpts?: AxiosOption) => Promise<any>
  deleteRecordsFn?: (ids: any[], axiosOpts?: AxiosOption) => Promise<any>
  successCallbackFn?: SuccessCallbackFunction
  successCallbackOption?: CallbackOptions
  errorCallbackFn?: ErrorCallbackFunction
  errorCallbackOption?: CallbackOptions
  finallyCallbackFn?: FinallyCallbackFunction
  finallyCallbackOption?: CallbackOptions
  keyFn?: (data: T) => any,
}

function useConfirmDelete<T> (option: UseDeleteModalOption<T>) {
  const keyFunc = option.keyFn
    ? (option.keyFn)
    : (
      (data: any) => {
        return data.id
      }
    )

  // region delete single item
  const deleteItem = (data: T, axiosOpts?: AxiosOption) => {
    const callbackFn = option.successCallbackFn || defaultSuccessCallbackFn
    const id = keyFunc(data)
    return option.deleteRecordFn(id, axiosOpts)
      .then((resp) => {
        callbackFn(resp, option.successCallbackOption)
      })
      .catch((error) => {
        if (option.errorCallbackFn !== undefined) option.errorCallbackFn(error, option.errorCallbackOption)
      })
      .finally(() => {
        if (option.finallyCallbackFn !== undefined) option.finallyCallbackFn(option.finallyCallbackOption)
      })
  }

  const showDeleteItemConfirm = (item: never) => {
    Vue.swal.fire({
      title: i18n.t('crud.delete_title').toString(),
      text: i18n.t('crud.confirm_delete_text').toString(),
      icon: 'error',
      confirmButtonText: 'OK',
      showCancelButton: true
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        return deleteItem(item);
      }
    });
  }
  // endregion

  // region delete multi items
  let deleteSelectedRows: ((selectedItems: T[], axiosOpts?: AxiosOption) => Promise<any>) | undefined = undefined;
  let showDeleteItemsConfirm: ((selectedItems: any[], axiosOpts?: AxiosOption) => Promise<any> | undefined) | undefined = undefined;
  let showDeleteItemsConfirmFromDatatable: (() => Promise<any> | undefined) | undefined = undefined;

  if (option.deleteRecordsFn !== undefined && option.selectedRows !== undefined) {
    deleteSelectedRows = (selectedItems: T[], axiosOpts?: AxiosOption) => {
      if (selectedItems.length == 1) return deleteItem(selectedItems[0]);
      else {
        const callbackFn = option.successCallbackFn || defaultSuccessCallbackFn
        const ids = selectedItems.map((item) => keyFunc(item))
        return option.deleteRecordsFn!(ids, axiosOpts)
          .then((resp) => {
            callbackFn(resp, option.successCallbackOption)
          })
          .catch((error) => {
            if (option.errorCallbackFn !== undefined) option.errorCallbackFn(error, option.errorCallbackOption)
          })
          .finally(() => {
            if (option.finallyCallbackFn !== undefined) option.finallyCallbackFn(option.finallyCallbackOption)
          })
      }
    }

    showDeleteItemsConfirm = (selectedItems?: any[], axiosOpts?: AxiosOption) => {
      if (selectedItems !== undefined && selectedItems.length > 0) {
        return Vue.swal.fire({
          title: i18n.t('crud.delete_title').toString(),
          text: i18n.t('crud.confirm_delete_multi_text').toString(),
          icon: 'error',
          confirmButtonText: 'OK',
          showCancelButton: true
        }).then(({ isConfirmed }) => {
          if (isConfirmed) {
            return deleteSelectedRows!(selectedItems, axiosOpts);
          }
        });
      }
    }

    showDeleteItemsConfirmFromDatatable = () => {
      return showDeleteItemsConfirm!(option.selectedRows?.value)
    }
  }
  // endregion delete multi items

  // const handlerFn = async (data: any) => {
  //   return wrappedAxiosHandler(deleteItem(data.item, {
  //       notifyWhenSuccess: false,
  //       notifyWhenError: false
  //     }
  //   ))
  // }
  // const jobHandler = new JobHandler(
  //   handlerFn,
  //   undefined,
  //   selectedItems.map((item: any, index: number) => {
  //     let isReload = index == selectedItems.length - 1;
  //     return { item, isReload }
  //   }),
  //   {
  //     finishText: i18n.t('crud.delete_multi_done').toString()
  //   }
  // )
  // return jobHandler.start()

  return {
    showDeleteItemConfirm,
    showDeleteItemsConfirm,
    showDeleteItemsConfirmFromDatatable,
    deleteItem,
    deleteSelectedRows
  }
}

export default useConfirmDelete;
