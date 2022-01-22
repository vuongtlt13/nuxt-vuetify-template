import { ref } from '@vue/composition-api';
import { defaultSuccessCallbackFn, SuccessCallbackFunction } from '~/utils';
import { AxiosResponse } from 'axios';
import { ModalActionType } from '~/utils/constants';

interface UseCreateModalOption {
  createRecordFn: (data: any) => Promise<any>
  clearSelectionAndReloadFn: any
  successCallbackFn?: SuccessCallbackFunction
  successCallbackOption?: any,
}

const useCreateModal = (option: UseCreateModalOption) => {
  // for toggle show/hide create modal
  const createDialog = ref(false)
  const actionType = ref(ModalActionType.CREATE)

  const addNewRecord = (data: any) => {
    const callbackFn = option.successCallbackFn || defaultSuccessCallbackFn
    option.createRecordFn(data).then((resp: AxiosResponse) => {
      callbackFn(resp, option.successCallbackOption)
      option.clearSelectionAndReloadFn()
    }).finally(() => {
      createDialog.value = false
    })
  }

  return {
    createDialog,
    actionType,
    addNewRecord,
  }
}

export default useCreateModal;
