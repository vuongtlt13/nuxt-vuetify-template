import { DataOptions, DataTableHeader } from 'vuetify'
import { Ref } from '@nuxtjs/composition-api';

export type DataTableFetchDataFunc = (options: DataOptions, keyword: string, ...args: any[]) => Promise<any>;

export interface ProgressStatus {
  importing: boolean
  total: number
  done: number
}

export interface JobStatus {
  isSuccess: boolean
  error?: object | string
}

export interface AxiosOption {
  notifyWhenSuccess?: boolean,
  notifyWhenError?: boolean
  disableRedirect?: boolean
  overlay?: boolean
}

export type StringMap<T> = {
  [key: string]: T
}

export interface EditableColumnDataTable {
  value: string
  width?: string
  rules?: string
}

export interface SelectedCellDataTable {
  row: any
  column: any
  value: any
  origin: any
  item: any
  render: boolean
}

export type DataTableUpdateRowFunc = (invalid: boolean, item: any, selectedCell: SelectedCellDataTable, axiosOpts?: AxiosOption) => Promise<any> | undefined;

export type DataTableUpdateRowCallbackFunc = (invalid: boolean, item: any, axiosOpts?: AxiosOption) => Promise<any>;

export interface FetchDatatableOption {
  options: DataOptions
  keyword: string | null
  headers: DataTableHeader[]
  params?: any
  action?: string
}

export type FetchDatatableFunc = (fetchDataOption: FetchDatatableOption) => Promise<any>


export interface DataTableHandler {
  items: Ref<any[]>
  totalItem: Ref<number>
  extraData: Ref
  headers: DataTableHeader[]
  itemsPerPage: Ref<number>
  selectedRows: Ref<any>
  selectedCell: Ref<SelectedCellDataTable>
  draw: Ref<number>
  options: Ref<DataOptions>
  exportData: (action: string) => Promise<any>
  searchKeyword: Ref<any>
  fetchExtraParams: Ref<any>
  selectAllItems: () => void
  reloadTableFn: (delay?: boolean) => void
  clearSelectionAndReload: (delay?: boolean) => void
  updateSelectedCell: (row: any, column: any) => void
  resetSelectedCell: () => void
  updateRowFunc: DataTableUpdateRowFunc | undefined
  closeEditor: () => void
  fetchDatatableFunc: (loading: Ref, options: DataOptions) => void
}

export interface SummaryInfo {
  name: string,
  value: any
}
