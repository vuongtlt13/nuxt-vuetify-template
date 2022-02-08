import { ref, watch } from '@vue/composition-api';
import { defaultSuccessCallbackFn, SuccessCallbackFunction } from '~/utils';
import { AxiosResponse } from 'axios';
import { ModalActionType } from '~/utils/constants';
import { makeOptionFromResponse } from "~/utils/api";

interface UseCreateModalOption<T> {
  loadCreateOptionFn?: (params: any) => Promise<any>
  loadCreateOptionParams?: any
  createRecordFn: (data: T) => Promise<any>
  clearSelectionAndReloadFn: any
  successCallbackFn?: SuccessCallbackFunction
  successCallbackOption?: any,
}

function useCreateModal<T> (option: UseCreateModalOption<T>) {
  // for toggle show/hide create modal
  const createDialog = ref(false)
  const actionType = ref(ModalActionType.CREATE)
  const createOptions = ref({})

  watch(createDialog, (currentValue) => {
    if (currentValue) {
      if (option.loadCreateOptionFn) {
        option.loadCreateOptionFn(option.loadCreateOptionParams)
          .then((resp) => {
            createOptions.value = makeOptionFromResponse(resp.data.data)
          })
          .catch(err => {
            console.log("Error", err)
            createDialog.value = false
          })
      }
    }
  })

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
    createOptions,
  }
}

export default useCreateModal;
