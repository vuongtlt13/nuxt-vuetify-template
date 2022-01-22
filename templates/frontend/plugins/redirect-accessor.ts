import { Plugin } from '@nuxt/types'
// @ts-ignore
import { initializeRedirect } from '~/utils/redirect'

const accessor: Plugin = ({ redirect }) => {
  initializeRedirect(redirect)
}

export default accessor
