import * as XLSX from 'xlsx';
import { WorkBook, WorkSheet } from 'xlsx';
import { AxiosOption, ProgressStatus, StringMap } from '~/types';
import { JobHandler, JobHandlerOption, wrappedAxiosHandler } from '~/utils/job-handler';
import { AxiosResponse } from 'axios';
import { i18n } from '~/plugins/i18n';

export const readXLSX = async (file: File | null): Promise<WorkBook | null> => {
  return new Promise((resolve => {
    if (!file) resolve(null)
    const reader = new FileReader();
    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target!.result;
      resolve(XLSX.read(bstr, { type: 'binary' }))
    }
    reader.readAsBinaryString(file!);
  }))
}


export const getSheet = (wb: WorkBook, index: number = 0): WorkSheet | null => {
  if (wb.SheetNames.length <= index) return null
  let sheetName = wb.SheetNames[index]
  return wb.Sheets[sheetName]
}

export const getDataBySheet = (wb: WorkBook, index: number = 0, opts?: XLSX.Sheet2JSONOpts): any[] => {
  if (wb.SheetNames.length <= index) return []
  let sheetName = wb.SheetNames[index]

  return XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {
    ...opts,
    header: "A",
  })
}

export const rowDataToFormData = (rowData: StringMap<any>, mapping: StringMap<string>) => {
  let formData = {} as any
  Object.keys(mapping).forEach((key) => {
    formData[mapping[key]] = rowData[key]
  })

  return formData
}

interface UseImportFromXLSXOption<T> {
  file?: File
  workbook?: WorkBook
  mapping: StringMap<string>
  handlerFunction: (data: any, axiosOpts?: AxiosOption) => Promise<AxiosResponse>
  beforeStart?: () => Promise<any>
  additionalData?: any
  importProgress?: ProgressStatus
  axiosOpts?: AxiosOption
  jobHandlerOpts?: JobHandlerOption
}

export async function importFromXLSX<T> (option: UseImportFromXLSXOption<T>) {
  if (!option.file && !option.workbook) throw new Error('File or Workbook option must be filled!');
  option.axiosOpts = {
    notifyWhenSuccess: false,
    notifyWhenError: false,
    ...option.axiosOpts,
  }
  option.jobHandlerOpts = {
    finishText: i18n.t('crud.import_done').toString(),
    ...option.jobHandlerOpts
  }

  let workbook = null
  if (!option.file) {
    workbook = option.workbook
  }

  const handlerFn = async (rowData: StringMap<any>) => {
    let convertedData = rowDataToFormData(rowData, option.mapping)
    return wrappedAxiosHandler(
      option.handlerFunction(
        {
          ...convertedData,
          ...option.additionalData
        },
        option.axiosOpts
      )
    )
  }

  if (option.file) {
    workbook = await readXLSX(option.file)

    if (workbook) {
      const data = getDataBySheet(workbook)
      const jobHandler = new JobHandler<T>(
        handlerFn,
        option.importProgress,
        data.filter((rowData, index) => {
          return index > 0
        }),
        option.jobHandlerOpts
      )
      if (option.beforeStart) {
        return option.beforeStart()
          .finally(() => {
            return jobHandler.start()
          })
      } else {
        return jobHandler.start()
      }
    }
  }
}
