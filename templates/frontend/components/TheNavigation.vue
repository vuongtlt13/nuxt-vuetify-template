<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant="isUseMini"
    :permanent="drawer"
    app
    clipped
  >
    <v-list
      nav
      dense
    >
      <TheMenu />
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { mapActions, mapGetters } from 'vuex'
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'TheNavigation',
  computed: {
    ...mapGetters([
      'isDrawer',
      'isUseMini'
    ]),
    drawer: {
      get (): any {
        return this.isDrawer
      },

      set (val: boolean) {
        this.setDrawer(val)
      }
    }
  },

  methods: {
    ...mapActions(['setDrawer'])
  }
})
</script>

<style scoped>
</style>
