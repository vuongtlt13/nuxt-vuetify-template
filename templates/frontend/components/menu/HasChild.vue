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
        <v-list-item-title class="text-left">{{title}}</v-list-item-title>
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

<script>
import {defineComponent} from "@vue/composition-api";
import MenuNoChild from '~/components/menu/NoChild.vue';
import MenuHasChild from '~/components/menu/HasChild.vue';
import { MenuType } from '~/utils/constants';

export default defineComponent({
  name: "MenuHasChild",
  components: {
    MenuNoChild,
    MenuHasChild
  },
  props: {
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
    },
    children: {
      type: Array,
      required: true
    },
    subGroup: {
      type: Boolean,
      default: () => false
    },
    value: {
      type: Boolean,
      default: () => true
    }
  },
  data() {
    return {
      MenuType
    }
  }
})
</script>

<style scoped>

</style>
