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
            <slot name="fields" :init-data="innerData" :options="options" :progress="innerProgress"/>
          </v-container>
        </v-card-text>

        <v-progress-linear
          :active="showProgress"
          :value="progressValue"
          v-bind="$attrs"
          @click.prevent="() => {}"
        >
          <strong style="font-size: small;">{{ progressLabel }}</strong>
        </v-progress-linear>

        <v-card-actions>
          <v-spacer/>
          <v-btn
            color="blue darken-1"
            text
            @click="closeModal"
          >
            {{ $t('crud.cancel') }}
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            :disabled="invalid || innerProgress.importing"
            @click="callSubmitFn"
          >
            {{ $t('crud.import') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </ValidationObserver>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, onBeforeUpdate, ref, toRef } from '@nuxtjs/composition-api'
import { useVModel } from '@vueuse/core'
import { ProgressStatus } from '~/types';

export default defineComponent({
  name: 'BaseClientImportModal',
  props: {
    isShow: Boolean,
    showProgress: { type: Boolean, default: false },
    progress: {
      type: [Object], default: () => {
        return {
          importing: false,
          total: 0,
          done: 0
        } as ProgressStatus
      }
    },
    formTitle: { type: String, default: '' },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    width: {
      type: String,
      default: "70vw"
    },
    maxWidth: {
      type: String,
      default: "800px"
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
    const innerProgress = useVModel(props, 'progress')

    return {
      dialog,
      innerData,
      innerProgress
    }
  },
  computed: {
    progressLabel (): string {
      return `${(this.progress as ProgressStatus).done}/${(this.progress as ProgressStatus).total} `
    },

    progressValue (): number {
      if ((this.progress as ProgressStatus).total === 0) return 0
      return Math.ceil((this.progress as ProgressStatus).done / (this.progress as ProgressStatus).total * 100)
    }
  },
  methods: {
    async closeModal () {
      if (this.innerProgress.importing) {
        this.innerProgress.importing = false
      }
      this.dialog = false
      if (this.handleCancel) {
        // @ts-ignore
        this.handleCancel(this.$refs.obs.reset())
      } else {
        // @ts-ignore
        this.$refs.obs.reset()
      }
    },

    callSubmitFn () {
      if (!this.innerProgress.importing) {
        this.innerProgress.importing = true
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
          .finally(() => {
            this.innerProgress.importing = false
            // @ts-ignore
            this.handleCancel()
          })
      }
    }
  }

})
</script>

<style scoped>

</style>
