import { $axios, createAxiosFromConfig } from '~/utils/api'
import { AxiosOption } from '~/types';

const AuthService = {
  async login (credential: any) {
    return await $axios.post('/auth/login', credential)
  },

  async fetchUserInfo (axiosOpts?: AxiosOption) {
    const axios = createAxiosFromConfig({
      notifyWhenSuccess: false,
      notifyWhenError: false,
      ...axiosOpts
    })
    return await axios.get('/user-info')
  }
}

export default AuthService
