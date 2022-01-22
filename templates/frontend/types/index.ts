import { DataOptions } from 'vuetify'

export type DataTableFetchDataFunc = (options: DataOptions, keyword: string, ...args: any[]) => Promise<any>;
