import { Ref, ref } from '@vue/composition-api';
import { ModalActionType } from '~/utils/constants';
import { AxiosResponse } from 'axios';
import { defaultSuccessCallbackFn, SuccessCallbackFunction } from '~/utils';

interface UseUpdateModalOption<T> {
  updateRecordFn: (id: any, data: T) => Promise<any>
  clearSelectionAndReloadFn: any
  actionType: Ref<string>,
  selectedItem: Ref,
  successCallbackFn?: SuccessCallbackFunction
  successCallbackOption?: any
}

function useUpdateModal<T>(option: UseUpdateModalOption<T>) {
  // for toggle show/hide update modal
  const updateDialog = ref(false)

  const showEditItem = (item: any) => {
    option.actionType.value = ModalActionType.UPDATE
    option.selectedItem.value = Object.assign({}, item)
    updateDialog.value = true
  }

  const updateRecord = (id: any, data: T) => {
    const callbackFn = option.successCallbackFn || defaultSuccessCallbackFn
    return option.updateRecordFn(id, data).then((resp: AxiosResponse) => {
      callbackFn(resp, option.successCallbackOption)
      option.clearSelectionAndReloadFn()
      updateDialog.value = false
      return resp
    })
  }

  return {
    updateDialog,
    showEditItem,
    updateRecord
  }
}

export default useUpdateModal;
