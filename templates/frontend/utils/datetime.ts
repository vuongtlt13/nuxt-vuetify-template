import moment from 'moment'
import { i18n } from '~/plugins/i18n'

export const standardDatetime = (datetimeStr: string, format: string|null = null) => {
  if (format === null) {
    return moment(datetimeStr)
  }
  return moment(datetimeStr, format)
}

export const diffTimeFromNow = (dtObj: moment.Moment): string => {
  const now = moment()
  const diffInSeconds = now.diff(dtObj, 'seconds')
  if (diffInSeconds <= 10) {
    return i18n.tc('time.just_now')
  }

  if (diffInSeconds < 60) {
    return i18n.tc('time.x_seconds_ago', diffInSeconds)
  }

  const diffInMinutes = now.diff(dtObj, 'minutes')
  if (diffInMinutes < 60) {
    return i18n.tc('time.x_minutes_ago', diffInMinutes)
  }

  const diffInHours = now.diff(dtObj, 'hours')
  if (diffInHours < 24) {
    return i18n.tc('time.x_hours_ago', diffInHours)
  }

  const diffInDays = now.diff(dtObj, 'days')
  if (diffInDays < 31) {
    return i18n.tc('time.x_days_ago', diffInDays)
  }

  const diffInMonths = now.diff(dtObj, 'months')
  if (diffInMonths < 12) {
    return i18n.tc('time.x_months_ago', diffInMonths)
  }

  const diffInYears = now.diff(dtObj, 'years')
  return i18n.tc('time.x_years_ago', diffInYears)
}
