<template>
  <v-list-item :to="to" :active-class="activeClass">
    <v-list-item-icon v-if="icon" style="margin-right: 10px!important;">
      <v-icon>{{ icon }}</v-icon>
    </v-list-item-icon>
    <v-list-item-title class="text-left">{{ title }}</v-list-item-title>
  </v-list-item>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: "MenuNoChild",
  props: {
    to: {
      type: [String, Object],
      required: true
    },
    activeClass: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: () => null
    },
    title: {
      type: String,
      required: true
    }
  }
})
</script>

<style scoped>

</style>
