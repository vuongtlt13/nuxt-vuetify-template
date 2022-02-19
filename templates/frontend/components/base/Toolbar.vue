<template>
  <v-container
    :fluid="true"
  >
    <v-row
      no-gutters
    >
      <v-select
        class="text-center"
        style="max-width: 60px; font-size: 0.7rem"
        :items="items"
        :label="$t('datatable.sLengthMenu')"
        v-model:value="innerItemsPerPage"
      ></v-select>
      <v-btn
        color="primary"
        dark
        x-small
        class="my-auto toolbar-button"
        @click="showCreateOrUpdate"
      >
        <v-icon small>
          mdi-plus
        </v-icon>
      </v-btn>
      <v-btn
        v-if="showImportDialog"
        color="primary"
        dark
        x-small
        class="my-auto toolbar-button"
        @click="showImportDialog"
      >
        <v-icon small>
          mdi-tray-arrow-up
        </v-icon>
      </v-btn>
      <v-btn
        color="primary"
        dark
        x-small
        class="my-auto toolbar-button"
        @click="handleRefreshFn"
      >
        <v-icon small>
          mdi-refresh
        </v-icon>
      </v-btn>
      <v-btn
        color="primary"
        dark
        x-small
        class="my-auto toolbar-button"
        @click="handleDeleteFn"
      >
        <v-icon small>
          mdi-delete
        </v-icon>
      </v-btn>
      <slot name="inner-filter"/>
      <v-spacer/>
      <v-text-field
        v-model="innerSearch"
        append-icon="mdi-magnify"
        :label="$t('crud.search')"
        single-line
        hide-details
        style="max-width: 18vw"
        class="mr-6"
      />
    </v-row>
    <slot name="filters"/>
  </v-container>
</template>

<script lang="ts">

import { defineComponent } from '@vue/composition-api'
import { useVModel } from '@vueuse/core'

export default defineComponent({
  name: 'Toolbar',
  props: {
    dialog: { type: Boolean, required: true },
    showImportDialog: { type: Function, default: null },
    handleRefreshFn: {
      type: Function, default: () => {
      }
    },
    handleDeleteFn: {
      type: Function, default: () => {
      }
    },
    height: { type: String, default: '80px' },
    search: { type: String, default: '' },
    itemsPerPage: { type: Number, default: () => 25 },
    items: {
      type: Array,
      default: () => {
        return [{
          text: '25',
          value: 25
        }, {
          text: '50',
          value: 50
        }, {
          text: '100',
          value: 100
        }, {
          text: 'All',
          value: -1
        }]
      }
    }
  },

  setup (props, context) {
    const syncDialog = useVModel(props, 'dialog', context.emit)
    const innerSearch = useVModel(props, 'search', context.emit)
    const innerItemsPerPage = useVModel(props, 'itemsPerPage', context.emit)
    const showCreateOrUpdate = () => {
      syncDialog.value = true
    }

    return {
      syncDialog,
      innerSearch,
      innerItemsPerPage,
      showCreateOrUpdate
    }
  },
  methods: {}
})
</script>

<style scoped>
.toolbar-button {
  width: 24px !important;
  height: 24px !important;
}
</style>
