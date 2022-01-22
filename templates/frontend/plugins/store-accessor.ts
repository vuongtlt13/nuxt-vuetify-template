import { Plugin } from '@nuxt/types'
import { initializeStore } from '~/utils/store'

const accessor: Plugin = ({ store }) => {
  initializeStore(store)
}

export default accessor
