import { DataOptions, DataTableHeader } from 'vuetify'
import { $axios, $silentAxios, silentAxios } from '~/utils/api'
import { cloneObject, findIndexInHeader } from '~/utils';
import { AxiosOption } from '~/types';

const UserService = {
  async fetchUser (options: DataOptions, keyword: string, headers: DataTableHeader[], params?: any) {
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
        sd: finalSortDesc,
        ...params
      }
    }).then((resp) => {
      let total = resp.data.data.recordsTotal;
      let items = resp.data.data.items;
      return {total, items}
    })
  },

  async loadCreateUserOption (params: any) {
    return await $silentAxios.get('/users/create', {
      params
    })
  },

  async addNewUser (data: any, axiosOpts?: AxiosOption) {
    let axios = $axios
    if (axiosOpts && (!axiosOpts.notifyWhenSuccess || !axiosOpts.notifyWhenError)) {
      axios = silentAxios(axiosOpts)
    }
    return await axios.post('/users', data)
  },

  async loadUpdateUserOption (id: any, params: any) {
    return await $silentAxios.get(`/users/${id}/edit`, {
      params
    })
  },

  async updateUser (id: any, data: any, axiosOpts?: AxiosOption) {
    let axios = $axios
    if (axiosOpts && (!axiosOpts.notifyWhenSuccess || !axiosOpts.notifyWhenError)) {
      axios = silentAxios(axiosOpts)
    }
    return await axios.put(`/users/${id}`, data)
  },

  async deleteUser (data: any, axiosOpts?: AxiosOption) {
    let axios = $axios
    if (axiosOpts && (!axiosOpts.notifyWhenSuccess || !axiosOpts.notifyWhenError)) {
      axios = silentAxios(axiosOpts)
    }
    return await axios.delete(`/users/${data.id}`)
  }
}

export default UserService
