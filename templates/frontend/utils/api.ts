import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { AxiosResponse } from 'axios'
import { $store } from '~/utils/store'
import { showNotificationFromErrorResponse, showNotificationFromResponse } from '~/utils/index'
import { AxiosOption } from '~/types';

// eslint-disable-next-line import/no-mutable-exports
let $axios: NuxtAxiosInstance
let $silentAxios: NuxtAxiosInstance

export function initializeAxios (axiosInstance: NuxtAxiosInstance) {
  $axios = axiosInstance
  $silentAxios = silentAxios()
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

export function addDefaultResponseInterception (
  axios: NuxtAxiosInstance,
  axiosOpts?: AxiosOption
) {
  axiosOpts = {
    notifyWhenSuccess: true,
    notifyWhenError: true,
    ...axiosOpts
  }
  axios.interceptors.response.use((response: AxiosResponse) => {
    if (axiosOpts!.notifyWhenSuccess) {
      showNotificationFromResponse(response)
    }
    return response
  }, (error: any) => {
    if (axiosOpts!.notifyWhenError) {
      showNotificationFromErrorResponse(error)
    }
    return Promise.reject(error)
  })
}

export const silentAxios = (axiosOpts?: AxiosOption) => {
  const newAxios = $axios.create()
  addDefaultRequestInterception(newAxios)
  axiosOpts = {
    notifyWhenSuccess: false,
    ...axiosOpts
  }
  addDefaultResponseInterception(newAxios, axiosOpts)
  return newAxios
}

export const convertToVSelectOption = (options: any): object => {
  let selectOptions = [] as any[]
  Object.keys(options).forEach((key) => {
    selectOptions.push({
      text: options[key],
      value: key
    })
  })

  return selectOptions
}

export const makeOptionFromResponse = (optionResp: any) => {
  let finalOptionResp = {} as any
  Object.keys(optionResp).forEach((key) => {
    finalOptionResp[key] = convertToVSelectOption(optionResp[key])
  })
  return finalOptionResp
}
export { $axios, $silentAxios }
