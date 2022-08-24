<template>
  <div>
    <v-data-table
      v-model="datatableHandler.selectedRows.value"
      :class="dataTableClasses"
      :headers="finalHeaders"
      :height="height"
      :item-key="itemKey"
      :items="datatableHandler.items.value"
      :items-per-page="datatableHandler.itemsPerPage.value"
      :loading="loading"
      :multi-sort="multiSort"
      :options.sync="datatableHandler.options.value"
      :page.sync="page"
      :server-items-length="datatableHandler.totalItem.value"
      :show-select="showSelect"
      :single-select="singleSelect"
      :style="dStyle"
      fixed-header
      hide-default-footer
      v-bind="$attrs"
      v-on="$listeners"
      @page-count="pageCount = $event"
      @click:row="selectOrUnselectRow"
    >
      <template v-for="(_, slot) of $scopedSlots" #[slot]="scope">
        <slot :name="slot" v-bind="scope"/>
      </template>
      <template v-for="column in editableColumns" v-if="editable" #[`item.${column.value}`]="slotProps">
        <ValidationObserver
          v-if="shouldShowEditor(slotProps, datatableHandler.selectedCell, column, datatableHandler.focused.value)"
          v-slot="{ invalid }">
          <ValidationText
            v-model="datatableHandler.selectedCell.value.value"
            :autofocus="true"
            :hide-details="true"
            :name="column.value"
            :rules="column.rules"
            :width="column.width"
            dense
            single-line
            @focus="$event.target.select()"
            @keydown.enter="datatableHandler.updateRowFunc(invalid, slotProps.item, datatableHandler.selectedCell.value)"
            @keydown.esc="datatableHandler.closeEditor"
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
          :style="pStyle"
          :total-visible="totalVisible"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">

import { DataTableHeader } from 'vuetify'
import { defineComponent, PropType, Ref, ref, watch } from '@nuxtjs/composition-api'
import { DataTableHandler, EditableColumnDataTable, SelectedCellDataTable } from '~/types'
import ValidationText from '~/components/validation/Text.vue';

export default defineComponent({
  name: 'BaseDataTable',
  components: {ValidationText},
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
    itemKey: {type: String, default: 'id'},
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
  setup(props) {
    const page = ref(1)
    const pageCount = ref(0)

    const loading = ref(false)

    const selectOrUnselectRow = (_: any, row: any) => {
      row.select(!row.isSelected)
    }

    let searchJob: any = null
    // const getDataFromApi = () => {
    //   props.datatableHandler!.fetchDatatableFunc(loading, options.value)
    // }

    watch(props.datatableHandler!.options, (o, n) => {
      props.datatableHandler!.fetchDatatableFunc(loading, props.datatableHandler!.options.value)
    })

    watch(props.datatableHandler!.searchKeyword, (currentVal, oldVal) => {
      if (currentVal !== oldVal) {
        if (searchJob !== null) {
          clearTimeout(searchJob)
        }

        searchJob = setTimeout(() => {
          props.datatableHandler!.options.value.page = 1
          props.datatableHandler!.fetchDatatableFunc(loading, props.datatableHandler!.options.value)
        }, props.searchDelay)
      }
    })

    watch(props.datatableHandler!.draw, () => {
      props.datatableHandler!.fetchDatatableFunc(loading, props.datatableHandler!.options.value)
    })

    return {
      loading,
      pageCount,
      page,
      selectOrUnselectRow
    }

  },

  computed: {
    finalHeaders(): DataTableHeader[] {
      if (this.headers?.length > 0) return this.headers
      return this.datatableHandler!.headers
    },
    dataTableClasses(): string {
      let classes = this.tableClasses
      if (this.editable) {
        classes = classes + " editable-datatable"
      }
      return classes;
    }
  },

  methods: {
    shouldShowEditor(props: any, selectedCell: Ref<SelectedCellDataTable>, column: any, focused: boolean): boolean {
      return props.item.id == selectedCell.value.row
        && column.value === selectedCell.value.column
        && selectedCell.value.render
        && focused
    }
  }
})

</script>

<style scoped>

</style>
