<template>
  <v-tooltip right>
    <template v-slot:activator="{ on, attrs }">
      <v-list-item :to="to" :active-class="activeClass" v-bind="attrs" v-on="on">
        <v-list-item-icon v-if="icon" style="margin-right: 10px!important;">
          <v-icon>{{ icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title class="text-left">{{ title }}</v-list-item-title>
      </v-list-item>
    </template>
    <span>{{ computedTooltip }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  name: "MenuNoChild",
  computed: {
    computedTooltip (): string {
      return this.tooltip || this.title;
    }
  },
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
      default: ""
    },
    title: {
      type: String,
      required: true
    },
    tooltip: {
      type: String,
      default: ""
    }
  }
})
</script>

<style scoped>

</style>
