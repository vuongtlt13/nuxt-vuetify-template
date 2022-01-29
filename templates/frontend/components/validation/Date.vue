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
          v-model="formattedDate"
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
        :locale="locale"
      ></v-date-picker>
    </v-menu>
  </ValidationProvider>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@vue/composition-api'
import { useVModel } from '@vueuse/core'
import useDateFormat from "~/components/composables/useDateFormat";

export default defineComponent({
  name: 'ValidationDate',
  props: {
    rules: { type: [Object, String], default: '' },
    showSuccess: { type: Boolean, default: true },
    name: { type: String, required: true },
    locale: { type: String, default: () => undefined },
    value: { type: [Object, String], default: "" },
  },
  setup (props, context) {
    const innerValue = useVModel(props, 'value')
    const showMenu = ref<Boolean>(false)
    const {dateFormat, formatDateFn, parseDateFn} = useDateFormat()

    return {
      innerValue,
      dateFormat,
      showMenu,
      formatDateFn,
      parseDateFn
    }
  },
  computed: {
    formattedDate (): string {
      if (this.innerValue == "") return "";
      return this.formatDateFn(this.innerValue)
    }
  },
  created() {
  }
})
</script>
