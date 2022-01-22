import { $axios } from '~/utils/api'

const NotificationService = {
  async fetchNotification () {
    return await $axios.create().get('/notifications')
      .catch(() => {
        console.log('Failed to fetch notifications')
        return { data: [] }
      })
  }
}

export default NotificationService
