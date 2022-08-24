<template>
  <ValidationProvider
    v-slot="v"
    :name="name"
    :rules="rules"
  >
    <v-select
      :items="options"
      v-model="innerValue"
      :error-messages="v.errors"
      :success="v.valid && v.validated && v.dirty && showSuccess"
      v-bind="$attrs"
      v-on="$listeners"
      style="padding-top: 9px"
    ></v-select>
  </ValidationProvider>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { useVModel } from '@vueuse/core'

export default defineComponent({
  name: 'ValidationSelect',
  props: {
    rules: { type: [Object, String], default: '' },
    showSuccess: { type: Boolean, default: true },
    name: { type: String, required: true },
    options: { type: Array, require: true },
    value: { type: [String, Number], default: '' },
  },
  setup (props) {
    const innerValue = useVModel(props, 'value')
    return {
      innerValue
    }
  },
  created () {
  }
})
</script>
