import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { AxiosResponse } from 'axios'
import { $store } from '~/utils/store'
import { showNotificationFromErrorResponse, showNotificationFromResponse } from '~/utils/index'

// eslint-disable-next-line import/no-mutable-exports
let $axios: NuxtAxiosInstance

export function initializeAxios (axiosInstance: NuxtAxiosInstance) {
  $axios = axiosInstance
}

export function addDefaultRequestInterception (axios: NuxtAxiosInstance) {
  axios.interceptors.request.use((request: any) => {
    request.baseURL = process.env.apiUrl

    const token = $store.getters['auth/token']

    if (token) {
      // @ts-ignore
      request.headers.common.Authorization = `Bearer ${token}`
    }

    const locale = $store.getters['lang/locale']
    if (locale) {
      // @ts-ignore
      request.headers.common['Accept-Language'] = locale
    }

    if (request.method === 'put') {
      if (request.data === undefined) {
        request.data = {}
      }
      request.data._method = 'PUT'
    }

    if (request.method === 'delete') {
      if (request.data === undefined) {
        request.data = {}
      }
      request.data._method = 'DELETE'
    }

    return request
  })
}

export function addDefaultResponseInterception (axios: NuxtAxiosInstance, notifyWhenSuccess = true) {
  axios.interceptors.response.use((response: AxiosResponse) => {
    if (notifyWhenSuccess) {
      showNotificationFromResponse(response)
    }
    return response
  }, (error: any) => {
    showNotificationFromErrorResponse(error)
    return Promise.reject(error)
  })
}

export const silentAxios = () => {
  const newAxios = $axios.create()
  addDefaultRequestInterception(newAxios)

  addDefaultResponseInterception(newAxios, false)
  return newAxios
}

export { $axios }
