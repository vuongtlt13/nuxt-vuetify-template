import { $axios } from '~/utils/api'

const ConfigService = {
  async fetchLanguages (locale: string) {
    return await $axios.create().get(`/lang/${locale}.json`)
      .catch(() => {
        return { data: [] }
      })
  }
}

export default ConfigService
