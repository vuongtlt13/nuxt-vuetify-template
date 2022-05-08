<template>
  <v-list
    nav
    dense
    shaped
    subheader
  >
    <v-list-item-group>
      <MenuNoChild
        to="/"
        activeClass="light-blue lighten-4 text--accent-4"
        icon="mdi-home"
        :title="$t('app.homepage')"
      />
      <template v-for="menu in menuComponents">
        <template v-if="isShowable(menu)">
          <MenuNoChild v-if="menu.type === MenuType.NO_CHILD"
                       :to="menu.to"
                       :title="$t(menu.title)"
                       :active-class="menu.activeClass"
                       :icon="menu.icon"
          />
          <MenuHasChild v-else-if="menu.type === MenuType.HAS_CHILD"
                        :to="menu.to"
                        :title="$t(menu.title)"
                        :active-class="menu.activeClass"
                        :icon="menu.icon"
                        :children="menu.children"
          />
          <v-divider v-else-if="menu.type === MenuType.DIVIDER"></v-divider>
          <v-subheader v-else-if="menu.type === MenuType.SUB_HEADER" :class="menu.class">
            <span :class="(isUseMini ? ' d-none':'')">{{ menu.title }}</span>
          </v-subheader>
        </template>
      </template>

      <v-list-item :inactive="true" class="no-active" @click="toggleUseMini">
        <v-list-item-title>
          <v-icon v-if="isUseMini">
            mdi-chevron-double-right
          </v-icon>
          <v-icon v-if="!isUseMini">
            mdi-chevron-double-left
          </v-icon>
        </v-list-item-title>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script lang="ts">

import { mapActions, mapGetters } from 'vuex'
import { defineComponent } from '@nuxtjs/composition-api'
import menuComponents, { Menu } from '~/utils/menu';
import MenuNoChild from '~/components/menu/NoChild.vue';
import MenuHasChild from '~/components/menu/HasChild.vue';
import { MenuType } from '~/utils/constants';
import { $store } from '~/utils/store';

export default defineComponent({
  name: 'TheMenu',
  components: {
    MenuNoChild,
    MenuHasChild
  },
  data () {
    return {
      menuComponents,
      MenuType
    }
  },
  computed: {
    ...mapGetters([
      'isUseMini'
    ])
  },
  methods: {
    ...mapActions([
      'toggleUseMini'
    ]),
    isShowable (menu: Menu) {
      const user = $store.getters['auth/user'] || {};

      if ((user.roles || []).includes("super_admin")) return true;

      const userPermissions = user.permissions || [];
      let inValid = false;
      (menu.permissions || []).map(function (permission: string) {
        if (!userPermissions.includes(permission)) inValid = true;
      })
      return !inValid;
    }
  }
})
</script>

<style scoped>
.no-active:hover {
  cursor: pointer;
}
</style>
