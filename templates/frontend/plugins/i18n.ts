import Vue from 'vue'
import VueI18n from 'vue-i18n'
import ConfigService from '~/services/config'

Vue.use(VueI18n)

export const i18n = new VueI18n({
  locale: process.env.appLocale,
  messages: {}
})

export default async ({ app, store }: any) => {
  if (process.client) {
    await loadMessages(store.getters['lang/locale'])
  }

  app.i18n = i18n
}

/**
 * @param {String} locale
 */
export async function loadMessages (locale: string) {
  if (Object.keys(i18n.getLocaleMessage(locale)).length === 0) {
    const resp = await ConfigService.fetchLanguages(locale)
    const messages = resp.data.data
    i18n.setLocaleMessage(locale, messages)
  }

  if (i18n.locale !== locale) {
    i18n.locale = locale
  }
}
