<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">
        Are you sure you want to delete this item?
      </v-card-title>
      <v-card-text>
        <v-icon color="red" size="100px">
          mdi-close-circle-outline
        </v-icon>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="blue darken-1" text @click="closeConfirm">
          Cancel
        </v-btn>
        <v-btn color="blue darken-1" text @click="doHandleConfirm">
          OK
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!--    endregion Confirm modal-->
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { useVModel } from '@vueuse/core'

export default defineComponent({
  name: 'BaseConfirmModal',
  props: {
    isShow: Boolean,
    data: { type: Object, default: null },
    handleConfirm: {
      type: Function,
      required: true
    },
    handleCancel: {
      type: Function,
      default: null
    }
  },

  setup (props, { emit }) {
    const dialog = useVModel(props, 'isShow', emit)
    return {
      dialog
    }
  },

  methods: {
    doHandleConfirm () {
      // @ts-ignore
      this.handleConfirm(this.data)
      this.closeConfirm()
    },

    closeConfirm () {
      this.dialog = false
      this.dialog = false
      if (this.handleCancel) {
        // @ts-ignore
        this.handleCancel()
      }
    }
  }

})
</script>

<style scoped>

</style>
