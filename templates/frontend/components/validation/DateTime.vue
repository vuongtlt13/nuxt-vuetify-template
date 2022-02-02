<template>
  <ValidationProvider
    v-slot="v"
    :name="name"
    :rules="rules"
  >
    <v-menu
      v-model="showMenu"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="auto"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="formattedDateTime"
          persistent-hint
          prepend-icon="mdi-calendar"
          readonly
          v-bind="{
            ...attrs,
            ...$attrs
          }"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker
        v-model="innerValue"
        no-title
        v-on="$listeners"
        @input="showMenu = false"
      ></v-date-picker>
    </v-menu>
  </ValidationProvider>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@vue/composition-api'
import { useVModel } from '@vueuse/core'
import useDateTimeFormat from "~/components/composables/useDateTimeFormat";

export default defineComponent({
  name: 'ValidationDateTime',
  props: {
    rules: { type: [Object, String], default: '' },
    showSuccess: { type: Boolean, default: true },
    name: { type: String, required: true },
    value: { type: [Object, String], default: "" },
  },
  setup (props, context) {
    const innerValue = useVModel(props, 'value')
    const showMenu = ref<Boolean>(false)
    const {dateTimeFormat, formatDateTimeFn, parseDateTimeFn} = useDateTimeFormat()

    return {
      innerValue,
      dateTimeFormat,
      showMenu,
      formatDateTimeFn,
      parseDateTimeFn
    }
  },
  computed: {
    formattedDateTime (): string {
      if (this.innerValue == "") return "";
      return this.formatDateTimeFn(this.innerValue)
    }
  },
  created() {
  }
})
</script>
