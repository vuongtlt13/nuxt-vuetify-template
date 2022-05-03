<template>
  <div>
    <v-data-table
      v-model="datatableHandler.selectedRows.value"
      :class="dataTableClasses"
      :height="height"
      :headers="finalHeaders"
      :items="datatableHandler.items.value"
      :item-key="itemKey"
      :options.sync="options"
      fixed-header
      :server-items-length="datatableHandler.totalItem.value"
      :loading="loading"
      :single-select="singleSelect"
      :page.sync="page"
      :items-per-page="datatableHandler.itemsPerPage.value"
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
      <template v-if="editable" v-for="column in editableColumns" #[`item.${column.value}`]="slotProps">
        <ValidationObserver
          v-slot="{ invalid }"
          v-if="shouldShowEditor(slotProps, datatableHandler.selectedCell, column)">
          <ValidationText
            :width="column.width"
            :rules="column.rules"
            :name="column.value"
            v-model="datatableHandler.selectedCell.value.value"
            :hide-details="true"
            dense
            single-line
            @keydown.enter="datatableHandler.validateAndUpdateRow(invalid, slotProps.item, datatableHandler.selectedCell.value)"
            @keydown.esc="datatableHandler.closeEditor"
            @focus="$event.target.select()"
            :autofocus="true"
          />
        </ValidationObserver>
        <span v-else>{{ slotProps.item[column.value] }}</span>
      </template>
      <template #no-data>
        <p>{{ $t('crud.no_data') }}</p>
      </template>
    </v-data-table>
    <v-row class="pt-2">
      <v-col>
        <slot name="left-paginate"/>
      </v-col>
      <v-col>
        <v-pagination
          v-if="paginate"
          v-model="page"
          :length="pageCount"
          :total-visible="totalVisible"
          :style="pStyle"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">

import { DataOptions, DataTableHeader } from 'vuetify'
import { defineComponent, PropType, Ref, ref, watch } from '@nuxtjs/composition-api'
import { DataTableHandler, EditableColumnDataTable, SelectedCellDataTable } from '~/types'
import ValidationText from '~/components/validation/Text.vue';

export default defineComponent({
  name: 'BaseDataTable',
  components: { ValidationText },
  props: {
    datatableHandler: {
      type: Object as PropType<DataTableHandler>,
      require: true,
    },
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
      type: Array as PropType<DataTableHeader[]>,
      default: () => {
        return []
      }
    },
    searchDelay: {
      type: Number,
      default: 500
    },
    editable: {
      type: Boolean,
      default: false
    },
    editableColumns: {
      type: Array as PropType<EditableColumnDataTable[]>,
      default: () => []
    },
    tableClasses: {
      type: String,
      default: ""
    },
    paginate: {
      type: Boolean,
      default: true
    }
  },
  setup (props) {
    const page = ref(1)
    const pageCount = ref(0)
    const options = ref<DataOptions>({
      page: 1,
      itemsPerPage: props.datatableHandler!.itemsPerPage.value,
      sortBy: [],
      sortDesc: []
    } as unknown as DataOptions)

    const loading = ref(false)

    const selectOrUnselectRow = (_: any, row: any) => {
      row.select(!row.isSelected)
    }

    let searchJob: any = null
    // const getDataFromApi = () => {
    //   props.datatableHandler!.fetchDatatableFunc(loading, options.value)
    // }

    watch(options, (o, n) => {
      props.datatableHandler!.fetchDatatableFunc(loading, options.value)
    })

    watch(props.datatableHandler!.itemsPerPage, (currentValue) => {
      options.value.itemsPerPage = currentValue
    })
    watch(props.datatableHandler!.searchKeyword, (currentVal, oldVal) => {
      if (currentVal !== oldVal) {
        if (searchJob !== null) {
          clearTimeout(searchJob)
        }
        searchJob = setTimeout(() => {
          props.datatableHandler!.fetchDatatableFunc(loading, options.value)
        }, props.searchDelay)
      }
    })
    watch(props.datatableHandler!.draw, () => {
      props.datatableHandler!.fetchDatatableFunc(loading, options.value)
    })

    return {
      options,
      loading,
      pageCount,
      page,
      selectOrUnselectRow
    }

  },

  computed: {
    finalHeaders (): DataTableHeader[] {
      if (this.headers?.length > 0) return this.headers
      return this.datatableHandler!.headers
    },
    dataTableClasses (): string {
      let classes = this.tableClasses
      if (this.editable) {
        classes = classes + " editable-datatable"
      }
      return classes;
    }
  },

  methods: {
    shouldShowEditor (props: any, selectedCell: Ref<SelectedCellDataTable>, column: any): boolean {
      return props.item.id == selectedCell.value.row
        && column.value === selectedCell.value.column
        && selectedCell.value.render
    }
  }
})

</script>

<style scoped>

</style>
