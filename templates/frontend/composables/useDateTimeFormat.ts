import { VNDateTimeFormat, formatDateTime, parseDateTime } from '~/utils/datetime';

interface UseDateTimeFormat {
  format?: string
}

const useDateTimeFormat = (option: UseDateTimeFormat = {}) => {
  let dateTimeFormat = VNDateTimeFormat
  if (option.format) {
    dateTimeFormat = option.format
  }

  const formatDateTimeFn = (date: any) => {
    return formatDateTime(date, dateTimeFormat)
  }

  const parseDateTimeFn = (dateStr: string) => {
    parseDateTime(dateStr, dateTimeFormat)
  }

  return {
    dateTimeFormat: dateTimeFormat,
    formatDateTimeFn,
    parseDateTimeFn
  }
}

export default useDateTimeFormat;
