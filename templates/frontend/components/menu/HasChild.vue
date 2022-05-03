<template>
  <v-list-group
    :prepend-icon="!subGroup ? icon : null"
    no-action
    :value="value"
    :sub-group="subGroup"
    append-icon="mdi-chevron-down"
  >
    <template v-slot:activator>
      <v-list-item-content>
        <v-list-item-title class="text-left">{{ title }}</v-list-item-title>
      </v-list-item-content>
    </template>

    <template v-for="menu in children">
      <MenuNoChild v-if="menu.type === MenuType.NO_CHILD"
                   :to="menu.to"
                   :title="$t(menu.title)"
                   :active-class="menu.activeClass"
                   :icon="menu.icon"
                   style="padding-left: 32px;"
      />
      <MenuHasChild v-else-if="menu.type === MenuType.HAS_CHILD"
                    :to="menu.to"
                    :title="$t(menu.title)"
                    :active-class="menu.activeClass"
                    :icon="menu.icon"
                    :children="menu.children"
                    style="padding-left: 8px;"
                    :sub-group="true"
      />
    </template>
    <!--    <v-list-item>-->
    <!--      <v-list-item-content>-->
    <!--        <v-list-item-title>Chan</v-list-item-title>-->
    <!--      </v-list-item-content>-->
    <!--    </v-list-item>-->

  </v-list-group>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { MenuType } from '~/utils/constants';

export default defineComponent({
  name: "MenuHasChild",
  head: {},
  props: {
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
    children: {
      type: Array,
      required: true
    },
    subGroup: {
      type: Boolean,
      default: false
    },
    value: {
      type: Boolean,
      default: true
    }
  },
  setup () {
  },
  data () {
    return {
      MenuType
    }
  }
})
</script>

<style scoped>

</style>
