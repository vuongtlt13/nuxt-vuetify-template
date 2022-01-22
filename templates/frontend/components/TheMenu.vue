<template>
  <v-list-item-group>
    <v-list-item to="/" active-class="light-blue lighten-4 text--accent-4">
      <v-list-item-icon>
        <v-icon>mdi-home</v-icon>
      </v-list-item-icon>
      <v-list-item-title>Home</v-list-item-title>
    </v-list-item>

    <v-list-item :to="{name: 'users'}" active-class="light-blue lighten-4 text--accent-4">
      <v-list-item-icon>
        <v-icon>mdi-account</v-icon>
      </v-list-item-icon>
      <v-list-item-title>User</v-list-item-title>
    </v-list-item>

    <v-list-item :inactive="true" class="no-active" @click="toggleUseMini">
      <v-list-item-icon>
        <v-icon v-if="isUseMini">
          mdi-chevron-double-right
        </v-icon>
        <v-icon v-if="!isUseMini">
          mdi-chevron-double-left
        </v-icon>
      </v-list-item-icon>
      <v-list-item-title>Collapse</v-list-item-title>
    </v-list-item>
  </v-list-item-group>
</template>

<script lang="ts">

import { mapGetters, mapActions } from 'vuex'
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'TheMenu',
  computed: {
    ...mapGetters([
      'isUseMini'
    ])
  },
  methods: {
    ...mapActions([
      'toggleUseMini'
    ])
  }
})
</script>

<style scoped>
.no-active:hover {
  cursor: pointer;
}
</style>
