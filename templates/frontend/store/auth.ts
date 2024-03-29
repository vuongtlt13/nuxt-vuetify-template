import Cookies from 'js-cookie'
import { $axios } from '~/utils/api'
import AuthService from '~/services/auth'
import { TOKEN_KEY } from '~/utils/constants'

interface AuthState {
  user: any | null,
  token: string | null
}

// state
export const state: () => AuthState = () => ({
  user: null,
  token: null
})

// getters
export const getters = {
  user: (state: AuthState) => state.user,
  userName: (state: AuthState) => (state.user || {}).name,
  token: (state: AuthState) => {
    const tokenInCookie = Cookies.get(TOKEN_KEY)
    return state.token || tokenInCookie
  },
  check: (state: AuthState) => state.user && (state.user.name || state.user.full_name)
}

// mutations
export const mutations = {
  SET_TOKEN(state: AuthState, token: string) {
    state.token = token
  },

  FETCH_USER_SUCCESS(state: AuthState, user: any) {
    state.user = user
  },

  FETCH_USER_FAILURE(state: AuthState) {
    state.token = null
  },

  LOGOUT(state: AuthState) {
    state.user = null
    state.token = null
  },

  UPDATE_USER(state: AuthState, {user}: any) {
    state.user = user
  }
}

// actions
export const actions = {
  saveToken({commit}: any, {token, remember}: { token: string, remember: boolean }) {
    commit('SET_TOKEN', token)

    Cookies.set(TOKEN_KEY, token, {expires: remember ? 365 : undefined})
  },

  removeToken({commit}: any) {
    return new Promise((resolve) => {
      Cookies.remove(TOKEN_KEY)
      commit('LOGOUT')
      resolve(true)
    })
  },

  async fetchUser({commit}: any) {
    try {
      const {data} = await AuthService.fetchUserInfo()

      commit('FETCH_USER_SUCCESS', data.data)
    } catch (e) {
      Cookies.remove(TOKEN_KEY)
      commit('LOGOUT')
    }
  },

  updateUser({commit}: any, payload: any) {
    commit('UPDATE_USER', payload)
  },

  async logout({commit}: any) {
    return await ($axios.create()).post('/logout').catch(() => {
    }).finally(
      () => {
        Cookies.remove(TOKEN_KEY)
        commit('LOGOUT')
      }
    )
  }
}
