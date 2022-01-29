<template>
  <ValidationProvider
    v-slot="v"
    :name="name"
    :rules="rules"
  >
    <v-text-field
      v-model="innerValue"
      :error-messages="v.errors"
      :success="v.valid && v.validated && v.dirty && showSuccess"
      v-bind="$attrs"
      v-on="$listeners"
    />
  </ValidationProvider>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { useVModel } from '@vueuse/core'

export default defineComponent({
  name: 'ValidationText',
  props: {
    rules: { type: [Object, String], default: '' },
    showSuccess: { type: Boolean, default: true },
    name: { type: String, required: true },
    value: { type: String, default: '' },
  },
  setup (props) {
    const innerValue = useVModel(props, 'value')
    return {
      innerValue
    }
  },
  created() {
  }
})
</script>
