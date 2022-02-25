<template>
  <div>
    <v-data-table
      v-model="innerSelectedRows"
      :height="height"
      :headers="headers"
      :items="items"
      :item-key="itemKey"
      :options.sync="options"
      fixed-header
      :server-items-length="totalItem"
      :loading="loading"
      :single-select="singleSelect"
      :page.sync="page"
      :items-per-page="innerItemsPerPage"
      :show-select="showSelect"
      :multi-sort="multiSort"
      hide-default-footer
      @page-count="pageCount = $event"
      @click:row="selectOrUnselectRow"
      v-bind="$attrs"
      v-on="$listeners"
      :style="dStyle"
    >
      <template v-for="(_, slot) of $scopedSlots" #[slot]="scope">
        <slot :name="slot" v-bind="scope"/>
      </template>

      <template #no-data>
        <p>{{ $t('crud.no_data') }}</p>
      </template>
    </v-data-table>
    <div class="pt-2">
      <v-pagination
        v-model="page"
        :length="pageCount"
        :total-visible="totalVisible"
        :style="pStyle"
      />
    </div>
  </div>
</template>

<script lang="ts">

import { DataOptions } from 'vuetify'
import { defineComponent, ref, toRef, watch } from '@vue/composition-api'
import { useVModel } from '@vueuse/core'
import { DataTableFetchDataFunc } from '~/types'

export default defineComponent({
  name: 'BaseDataTable',
  props: {
    height: {
      type: String,
      default: () => undefined
    },
    dStyle: {
      type: String,
      default: () => ''
    },
    pStyle: {
      type: String,
      default: () => ''
    },
    totalVisible: {
      type: Number,
      default: () => 5
    },
    showSelect: {
      type: Boolean,
      default: () => true
    },
    singleSelect: {
      type: Boolean,
      default: () => false
    },
    multiSort: {
      type: Boolean,
      default: () => true
    },
    itemKey: { type: String, default: 'id' },
    headers: {
      type: Array,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    itemsPerPage: {
      type: Number,
      default: 25
    },
    searchDelay: {
      type: Number,
      default: 500
    },
    search: {
      type: String,
      default: ''
    },
    draw: {
      type: Number,
      default: 1
    },
    selectedRows: {
      type: Array,
      default: () => []
    },
    fetchDataFunc: {
      type: Function,
      required: true
    },
    fetchExtraParams: {
      type: Object,
      default: () => {return {}}
    },
  },
  setup (props, { emit }) {
    const page = ref(1)
    const pageCount = ref(0)
    const search = toRef(props, 'search')
    const innerSelectedRows = useVModel(props, 'selectedRows', emit)
    const innerItemsPerPage = useVModel(props, 'itemsPerPage', emit)
    const innerItems = useVModel(props, 'items', emit)
    const innerDraw = useVModel(props, 'draw', emit)
    const options = ref<DataOptions>({
      page: 1,
      itemsPerPage: props.itemsPerPage,
      sortBy: [],
      sortDesc: []
    } as unknown as DataOptions)

    const loading = ref(false)
    // table data
    const totalItem = ref(0)

    const fetchData = async (options: DataOptions, keyword: string) => {
      const {total, items} = await (props.fetchDataFunc as DataTableFetchDataFunc)(
        options,
        keyword,
        props.headers,
        props.fetchExtraParams
      )

      return {
        items,
        total
      }
    }

    const getDataFromApi = () => {
      loading.value = true
      fetchData(options.value, props.search).then((data: any) => {
        innerItems.value = data.items
        totalItem.value = data.total
      }).finally(() => {
        loading.value = false
      })
    }

    const selectOrUnselectRow = (_: any, row: any) => {
      row.select(!row.isSelected)
    }

    let searchJob: any = null
    watch(options, getDataFromApi)
    watch(innerItemsPerPage, (currentValue) => {
      options.value.itemsPerPage = currentValue
    })
    watch(search, (currentVal, oldVal) => {
      if (currentVal !== oldVal) {
        if (searchJob !== null) {
          clearTimeout(searchJob)
        }
        searchJob = setTimeout(() => {
          getDataFromApi()
        }, props.searchDelay)
      }
    })
    watch(innerDraw, getDataFromApi)

    return {
      innerItemsPerPage,
      options,
      loading,
      innerItems,
      totalItem,
      pageCount,
      page,
      innerSelectedRows,
      getDataFromApi,
      selectOrUnselectRow
    }
  },

  computed: {},

  methods: {}
})

</script>

<style scoped>

</style>
