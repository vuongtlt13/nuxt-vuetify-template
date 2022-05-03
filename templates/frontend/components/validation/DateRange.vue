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
          v-model="formattedRangeDate"
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
        range
        no-title
        v-on="$listeners"
        @change="showMenu = false"
        :locale="locale"
      ></v-date-picker>
    </v-menu>
  </ValidationProvider>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@nuxtjs/composition-api'
import { useVModel } from '@vueuse/core'
import useDateFormat from "~/composables/useDateFormat";

export default defineComponent({
  name: 'ValidationDateRange',
  props: {
    rules: { type: [Object, String], default: '' },
    showSuccess: { type: Boolean, default: true },
    name: { type: String, required: true },
    locale: { type: String, default: () => undefined },
    value: { type: Array, default: () => ["", ""] },
  },
  setup (props, context) {
    const innerValue = useVModel(props, 'value')
    const showMenu = ref<Boolean>(false)
    const { dateFormat, formatDateFn, parseDateFn } = useDateFormat()

    return {
      innerValue,
      dateFormat,
      showMenu,
      formatDateFn,
      parseDateFn
    }
  },
  computed: {
    formattedRangeDate (): string {
      return `${this.formattedDate(this.innerValue[0])} - ${this.formattedDate(this.innerValue[1])}`
    }
  },
  methods: {
    formattedDate (date: any): string {
      if (date == "") return "";
      return this.formatDateFn(date)
    },
  },
  created () {
  }
})
</script>
