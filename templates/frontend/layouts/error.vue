<template>
  <v-app dark>
    <h1>
      {{ errorMessage }}
    </h1>
    <NuxtLink :to="urlAction">
      {{ textAction }}
    </NuxtLink>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { HttpCode } from '~/utils/constants';
import { i18n } from '~/plugins/i18n';

export default defineComponent({
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: () => {
      }
    }
  },

  data () {
    return {}
  },

  computed: {
    errorMessage (): string {
      if (this.error.statusCode == HttpCode.NOT_FOUND) return i18n.t("app.route_not_found").toString()
      return this.error.message || i18n.t("app.unknown_error").toString()
    },
    textAction (): string {
      return ((this.error.extra || {}).text || this.$t("app.homepage").toString())
    },
    urlAction (): string {
      return ((this.error.extra || {}).url || "/")
    }
  },
  head () {
    const title: string = this.errorMessage
    return {
      title
    }
  }
})
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
