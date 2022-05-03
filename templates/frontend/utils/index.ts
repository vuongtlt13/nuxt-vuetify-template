import Vue from 'vue'
import { AxiosResponse } from 'axios'
import { HttpCode, NOTIFICATION_DURATION } from '~/utils/constants'
import { i18n } from '~/plugins/i18n'
import { $redirect } from '~/utils/redirect'
import { $store } from '~/utils/store'
import { DataTableHeader } from 'vuetify';
import $ from 'jquery';
import {
  AxiosOption,
  DataTableValidateAndUpdateRowCallbackFunc,
  DataTableValidateAndUpdateRowFunc,
  SelectedCellDataTable
} from '~/types';
import { $axios } from '~/utils/api';
import { $error } from '~/utils/error';

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
  link = link || ""
  link = link.trim()
  if (link === '') {
    return false
  }
  return link.startsWith('http://') || link.startsWith('https://')
}

/**
 * Check a href is a internal link
 */
export const isInternalLink = (link: string | null | undefined): boolean => {
  link = link || ""
  link = link.trim()
  if (link === '') {
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

export const showNotificationFromErrorResponse = (err: any, axiosOpts?: AxiosOption) => {
  const resp = (err.response || { data: {} }) as AxiosResponse
  if (resp.status >= HttpCode.SERVER_ERROR) {
    if (axiosOpts?.notifyWhenError)
      Vue.notify({
        type: 'error',
        title: i18n.t('notification.server_error_title').toString(),
        text: resp.data.message || resp.data.error || err.toString(),
        duration: NOTIFICATION_DURATION
      })
  } else if (resp.status === HttpCode.UNAUTHORIZED) {
    if (axiosOpts?.notifyWhenError)
      Vue.notify({
        type: 'warning',
        title: i18n.t('notification.token_expired_alert_title').toString(),
        text: i18n.t('notification.token_expired_alert_text').toString(),
        duration: NOTIFICATION_DURATION
      })
    if (!axiosOpts?.disableRedirect) {
      $store.dispatch('auth/logout').finally(() => {
        $redirect('auth/login')
      })
    }
  } else if (resp.status === HttpCode.PERMISSION_DENIED) {
    $error({
      statusCode: resp.status,
      message: resp.data.message,
      extra: {
        text: "Gia hạn",
        url: "/extend-license"
      }
    })
  } else {
    if (axiosOpts?.notifyWhenError)
      Vue.notify({
        type: 'error',
        title: i18n.t('notification.error_title').toString(),
        text: resp.data.message || resp.data.error,
        duration: NOTIFICATION_DURATION
      })
  }
}

export type SuccessCallbackFunction = (_: AxiosResponse, callbackOptions?: CallbackOptions) => void

export type ErrorCallbackFunction = (error: any, callbackOptions?: CallbackOptions) => void

export type FinallyCallbackFunction = (callbackOptions?: CallbackOptions) => void

export interface CallbackOptions {
  reloadTableFn?: (delay?: boolean) => void
  callbackFn?: (resp: AxiosResponse) => any
}

export const defaultSuccessCallbackFn: SuccessCallbackFunction = (resp: AxiosResponse, callbackOptions?: CallbackOptions) => {
  if (callbackOptions !== undefined) {
    if (callbackOptions.callbackFn !== undefined) callbackOptions.callbackFn(resp)
    if (callbackOptions.reloadTableFn !== undefined) callbackOptions.reloadTableFn()
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

export const DefaultValidateAndUpdateRowCallback: DataTableValidateAndUpdateRowCallbackFunc = (
  invalid: boolean,
  item: any,
  axiosOpts?: AxiosOption
): Promise<any> => {
  return new Promise((resolve, _) => {
    resolve({
      data: {
        data: item
      }
    })
  })
}

export const makeValidateAndUpdateRowDatatableFunc = (
  callback?: DataTableValidateAndUpdateRowCallbackFunc,
  axiosOpts?: AxiosOption
): DataTableValidateAndUpdateRowFunc => {
  let finalAxiosOpts = axiosOpts || {
    notifyWhenSuccess: false
  }

  return (invalid: boolean, item: any, selectedCell: SelectedCellDataTable, axiosOpts?: AxiosOption) => {
    let _finalAxiosOpts = {
      ...finalAxiosOpts,
      axiosOpts
    }
    if (!invalid) {
      let oldValue = item[selectedCell.column];
      let newValue = selectedCell.value;
      if (oldValue == newValue) return;
      item[selectedCell.column] = selectedCell.value
      let finalCallback: DataTableValidateAndUpdateRowCallbackFunc = callback || DefaultValidateAndUpdateRowCallback
      return finalCallback!(selectedCell.row, item, _finalAxiosOpts)
        .then((resp) => {
          item[selectedCell.column] = resp.data.data[selectedCell.column]
        })
        .catch((err) => {
          item[selectedCell.column] = oldValue;
        })
    }
  }
}

export const scrollIntoView = (element: any, container: any) => {
  if (element.length > 0) {
    let containerElement = $(container);
    let containerTop = containerElement.scrollTop()!;
    let containerBottom = containerTop + containerElement.height()!;
    let elemTop = element[0].offsetTop;

    let elemBottom = elemTop + element.height();
    if (elemTop < containerTop) {
      containerElement.scrollTop(elemTop - element.height());
    } else if (elemBottom > containerBottom) {
      containerElement.scrollTop(elemBottom - containerElement.height()!);
    }
  }
}


export const printElement = (element: HTMLElement | string, cssLinks?: string[]) => {
  let elementHTML = null;
  if (typeof element === 'string')
    elementHTML = document.getElementById(element)?.outerHTML;
  else {
    elementHTML = element
  }

  // @ts-ignore
  let newWin: any = window.frames["printIFrame"];
  // newWin.print();

  if (cssLinks != null) {
    // @ts-ignore
    for (let css of cssLinks) {
      newWin.document.write(`<link href="${css}" rel="stylesheet" media='screen,print'>`);
    }
  }

  newWin.document.write(
    "<body onload=\"window.print()\">" +
    elementHTML +
    "</body>");
  newWin.document.close();
}


export const downloadTemplate = (templateName: string) => {
  let fullUrl = `${$axios.defaults.baseURL}template/download/${templateName}`;
  window.open(fullUrl, "_blank")
}
