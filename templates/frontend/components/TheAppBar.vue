<template>
  <v-app-bar app clipped-left :height="appBarHeight" elevation="1">
    <v-row>
      <v-col class="col-7">
        <v-row>
          <v-col sm="3" md="2" lg="1" class="pa-0">
            <img
              alt="logo"
              src="@/static/logo.png"
              :height="appBarHeight"
              style="cursor: pointer"
              @click="gotoHomepage()"
            >
          </v-col>
          <v-col style="margin: auto" class="d-none d-sm-flex" lg="11" sm="9" md="10">
            <div class="text-center text-uppercase text-h5" style="cursor: pointer" @click="gotoHomepage()">
              {{ companyName }}
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col class="col-5 pa-0">
        <TheRightAppBar/>
      </v-col>
    </v-row>
  </v-app-bar>
</template>

<script lang="ts">

import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  data () {
    return {
      appBarHeight: 50
    }
  },

  computed: {
    companyName () {
      return this.$store.state.config.companyName
    }
  },

  methods: {
    gotoHomepage () {
      this.$router.push('/')
    }
  }
})
</script>

<style scoped>

</style>
