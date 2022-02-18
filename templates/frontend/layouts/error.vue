<template>
  <v-app dark>
    <h1>
      {{ errorMessage }}
    </h1>
    <NuxtLink to="/">
      Home page
    </NuxtLink>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { HttpCode } from '~/utils/constants';
import { i18n } from '~/plugins/i18n';

export default defineComponent({
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: () => {}
    }
  },

  data () {
    return {}
  },

  computed: {
    errorMessage(): string {
      if (this.error.statusCode == HttpCode.NOT_FOUND) return i18n.t("auth.not_found").toString()
      return this.error.message || i18n.t("auth.unknown_error").toString()
    }
  },
  head () {
    const title: string = this.error.statusCode == HttpCode.NOT_FOUND ? this.errorMessage : i18n.t("auth.unknown_error").toString()
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
