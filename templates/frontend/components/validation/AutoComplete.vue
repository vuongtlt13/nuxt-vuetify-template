<template>
  <ValidationProvider
    v-slot="v"
    :name="name"
    :rules="rules"
  >
    <v-autocomplete
      v-model="innerValue"
      :error-messages="v.errors"
      :items="items"
      :loading="isLoading"
      :no-filter="true"
      :search-input.sync="search"
      :success="v.valid && v.validated && v.dirty && showSuccess"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <template v-for="(_, slot) of $scopedSlots" #[slot]="scope">
        <slot :name="slot" v-bind="scope"/>
      </template>
    </v-autocomplete>
  </ValidationProvider>
</template>

<script lang="ts">
import { defineComponent, ref, toRef, watch } from '@nuxtjs/composition-api'
import { useVModel } from '@vueuse/core'
import { DataOptions } from 'vuetify';

export default defineComponent({
  name: 'ValidationAutoComplete',
  props: {
    rules: {type: [Object, String], default: ''},
    showSuccess: {type: Boolean, default: true},
    name: {type: String, required: true},
    initSearchValue: {type: String, default: ''},
    value: {type: [String, Number], default: ''},
    delay: {type: Number, default: 320},
    fetchFn: {type: Function, require: true},
    fetchData: {
      type: Object, default: () => {
        return {}
      }
    },
    reducer: {type: Function, require: true},
    limit: {type: Number, default: 25}
  },
  setup(props) {
    const innerValue = useVModel(props, 'value')
    const search = ref('');
    const initSearch = toRef(props, "initSearchValue")
    const isLoading = ref(false);
    const entries = ref<any[]>([])
    const currentTask = ref<any>(null)

    watch(initSearch, () => {
      search.value = initSearch.value || ""
    })

    watch(search, (currentValue) => {
      if (props.fetchFn) {
        if (!isLoading.value) {
          if (currentTask.value) {
            clearTimeout(currentTask.value)
            currentTask.value = null;
          }
          currentTask.value = setTimeout(() => {
            // Items have already been requested
            isLoading.value = true

            const options: DataOptions = {
              page: 1,
              itemsPerPage: props.limit,
              sortBy: [] as string[],
              sortDesc: [] as boolean[]
            } as DataOptions

            // @ts-ignore
            props.fetchFn({
              options: options,
              keyword: currentValue || '',
              headers: [],
              params: props.fetchData
            })
              .then((resp: any) => {
                const {items} = resp
                entries.value = items;
              })
              .finally(() => {
                isLoading.value = false;
                currentTask.value = null;
              })
          }, props.delay)

        }
      }
    })
    return {
      innerValue,
      search,
      entries,
      isLoading
    }
  },
  computed: {
    items(): any[] {
      return this.entries.map(this.reducer!)
    }
  }
})
</script>
