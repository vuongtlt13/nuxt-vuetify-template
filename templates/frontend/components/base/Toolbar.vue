<template>
  <v-container fluid>
    <v-row
      no-gutters
    >
      <v-select
        v-if="showLengthMenu"
        class="text-center"
        style="max-width: 60px; font-size: 0.7rem"
        :items="items"
        :label="$t('datatable.sLengthMenu')"
        v-model:value="innerItemsPerPage"
      ></v-select>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-if="handleCreateFn"
            color="primary"
            dark
            x-small
            v-bind="attrs"
            v-on="on"
            class="my-auto toolbar-button"
            @click="handleCreateFn"
          >
            <v-icon small>
              mdi-plus
            </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('crud.add_new') }}</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-if="showImportDialog"
            color="primary"
            dark
            x-small
            v-bind="attrs"
            v-on="on"
            class="my-auto toolbar-button"
            @click="showImportDialog"
          >
            <v-icon small>
              mdi-tray-arrow-up
            </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('crud.import') }}</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-if="handleRefreshFn"
            color="primary"
            dark
            x-small
            v-bind="attrs"
            v-on="on"
            class="my-auto toolbar-button"
            @click="handleRefreshFn(true)"
          >
            <v-icon small>
              mdi-refresh
            </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('crud.refresh') }}</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-if="handleDeleteFn"
            color="primary"
            dark
            x-small
            v-bind="attrs"
            v-on="on"
            class="my-auto toolbar-button"
            @click="handleDeleteFn"
          >
            <v-icon small>
              mdi-delete
            </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('crud.delete') }}</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-if="selectAllFn"
            color="primary"
            dark
            x-small
            v-bind="attrs"
            v-on="on"
            class="my-auto toolbar-button"
            @click="selectAllFn"
          >
            <v-icon small>
              mdi-select-all
            </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('crud.select_all') }}</span>
      </v-tooltip>
      <slot name="inner-filter"/>
      <v-spacer/>
      <v-text-field
        v-if="searchable"
        v-model="innerSearch"
        :clearable="true"
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

import { defineComponent } from '@nuxtjs/composition-api'
import { useVModel } from '@vueuse/core'

export default defineComponent({
  name: 'BaseToolbar',
  props: {
    searchable: { type: Boolean, default: true },
    showLengthMenu: { type: Boolean, default: true },
    showImportDialog: { type: Function, default: null },
    handleCreateFn: { type: Function, default: null },
    handleRefreshFn: { type: Function, default: null },
    handleDeleteFn: { type: Function, default: null },
    selectAllFn: { type: Function, default: null },
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
    const innerSearch = useVModel(props, 'search', context.emit)
    const innerItemsPerPage = useVModel(props, 'itemsPerPage', context.emit)

    return {
      innerSearch,
      innerItemsPerPage,
    }
  },
  methods: {}
})
</script>

<style>
.toolbar-button {
  width: 24px !important;
  height: 24px !important;
}
</style>
