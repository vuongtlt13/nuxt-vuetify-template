<template>
  <v-card
    elevation="2"
    rounded="lg"
    style="height: 100%;"
  >
    <BaseDataTable
      height="70vh"
      :headers="headers"
      :search="search"
      :items.sync="items"
      :selected-rows.sync="selectedRows"
      :draw.sync="draw"
      :fetch-data-func="fetchUser"
      :show-select="false"
      @dblclick:row="showEditItemByDoubleClick"
      :items-per-page.sync="itemsPerPage"
    >
      <template #top>
        <BaseToolbar
          :search.sync="search"
          :dialog.sync="createDialog"
          :items-per-page.sync="itemsPerPage"
          :handle-refresh-fn="clearSelectionAndReload"
          :handle-delete-fn="deleteSelectedRows"
        >
          <template #filters>
            <UserFilterAndAction
            />
          </template>
        </BaseToolbar>
      </template>
      <template #item.actions="{ item }">
        <v-icon
          small
          class="orange--text"
          @click.stop.prevent="showEditItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          class="red--text"
          @click.stop.prevent="showDeleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </BaseDataTable>

    <!--    region create modal-->
    <BaseCreateOrUpdateModal
      :is-show.sync="createDialog"
      :form-title="$t('crud.add_new_title_modal', { model: $t('models.user.singular') })"
      :data="selectedItem"
      :handle-submit="addNewRecord"
      :handle-cancel="resetSelectedRow"
    >
      <template #fields="{initData}">
        <UserFields :init-data="initData" :action-type="actionType"/>
      </template>
    </BaseCreateOrUpdateModal>
    <!--    endregion create modal-->

    <!--    region update modal-->
    <BaseCreateOrUpdateModal
      :is-show.sync="updateDialog"
      :form-title="$t('crud.edit_title_modal', { model: $t('models.user.singular') })"
      :data="selectedItem"
      :handle-submit="updateRecord"
      :handle-cancel="resetSelectedRow"
    >
      <template #fields="{initData}">
        <UserFields :init-data="initData" :action-type="actionType"/>
      </template>
    </BaseCreateOrUpdateModal>
    <!--    endregion update modal-->
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import headerDataTable from '~/datatables/user/header'
import UserService from '~/services/user'
import useDataTable from '~/composables/useDataTable';
import useCreateModal from '~/composables/useCreateModal';
import useUpdateModal from '~/composables/useUpdateModal';
import useConfirmDelete from '~/composables/useConfirmDelete';

export default defineComponent({
  layout: 'default',
  name: 'PageUser',
  meta: {
    rp: [
      "users.index"
    ]
  },
  computed: {
  },
  middleware: [
    'auth'
  ],
  setup () {
    // datatable init
    const {
      items,
      itemsPerPage,
      selectedItem,
      selectedRows,
      draw,
      reloadTableFn,
      resetSelectedRow,
      clearSelectionAndReload
    } = useDataTable()

    // create modal
    const { createDialog, actionType, addNewRecord } = useCreateModal({
      createRecordFn: UserService.addNewUser,
      clearSelectionAndReloadFn: clearSelectionAndReload,
    })

    // update modal
    const { updateDialog, showEditItem, updateRecord } = useUpdateModal({
      updateRecordFn: UserService.updateUser,
      selectedItem: selectedItem,
      clearSelectionAndReloadFn: clearSelectionAndReload,
      actionType: actionType,
    })

    const showEditItemByDoubleClick = (_: any, { item }: any) => {
      showEditItem(item)
    }

    // delete confirm
    const { showDeleteItem, deleteItemConfirm, deleteSelectedRows } = useConfirmDelete({
      deleteRecordFn: UserService.deleteUser,
      selectedItem: selectedItem,
      selectedRows: selectedRows,
      clearSelectionAndReloadFn: clearSelectionAndReload
    })

    return {
      createDialog,
      updateDialog,
      selectedItem,
      selectedRows,
      actionType,
      items,
      draw,
      itemsPerPage,
      addNewRecord,
      updateRecord,
      reloadTableFn,
      resetSelectedRow,
      showEditItem,
      showEditItemByDoubleClick,
      showDeleteItem,
      deleteItemConfirm,
      clearSelectionAndReload,
      deleteSelectedRows
    }
  },
  data () {
    return {
      title: process.env.appName,
      headers: headerDataTable(),
      search: ''
    }
  },
  head () {
    return { title: 'home' }
  },
  methods: {
    fetchUser: UserService.fetchUser
  }
})
</script>

<style scoped>
</style>
