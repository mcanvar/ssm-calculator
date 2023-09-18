const getDayCount = (options: number[] = []): number => {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0) // Last day of the month
  let dayCount = 0

  for (let day = today; day <= lastDayOfMonth; day.setDate(day.getDate() + 1)) {
    const dayOfWeek = day.getDay() // 0 (Sunday) to 6 (Saturday)

    // Check if the day of the week is in the options array
    if (options.includes(dayOfWeek)) {
      dayCount++
    }
  }

  return dayCount
}
export const getWeekdaysCountUntilEndOfMonth = () => getDayCount([1, 2, 3, 4, 5]) + 1
export const getWeekdaysAndSaturdaysCountUntilEndOfMonth = () => getDayCount([1, 2, 3, 4, 5, 6]) + 1
export const getDaysCountUntilEndOfMonth = () => getDayCount([0, 1, 2, 3, 4, 5, 6]) + 1

export const totalHoursAndMins = (totalMinutes: number, returnAsObject: boolean = false) => {
  const hours: number = Math.floor(totalMinutes / 60)
  const minutes: string = (totalMinutes % 60).toFixed()
  let humanReadable = hours + 'h'

  if (parseInt(minutes) > 0) humanReadable += ' ' + minutes + 'm'

  return returnAsObject ? { hours, minutes: parseInt(minutes) } : humanReadable
}
