import { Ref, ref } from '@vue/composition-api';
import { ModalActionType } from '~/utils/constants';
import { AxiosResponse } from 'axios';
import { defaultSuccessCallbackFn, SuccessCallbackFunction } from '~/utils';

interface UseUpdateModalOption {
  updateRecordFn: (id: any, data: any) => Promise<any>
  clearSelectionAndReloadFn: any
  actionType: Ref<string>,
  selectedItem: Ref,
  successCallbackFn?: SuccessCallbackFunction
  successCallbackOption?: any
}

const useUpdateModal = (option: UseUpdateModalOption) => {
  // for toggle show/hide update modal
  const updateDialog = ref(false)

  const showEditItem = (item: any) => {
    option.actionType.value = ModalActionType.UPDATE
    option.selectedItem.value = Object.assign({}, item)
    updateDialog.value = true
    console.log(item)
  }

  const updateRecord = (id: any, data: any) => {
    const callbackFn = option.successCallbackFn || defaultSuccessCallbackFn
    option.updateRecordFn(id, data).then((resp: AxiosResponse) => {
      callbackFn(resp, option.successCallbackOption)
      option.clearSelectionAndReloadFn()
    }).finally(() => {
      updateDialog.value = false
    })
  }

  return {
    updateDialog,
    showEditItem,
    updateRecord
  }
}

export default useUpdateModal;
