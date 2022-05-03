<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant="isUseMini"
    width="16vw"
    style="max-width: 215px;"
    :permanent="drawer"
    app
    clipped
  >
    <TheMenu/>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { mapActions, mapGetters } from 'vuex'
import { defineComponent } from '@nuxtjs/composition-api'
import TheMenu from '~/components/TheMenu.vue';

export default defineComponent({
  name: 'TheNavigation',
  components: { TheMenu },
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
