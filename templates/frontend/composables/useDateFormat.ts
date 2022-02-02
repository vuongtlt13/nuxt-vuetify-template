import { VNDateFormat, formatDate, parseDate } from '~/utils/datetime';

interface UseDateFormat {
  format?: string
}

const useDateFormat = (option: UseDateFormat = {}) => {
  let dateFormat = VNDateFormat
  if (option.format) {
    dateFormat = option.format
  }

  const formatDateFn = (date: any) => {
    return formatDate(date, dateFormat)
  }

  const parseDateFn = (dateStr: string) => {
    parseDate(dateStr, dateFormat)
  }

  return {
    dateFormat,
    formatDateFn,
    parseDateFn
  }
}

export default useDateFormat;
