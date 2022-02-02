// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
import { addDefaultRequestInterception, addDefaultResponseInterception } from '~/utils/api'

export default ({ $axios }: any) => {
  $axios.defaults.baseURL = process.env.apiUrl

  if (process.server) {
    return
  }

  // Request interceptor
  addDefaultRequestInterception($axios)

  // Response interceptor
  addDefaultResponseInterception($axios)
}
