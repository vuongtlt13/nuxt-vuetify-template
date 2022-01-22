import Cookies from 'js-cookie'

// type
interface LangState {
  locale?: string
  locales: Object
}

// state
export const state: () => LangState = () => ({
  locale: process.env.appLocale,
  locales: {}
})

// getters
export const getters = {
  locale: (state: LangState) => state.locale,
  locales: (state: LangState) => state.locales
}

// mutations
export const mutations = {
  SET_LOCALE (state: LangState, { locale }: LangState) {
    state.locale = locale
  }
}

// actions
export const actions = {
  setLocale ({ commit }: any, { locale }: LangState) {
    commit('SET_LOCALE', { locale })

    Cookies.set('locale', locale!, { expires: 365 })
  }
}
