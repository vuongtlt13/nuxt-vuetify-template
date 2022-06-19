import { cloneObject, findIndexInHeader } from '~/utils';
import { $silentAxios } from '~/utils/api';
import { FetchDatatableOption } from "~/types";

export const BaseService = {
  async fetchData(url: string, fetchDataOption: FetchDatatableOption) {
    const clone = cloneObject(fetchDataOption.options);
    const {page, itemsPerPage, sortBy, sortDesc} = clone
    const keyword = (fetchDataOption.keyword || "").trim()
    let finalSortBy = sortBy.map((value: string) => {
      return findIndexInHeader(value, fetchDataOption.headers)
    })
    let finalSortDesc = sortDesc.map((value: boolean) => {
      return value ? "desc" : "asc"
    });

    if (finalSortBy.includes(-1)) {
      finalSortBy = null;
      finalSortDesc = null
    }

    let fetchParams = {
      q: keyword,
      s: Math.max((page - 1) * itemsPerPage, 0),
      ipp: itemsPerPage,
      sb: finalSortBy,
      sd: finalSortDesc,
      ...fetchDataOption.params,
    }

    if (fetchDataOption.action) fetchParams.action = fetchDataOption.action;

    return await $silentAxios
      .get(url, {
        params: fetchParams
      })
      .then((resp) => {
        if (!fetchDataOption.action) {
          let total = resp.data.data.recordsFiltered;
          let items = resp.data.data.items;
          let options = resp.data.data.options;
          let extra = resp.data.data.extra;
          return {total, items, options, extra}
        } else {
          let url = $silentAxios.defaults.baseURL + `download/export/${resp.data.data.link}`
          window.open(url, '_blank')
        }
      })
  },
}
