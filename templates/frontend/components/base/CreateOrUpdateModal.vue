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
            <slot name="fields" :init-data="innerData" :options="options" :on-change="changeData"/>
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
    formTitle: {type: String, default: ''},
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
        return {}
      }
    },
    options: {
      type: Object,
      default: () => {
        return {}
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
      key.value = innerData.value.id // TODO: handle multi keys
    })

    return {
      key,
      dialog,
      innerData,
      changeData,
    }
  },
  methods: {
    closeModal () {
      this.dialog = false
      if (this.handleCancel) {
        // @ts-ignore
        this.handleCancel(this.$refs.obs.reset())
      }
    },

    callSubmitFn () {
      if (this.key !== undefined && this.key !== null) {
        // @ts-ignore
        this.handleSubmit(this.key, this.innerData)
          .then(() => {
            // @ts-ignore
            this.$refs.obs.reset()
          })
          .catch((err: any) => {
            let errors = err.response.data.error;
            if (errors) {
              // @ts-ignore
              this.$refs.obs.setErrors(errors)
            }
          })
      } else {
        // @ts-ignore
        this.handleSubmit(this.innerData)
          .then(() => {
            // @ts-ignore
            this.$refs.obs.reset()
          })
          .catch((err: any) => {
            let errors = err.response.data.error;
            if (errors) {
              // @ts-ignore
              this.$refs.obs.setErrors(errors)
            }
          })
      }
    }
  }

})
</script>

<style scoped>

</style>
