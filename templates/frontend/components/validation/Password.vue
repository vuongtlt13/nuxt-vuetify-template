<template>
  <ValidationProvider
    v-slot="v"
    :name="name"
    :rules="rules"
  >
    <v-text-field
      v-model="innerValue"
      :type="showPassword ? 'text' : 'password'"
      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :error-messages="v.errors"
      :success="v.valid && v.validated && v.dirty && showSuccess"
      @click:append="showPassword = !showPassword"
      v-bind="$attrs"
      v-on="$listeners"
    />
  </ValidationProvider>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useVModel } from '@vueuse/core'

export default defineComponent({
  name: 'ValidationPassword',
  props: {
    rules: { type: [Object, String], default: '' },
    showSuccess: { type: Boolean, default: true },
    value: { type: String, default: '' },
    name: { type: String, required: true },
  },
  setup (props) {
    const innerValue = useVModel(props, 'value')
    const showPassword = ref<Boolean>(false)
    return {
      innerValue,
      showPassword
    }
  },
  methods: {
  }
})
</script>
