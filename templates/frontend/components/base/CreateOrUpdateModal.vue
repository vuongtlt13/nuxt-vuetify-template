<template>
  <v-dialog
    v-model="dialog"
    :width="width"
    :max-width="maxWidth"
  >
    <ValidationObserver ref="obs" v-slot="{ invalid }">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <slot name="fields" :init-data="innerData" :on-change="changeData"/>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer/>
          <v-btn
            color="blue darken-1"
            text
            @click="closeModal"
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            :disabled="invalid"
            @click="callSubmitFn"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </ValidationObserver>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, onBeforeUpdate, ref, toRef } from '@vue/composition-api'
import { useVModel } from '@vueuse/core'

export default defineComponent({
  name: 'CreateOrUpdateModal',
  props: {
    isShow: Boolean,
    formTitle: { type: String, default: '' },
    width: {
      type: String,
      default: "70vw"
    },
    maxWidth: {
      type: String,
      default: "800px"
    },
    data: {
      type: Object,
      default: () => {
      }
    },
    handleSubmit: {
      type: Function,
      required: true
    },
    handleCancel: {
      type: Function,
      default: null
    }
  },

  setup (props, context) {
    const dialog = useVModel(props, 'isShow', context.emit)
    const innerData = toRef(props, 'data')
    const key = ref(null)

    const changeData = (data: any) => {
      innerData.value = data
    }

    onBeforeUpdate(() => {
      if (key.value === undefined || key.value === null) {
        key.value = innerData.value.id // TODO: handle multi keys
      }
    })

    const callSubmitFn = () => {
      if (key.value !== undefined && key.value !== null) {
        // @ts-ignore
        props.handleSubmit(key.value, innerData.value)
      } else {
        // @ts-ignore
        props.handleSubmit(innerData.value)
      }
    }

    return {
      dialog,
      innerData,
      changeData,
      callSubmitFn
    }
  },

  methods: {
    closeModal () {
      this.dialog = false
      if (this.handleCancel) {
        // @ts-ignore
        this.handleCancel(this.$refs.obs.reset())
      }
    }
  }

})
</script>

<style scoped>

</style>
