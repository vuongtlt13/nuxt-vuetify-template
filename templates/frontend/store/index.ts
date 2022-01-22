import Cookies from 'js-cookie'
import { plainToInstance } from 'class-transformer'
import { cookieFromRequest } from '~/utils'
import Notification from '~/dto/notification'
import NotificationService from '~/services/notification'

interface RootState {
  drawer: boolean,
  useMini: boolean,
  notifications: Array<Notification>
}

export const state: () => RootState = () => ({
  drawer: true,
  useMini: true,
  notifications: []
})

export const getters = {
  isDrawer: (state: RootState) => state.drawer,
  isUseMini: (state: RootState) => state.useMini,
  notifications: (state: RootState) => state.notifications,
  unreadNotificationCount: (state: RootState) => state.notifications.filter((noti: Notification) => !noti.isRead).length
}

export const mutations = {
  TOGGLE_USE_MINI (state: RootState) {
    state.useMini = !state.useMini
  },
  SET_DRAWER (state: RootState, value: boolean) {
    state.drawer = value
  },
  FETCH_NOTIFICATIONS (state: RootState, notifications: Array<Notification>) {
    state.notifications = notifications
  },
  MARK_READ_NOTIFICATION (state: RootState, destNoti: Notification) {
    state.notifications.map((noti) => {
      if (noti.id === destNoti.id) {
        noti.isRead = true
      }
      return noti
    })
  }
}

export const actions = {
  async fetchNotification ({ commit }: any) {
    try {
      const { data } = await NotificationService.fetchNotification()
      commit('FETCH_NOTIFICATIONS', plainToInstance(Notification, data))
    } catch (e) {
      commit('FETCH_NOTIFICATIONS', [])
    }
  },

  nuxtServerInit ({ commit }: any, { req }: any) {
    const token = cookieFromRequest(req, 'token')
    if (token) {
      commit('auth/SET_TOKEN', token)
    }

    const locale = cookieFromRequest(req, 'locale')
    if (locale) {
      commit('lang/SET_LOCALE', { locale })
    }
  },

  nuxtClientInit ({ commit, getters }: any) {
    const token = Cookies.get('token')
    if (token && !getters['auth/token']) {
      commit('auth/SET_TOKEN', token)
    }

    const locale = Cookies.get('locale')
    if (locale && !getters['lang/locale']) {
      commit('lang/SET_LOCALE', { locale })
    }
  },

  toggleUseMini (context: any) {
    context.commit('TOGGLE_USE_MINI')
  },

  setDrawer (context: any, value: boolean) {
    context.commit('SET_DRAWER', value)
  },

  markRead (context: any, notification: Notification) {
    context.commit('MARK_READ_NOTIFICATION', notification)
  }
}
