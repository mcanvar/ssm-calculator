import browser from 'webextension-polyfill'
import {
  getDaysCountUntilEndOfMonth,
  getWeekdaysAndSaturdaysCountUntilEndOfMonth,
  getWeekdaysCountUntilEndOfMonth,
  totalHoursAndMins
} from './utils/date'

const fetchSsmData = async (): Promise<void> => {
  const data =
    '{"shrdId":null,"empl":[278292],"groups":[],"clients":[],"prj":[],"from":null,"to":null,"isToday":false,"isYesterday":false,"isWeek":false,"isPrevWeek":false,"isLast7Days":false,"isMonth":true,"isPrevMonth":false,"isLast30Days":false,"isYear":false,"isLastYear":false,"timeZone":null,"note":"","offline":false,"includeAbsences":false,"excludeArchived":false,"group":["date","project","note"],"cronString":"0 9 * * 0","generateTimeStamp":1694922991359}'

  const { ssmToken: token } = await browser.storage.local.get(['ssmToken'])

  if (token == '') return

  const rawResponse = await fetch('https://screenshotmonitor.com/api/v2/GetReport', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-SSM-Token': token
    },
    body: data
  })
  const content = await rawResponse.json()

  await browser.storage.local.set({
    ssmClient: content.charts.clients[0],
    ssmTimeline: content.charts.timeline
  })
}

const getBadgeText = async (): Promise<string> => {
  const today = new Date()
  const yyyy = today.getFullYear()
  const m = today.getMonth() + 1
  const d = today.getDate()
  const { ssmTimeline: timeline } = await browser.storage.local.get(['ssmTimeline'])
  const { ssmClient: client } = await browser.storage.local.get(['ssmClient'])
  const { ssmHours: monthlyHoursTarget } = await browser.storage.local.get(['ssmHours'])
  const { ssmWeek: week } = await browser.storage.local.get(['ssmWeek'])

  const dayData = timeline.find((i: { Date: string }) => i.Date == m + '/' + d + '/' + yyyy)

  let workDayCount
  if (week == 'weekdays') workDayCount = getWeekdaysCountUntilEndOfMonth()
  else if (week == 'weekdaysAndSaturday')
    workDayCount = getWeekdaysAndSaturdaysCountUntilEndOfMonth()
  else workDayCount = getDaysCountUntilEndOfMonth()

  const monthlyTotal = monthlyHoursTarget * 60
  const remainingMinutesOfTheMonth = monthlyTotal - client.Duration

  if (dayData == undefined || workDayCount == 0) return ''

  const remainingTime = totalHoursAndMins(
    remainingMinutesOfTheMonth / workDayCount - dayData.Duration,
    true
  )

  if (typeof remainingTime != 'string' && remainingTime.hours < 1) {
    return remainingTime.minutes + 'm'
  }

  if (typeof remainingTime != 'string') return remainingTime.hours + 'h'

  return ''
}

setInterval(() => fetchSsmData(), 60000)

browser.runtime.onInstalled.addListener(async () => {
  await browser.storage.local.set({
    ssmClient: { Duration: 0 },
    ssmTimeline: [{ Duration: 0 }],
    ssmHours: 160,
    ssmWeek: 'weekdays',
    ssmToken: ''
  })

  browser.runtime.openOptionsPage()
})

browser.storage.onChanged.addListener(async (changes) => {
  if (
    changes.hasOwnProperty('ssmTimeline') ||
    changes.hasOwnProperty('ssmHours') ||
    changes.hasOwnProperty('ssmWeek')
  )
    browser.browserAction.setBadgeText({ text: await getBadgeText() })

  if (changes.hasOwnProperty('ssmToken')) await fetchSsmData()
})
