import { DataOptions } from 'vuetify'

export type DataTableFetchDataFunc = (options: DataOptions, keyword: string, ...args: any[]) => Promise<any>;

export interface ProgressStatus {
  total: number
  done: number
}

export interface JobStatus {
  isSuccess: boolean
  error?: object|string
}

export interface AxiosOption {
  notifyWhenSuccess?: boolean,
  notifyWhenError?: boolean
}

export type StringMap<T> = {
  [key: string]: T
}
