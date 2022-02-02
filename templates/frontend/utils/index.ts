import Vue from 'vue'
import { AxiosResponse } from 'axios'
import { HttpCode, NOTIFICATION_DURATION } from '~/utils/constants'
import { i18n } from '~/plugins/i18n'
import { $redirect } from '~/utils/redirect'
import { $store } from '~/utils/store'
import { DataTableHeader } from 'vuetify';

/**
 * Get cookie from request.
 *
 * @param  {Object} req
 * @param  {String} key
 * @return {String|undefined}
 */
export function cookieFromRequest (req: any, key: any) {
  if (!req.headers.cookie) {
    return
  }

  const cookie = req.headers.cookie.split(';').find(
    (c: string) => c.trim().startsWith(`${key}=`)
  )

  if (cookie) {
    return cookie.split('=')[1]
  }
}

/**
 * https://router.vuejs.org/en/advanced/scroll-behavior.html
 */
export function scrollBehavior (to: any, _: any, savedPosition: any) {
  if (savedPosition) {
    return savedPosition
  }

  let position = {}

  if (to.matched.length < 2) {
    position = { x: 0, y: 0 }
  } else if (to.matched.some((r: any) => r.components.default.options.scrollToTop)) {
    position = { x: 0, y: 0 }
  }
  if (to.hash) {
    position = { selector: to.hash }
  }

  return position
}

/**
 * Check a href is a external link
 */
export const isExternalLink = (link: string | null | undefined): boolean => {
  if (link === undefined || link === null || link.trim() === '') {
    return false
  }
  return link.trim().startsWith('http://') || link.trim().startsWith('https://')
}

/**
 * Check a href is a internal link
 */
export const isInternalLink = (link: string | null | undefined): boolean => {
  if (link === undefined || link === null || link.trim() === '') {
    return false
  }
  return !isExternalLink(link)
}

export const sleep = (time: number) => {
  return new Promise((resolve: any) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

export const showNotificationFromResponse = (response: AxiosResponse) => {
  if (response.status !== HttpCode.SUCCESS || !response.data.success) {
    Vue.notify({
      type: 'error',
      title: i18n.t('notification.error_title').toString(),
      text: response.data.message || response.data.error,
      duration: NOTIFICATION_DURATION
    })
  } else {
    Vue.notify({
      type: 'success',
      title: i18n.t('notification.success_title').toString(),
      text: response.data.message,
      duration: NOTIFICATION_DURATION
    })
  }
}

export const showNotificationFromErrorResponse = (error: any) => {
  const resp = (error.response || { data: {} }) as AxiosResponse
  if (resp.status >= HttpCode.SERVER_ERROR) {
    Vue.notify({
      type: 'error',
      title: i18n.t('notification.server_error_title').toString(),
      text: resp.data.message || resp.data.error || error.toString(),
      duration: NOTIFICATION_DURATION
    })
  } else if (resp.status === HttpCode.UNAUTHORIZED) {
    Vue.notify({
      type: 'warning',
      title: i18n.t('notification.token_expired_alert_title').toString(),
      text: i18n.t('notification.token_expired_alert_text').toString(),
      duration: NOTIFICATION_DURATION
    })
    $store.commit('auth/LOGOUT')
    return $redirect({ name: 'login' })
  } else {
    Vue.notify({
      type: 'error',
      title: i18n.t('notification.error_title').toString(),
      text: resp.data.message || resp.data.error,
      duration: NOTIFICATION_DURATION
    })
  }
}

export type SuccessCallbackFunction = (_: AxiosResponse, otherOptions: any) => void

export const defaultSuccessCallbackFn: SuccessCallbackFunction = (_: AxiosResponse, otherOptions: any = {}) => {
  if (otherOptions.reloadTableFn !== null && otherOptions.reloadTableFn !== undefined) {
    otherOptions.reloadTableFn()
  }
}

export const cloneObject = (obj: object) => {
  return JSON.parse(JSON.stringify(obj))
}

export const findIndexInHeader = (value: string, headers: DataTableHeader[]) => {
  for (let i in headers) {
    if (headers[i].value == value) return i;
  }
  return -1;
}
