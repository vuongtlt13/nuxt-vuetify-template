import { $axios } from '~/utils/api'

const AuthService = {
  async login (credential: any) {
    return await $axios.post('/auth/login', credential)
  },

  async fetchUserInfo () {
    return await $axios.get('/user-info')
  }
}

export default AuthService
