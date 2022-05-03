import { Ref, ref, watch } from '@nuxtjs/composition-api';
import {
  CallbackOptions,
  defaultSuccessCallbackFn,
  ErrorCallbackFunction,
  FinallyCallbackFunction,
  SuccessCallbackFunction
} from '~/utils';
import { AxiosResponse } from 'axios';
import { makeOptionFromResponse } from "~/utils/api";

interface UseFormModalOption<T> {
  defaultData?: T
  loadOptionFn?: (params: any) => Promise<any>
  loadOptionParams?: any
  handleSubmitFn: (data: T) => Promise<any>
  successCallbackFn?: SuccessCallbackFunction
  successCallbackOption?: CallbackOptions
  errorCallbackFn?: ErrorCallbackFunction
  errorCallbackOption?: CallbackOptions
  finallyCallbackFn?: FinallyCallbackFunction
  finallyCallbackOption?: CallbackOptions
}

function useFormModal<T> (option: UseFormModalOption<T>) {
  // for toggle show/hide create modal
  const showDialog = ref(false)
  const formOptions = ref({})
  const formData: Ref<T> = ref({
    ...option.defaultData
  } as T || {} as T) as Ref<T>

  watch(showDialog, (currentValue) => {
    if (currentValue) {
      if (option.loadOptionFn) {
        option.loadOptionFn(option.loadOptionParams)
          .then((resp) => {
            formOptions.value = makeOptionFromResponse(resp.data.data)
          })
          .catch(err => {
            console.log("Error", err)
            showDialog.value = false
          })
      }
    }
  })

  const resetFormDataFn = () => {
    formData.value = {
      ...option.defaultData
    } as T || {} as T
  }

  const handleSubmitFn = (data: T) => {
    const callbackFn = option.successCallbackFn || defaultSuccessCallbackFn
    return option.handleSubmitFn(data)
      .then((resp: AxiosResponse) => {
        callbackFn(resp, option.successCallbackOption)
        resetFormDataFn()
        showDialog.value = false
        return resp
      })
      .catch((error) => {
        if (option.errorCallbackFn !== undefined) option.errorCallbackFn(error, option.errorCallbackOption)
      })
      .finally(() => {
        if (option.finallyCallbackFn !== undefined) option.finallyCallbackFn(option.finallyCallbackOption)
      })
  }

  const showModalFn = () => {
    showDialog.value = true
  }

  return {
    formData,
    showDialog,
    formOptions,
    handleSubmitFn,
    showModalFn,
    resetFormDataFn
  }
}

export default useFormModal;
