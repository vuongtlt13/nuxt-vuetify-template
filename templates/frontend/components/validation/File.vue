<template>
  <ValidationProvider
    v-slot="v"
    :name="name"
    :rules="rules"
  >
    <v-file-input
      v-model="file"
      :error-messages="v.errors"
      :success="v.valid && v.validated && v.dirty && showSuccess"
      v-bind="$attrs"
      v-on="$listeners"
    ></v-file-input>
  </ValidationProvider>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@vue/composition-api'
import { useVModel } from '@vueuse/core'

export default defineComponent({
  name: 'ValidationFile',
  props: {
    rules: { type: [Object, String], default: '' },
    showSuccess: { type: Boolean, default: true },
    name: { type: String, required: true },
    value: { type: [Array, File], default: null, required: false },
  },
  setup (props, context) {
    const innerValue = useVModel(props, 'value')
    const file = ref({})
    watch(innerValue, () => {
      file.value = innerValue.value
    })

    watch(file, () => {
      context.emit('input', file.value);
    })
    return {
      innerValue,
      file
    }
  },
  created() {
  }
})
</script>
