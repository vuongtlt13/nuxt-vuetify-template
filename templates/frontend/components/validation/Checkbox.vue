<template>
  <ValidationProvider
    v-slot="v"
    :name="name"
    :rules="rules"
  >
    <v-checkbox
      v-model="checked"
      :error-messages="v.errors"
      :success="v.valid && v.validated && v.dirty && showSuccess"
      v-bind="$attrs"
      v-on="$listeners"
    ></v-checkbox>
  </ValidationProvider>
</template>

<script lang="ts">
import { defineComponent, ref, toRef, watch } from '@nuxtjs/composition-api'
import { useVModel } from '@vueuse/core'

export default defineComponent({
  name: 'ValidationCheckbox',
  props: {
    rules: { type: [Object, String], default: '' },
    showSuccess: { type: Boolean, default: false },
    name: { type: String, required: true },
    value: { type: Boolean, default: () => false },
  },
  setup (props, context) {
    const innerValue = useVModel(props, 'value')
    const checked = ref(innerValue.value)

    watch(checked, () => {
      context.emit('input', checked.value);
    })

    watch(innerValue, () => {
      checked.value = innerValue.value
    })

    return {
      checked,
    }
  }
})
</script>
