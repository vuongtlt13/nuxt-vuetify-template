<template>
  <div>
    Home Page
  </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  layout: 'default',
  middleware: ['auth'],
  computed: mapGetters({
    authenticated: 'auth/check'
  }),
  data () {
    return {
      title: process.env.appName
    }
  },

  head () {
    return { title: 'Home Page' }
  }
})
</script>

<style scoped>
.top-right {
  position: absolute;
  right: 10px;
  top: 18px;
}

.title {
  font-size: 85px;
}

.laravel {
  color: #2e495e;
}

.nuxt {
  color: #00c48d;
}
</style>
