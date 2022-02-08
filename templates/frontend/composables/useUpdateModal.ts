import { Ref, ref, watch } from '@vue/composition-api';
import { ModalActionType } from '~/utils/constants';
import { AxiosResponse } from 'axios';
import { defaultSuccessCallbackFn, SuccessCallbackFunction } from '~/utils';
import { makeOptionFromResponse } from "~/utils/api";

interface UseUpdateModalOption<T> {
  loadUpdateOptionFn?: (id: any, params: any) => Promise<any>
  loadUpdateOptionParams?: any
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
  const updateOptions = ref({})

  watch(updateDialog, (currentValue) => {
    let id = option.selectedItem.value.id // TODO: improve for multi keys
    if (currentValue && id) {
      if (option.loadUpdateOptionFn) {
        option.loadUpdateOptionFn(id, option.loadUpdateOptionParams)
          .then((resp) => {
            updateOptions.value = makeOptionFromResponse(resp.data.data)
          })
          .catch(err => {
            console.log("Error", err)
            updateOptions.value = false
          })
      }
    }
  })

  const showEditItem = (item: any) => {
    option.actionType.value = ModalActionType.UPDATE
    option.selectedItem.value = Object.assign({}, item)
    updateDialog.value = true
  }

  const showEditItemByDoubleClick = (_: any, { item }: any) => {
    showEditItem(item)
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
    showEditItemByDoubleClick,
    updateRecord,
    updateOptions
  }
}

export default useUpdateModal;
