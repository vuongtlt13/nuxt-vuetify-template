import { DataOptions, DataTableHeader } from 'vuetify'
import { $axios, silentAxios } from '~/utils/api'
import { cloneObject, findIndexInHeader } from '~/utils';

const UserService = {
  async fetchUser (options: DataOptions, keyword: string, headers: DataTableHeader[]) {
    const newAxios = silentAxios()
    const clone = cloneObject(options);
    const { page, itemsPerPage, sortBy, sortDesc } = clone
    keyword = keyword.trim()
    let finalSortBy = sortBy.map((value: string) => {
      return findIndexInHeader(value, headers)
    })
    let finalSortDesc = sortDesc.map((value: boolean) => {
      return value ? "desc" : "asc"
    });

    if (finalSortBy.includes(-1)) {
      finalSortBy = null;
      finalSortDesc = null
    }
    return await newAxios.get('/users', {
      params: {
        q: keyword,
        s: Math.max((page - 1) * itemsPerPage, 0),
        ipp: itemsPerPage,
        sb: finalSortBy,
        sd: finalSortDesc
      }
    }).then((resp) => {
      let total = resp.data.data.recordsTotal;
      let items = resp.data.data.items;
      return {total, items}
    })
  },

  async addNewUser (data: any) {
    return await $axios.post('/users', data)
  },

  async updateUser (id: any, data: any) {
    return await $axios.put(`/users/${id}`, data)
  },

  async deleteUser (data: any, isSilent = false) {
    let axios = $axios
    if (isSilent) {
      axios = silentAxios()
    }
    return await axios.delete(`/users/${data.id}`)
  }
}

export default UserService
