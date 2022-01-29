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
      :true-value="1"
      :false-value="0"
      v-bind="$attrs"
      v-on="$listeners"
    ></v-checkbox>
  </ValidationProvider>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@vue/composition-api'
import { useVModel } from '@vueuse/core'

export default defineComponent({
  name: 'ValidationCheck',
  props: {
    rules: { type: [Object, String], default: '' },
    showSuccess: { type: Boolean, default: false },
    name: { type: String, required: true },
    value: { type: Number, default: () => 0 },
  },
  setup (props, context) {
    const checked = ref(props.value)
    watch(checked, () => {
      context.emit('input', checked.value);
    })
    return {
      checked,
    }
  },
  created() {
  }
})
</script>
