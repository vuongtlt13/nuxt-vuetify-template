import { VNDateTimeFormat, formatDateTime, parseDateTime } from '~/utils/datetime';
import moment from "moment";

interface UseDateTimeFormat {
  format?: string
}

const useDateTimeFormat = (option: UseDateTimeFormat = {}) => {
  let dateTimeFormat = VNDateTimeFormat
  if (option.format) {
    dateTimeFormat = option.format
  }

  const formatDateTimeFn = (datetime: any) => {
    if (typeof datetime == "string") {
      datetime = moment(datetime)
    }
    return formatDateTime(datetime, dateTimeFormat)
  }

  const parseDateTimeFn = (datetimeStr: string) => {
    parseDateTime(datetimeStr, dateTimeFormat)
  }

  return {
    dateTimeFormat: dateTimeFormat,
    formatDateTimeFn,
    parseDateTimeFn
  }
}

export default useDateTimeFormat;
