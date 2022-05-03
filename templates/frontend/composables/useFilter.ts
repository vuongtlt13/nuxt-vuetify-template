import { onMounted, Ref, ref } from '@nuxtjs/composition-api';
import { makeOptionFromResponse } from '~/utils/api';

interface UseFilterOption<T> {
  defaultData?: T
  loadFilterOptionFn?: (params: any) => Promise<any>
  loadFilterOptionParams?: any
}

function useFilter<T> (option: UseFilterOption<T>) {
  // for toggle show/hide create modal
  const filters: Ref<T> = ref(({
    ...option.defaultData
  } || {}) as T) as Ref<T>

  const options = ref({})

  onMounted(() => {
    if (option.loadFilterOptionFn)
      option.loadFilterOptionFn(option.loadFilterOptionParams)
        .then((resp) => {
          options.value = makeOptionFromResponse(resp.data.data)
        })
  })

  return {
    filters,
    options,
  }
}

export default useFilter;
