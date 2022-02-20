<template>
  <ValidationProvider
    v-slot="v"
    :name="name"
    :rules="rules"
  >
    <v-select
      v-model="innerValue"
      :items="options"
      dense
      :error-messages="v.errors"
      :success="v.valid && v.validated && v.dirty && showSuccess"
      v-bind="$attrs"
      v-on="$listeners"
      style="padding-top: 16px;"
    ></v-select>
  </ValidationProvider>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { useVModel } from '@vueuse/core'
import { options } from "@nuxtjs/i18n/src/templates/options";

export default defineComponent({
  name: 'ValidationSelect',
  props: {
    rules: { type: [Object, String], default: '' },
    showSuccess: { type: Boolean, default: true },
    name: { type: String, required: true },
    options: {type: Array, require: true},
    value: { type: [String, Number], default: '' },
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
