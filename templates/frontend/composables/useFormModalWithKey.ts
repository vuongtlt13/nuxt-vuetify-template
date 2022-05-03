import { Ref, ref, watch } from '@nuxtjs/composition-api';
import { AxiosResponse } from 'axios';
import {
  CallbackOptions,
  defaultSuccessCallbackFn,
  ErrorCallbackFunction,
  FinallyCallbackFunction,
  SuccessCallbackFunction
} from '~/utils';
import { makeOptionFromResponse } from "~/utils/api";

interface UseFormModalWithKeyOption<T> {
  defaultData?: T
  loadOptionFn?: (id: any, params: any) => Promise<any>
  loadOptionParams?: any
  handleSubmitFn: (id: any, data: T) => Promise<any>
  successCallbackFn?: SuccessCallbackFunction
  successCallbackOption?: CallbackOptions,
  errorCallbackFn?: ErrorCallbackFunction
  errorCallbackOption?: CallbackOptions,
  finallyCallbackFn?: FinallyCallbackFunction
  finallyCallbackOption?: CallbackOptions,
  keyFn?: (data: T) => any
  key?: string
}

function useFormModalWithKey<T> (option: UseFormModalWithKeyOption<T>) {
  // for toggle show/hide update modal
  const showDialog = ref(false)
  const formOptions = ref({})
  const formData: Ref<T> = ref({
    ...option.defaultData
  } as T || {} as T) as Ref<T>

  const keyFunc = option.keyFn
    ? (option.keyFn)
    : (
      option.key
        ? ((data: T) => {
          return (data as any)[option.key!]
        })
        : ((data: T) => {
          return (data as any).id
        })
    )

  const resetFormDataFn = () => {
    formData.value = ({
      ...option.defaultData
    } as T || {} as T)
  }

  watch(showDialog, (currentValue) => {
    const id = keyFunc(formData.value)
    if (currentValue && id) {
      if (option.loadOptionFn) {
        option.loadOptionFn(id, option.loadOptionParams)
          .then((resp) => {
            formOptions.value = makeOptionFromResponse(resp.data.data)
            if (resp.data.data.item) formData.value = resp.data.data.item
          })
          .catch(err => {
            console.log("Error", err)
            showDialog.value = false
          })
      }
    }
  })

  const showEditItem = (item: any) => {
    formData.value = {
      ...formData.value,
      ...item,
    }
    showDialog.value = true
  }

  const showEditItemByDoubleClick = (_: any, { item }: any) => {
    showEditItem(item)
  }

  const handleSubmitFn = (id: any, data: T) => {
    const callbackFn = option.successCallbackFn || defaultSuccessCallbackFn
    return option.handleSubmitFn(id, data)
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

  return {
    formData,
    showDialog,
    formOptions,
    keyFunc,
    showEditItem,
    showEditItemByDoubleClick,
    handleSubmitFn,
    resetFormDataFn
  }
}

export default useFormModalWithKey;
