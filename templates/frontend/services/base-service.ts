import { DataOptions, DataTableHeader } from 'vuetify';
import { cloneObject, findIndexInHeader } from '~/utils';
import { $silentAxios } from '~/utils/api';

export const BaseService = {
  async fetchData (url: string, options: DataOptions, keyword: string | null, headers: DataTableHeader[], params?: any) {
    const clone = cloneObject(options);
    const { page, itemsPerPage, sortBy, sortDesc } = clone
    keyword = (keyword || "").trim()
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
    return await $silentAxios.get(url, {
      params: {
        q: keyword,
        s: Math.max((page - 1) * itemsPerPage, 0),
        ipp: itemsPerPage,
        sb: finalSortBy,
        sd: finalSortDesc,
        ...params
      }
    }).then((resp) => {
      let total = resp.data.data.recordsFiltered;
      let items = resp.data.data.items;
      let options = resp.data.data.options;
      let extra = resp.data.data.extra;
      return { total, items, options, extra }
    })
  }
}
