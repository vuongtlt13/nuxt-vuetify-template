import { nextTick, ref, watch } from '@vue/composition-api';
import { makeOptionFromResponse } from "~/utils/api";
import { ProgressStatus } from '~/types';

interface UseCreateModalOption<T> {
  verifyFnBeforeOpen?: any,
  loadImportOptionFn: (params: any) => Promise<any>
  loadImportOptionParams?: any
}

function useCreateModal<T> (option: UseCreateModalOption<T>) {
  // for toggle show/hide create modal
  const importDialog = ref(false)
  const importData = ref({})
  const importOptions = ref({})
  const importProgress  = ref<ProgressStatus>({
    total: 0,
    done: 0
  })
  const showProgress = ref(false)

  const resetImportData = () => {
    nextTick(() => {
      importData.value = {}
    })
  }

  watch(importDialog, (currentValue) => {
    if (currentValue) {
      if (option.loadImportOptionFn) {
        option.loadImportOptionFn(option.loadImportOptionParams)
          .then((resp) => {
            importOptions.value = makeOptionFromResponse(resp.data.data)
          })
          .catch(err => {
            console.log("Error", err)
            importDialog.value = false
          })
      }
    }
  })

  const showImportDialog = () => {
    if (!option.verifyFnBeforeOpen || option.verifyFnBeforeOpen()) importDialog.value = true
  }

  return {
    importDialog,
    importData,
    importOptions,
    importProgress,
    showProgress,
    showImportDialog,
    resetImportData
  }
}

export default useCreateModal;
