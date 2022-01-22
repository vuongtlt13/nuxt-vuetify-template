<template>
  <ValidationProvider
    v-slot="v"
    :name="name"
    :rules="rules"
  >
    <v-text-field
      v-model="innerValue"
      :type="type"
      :label="label"
      :error-messages="v.errors"
      :success="v.valid"
      :color="color"
      v-bind="$attrs"
      v-on="$listeners"
    />
  </ValidationProvider>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { useVModel } from '@vueuse/core'

export default defineComponent({
  name: 'TextFieldWithValidation',
  props: {
    rules: { type: [Object, String], default: 'required' },
    value: { type: String, default: '' },
    name: { type: String, required: true },
    type: { type: String, default: 'text' },
    label: { type: String, default: '' },
    color: { type: String, default: '#00C853' }
  },
  setup (props) {
    const innerValue = useVModel(props, 'value')

    return {
      innerValue
    }
  }
})
</script>
