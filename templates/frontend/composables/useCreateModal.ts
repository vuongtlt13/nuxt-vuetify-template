import { ref } from '@vue/composition-api';
import { defaultSuccessCallbackFn, SuccessCallbackFunction } from '~/utils';
import { AxiosResponse } from 'axios';
import { ModalActionType } from '~/utils/constants';

interface UseCreateModalOption<T> {
  createRecordFn: (data: T) => Promise<any>
  clearSelectionAndReloadFn: any
  successCallbackFn?: SuccessCallbackFunction
  successCallbackOption?: any,
}

function useCreateModal<T>(option: UseCreateModalOption<T>) {
  // for toggle show/hide create modal
  const createDialog = ref(false)
  const actionType = ref(ModalActionType.CREATE)

  const addNewRecord = (data: T) => {
    const callbackFn = option.successCallbackFn || defaultSuccessCallbackFn
    return option.createRecordFn(data).then((resp: AxiosResponse) => {
      callbackFn(resp, option.successCallbackOption)
      option.clearSelectionAndReloadFn()
      createDialog.value = false
      return resp
    })
  }

  return {
    createDialog,
    actionType,
    addNewRecord,
  }
}

export default useCreateModal;
