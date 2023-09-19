import React, { useEffect, useMemo, useState } from 'react'
import ReactDOM from 'react-dom'
import browser from 'webextension-polyfill'
import './tailwind.css'
import {
  getDaysCountUntilEndOfMonth,
  getWeekdaysAndSaturdaysCountUntilEndOfMonth,
  getWeekdaysCountUntilEndOfMonth,
  totalHoursAndMins
} from './utils/date'

const Popup = () => {
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [token, setToken] = useState<string>('')
  const [client, setClient] = useState({ Duration: 0 })
  const [hours, setHours] = useState<number>(170)
  const [week, setWeek] = useState<string>('weekdays')

  const weekDaysCount = getWeekdaysCountUntilEndOfMonth()
  const weekDaysAndSaturdayCount = getWeekdaysAndSaturdaysCountUntilEndOfMonth()
  const allDaysCount = getDaysCountUntilEndOfMonth()
  const handleXhours = (hours: number = 200, client: { Duration: number }) => {
    if (week == 'weekdays') return (hours * 60 - client.Duration) / weekDaysCount
    else if (week == 'weekdaysAndSaturday')
      return (hours * 60 - client.Duration) / weekDaysAndSaturdayCount
    else return (hours * 60 - client.Duration) / allDaysCount
  }

  const handleRefreshing = () => {
    setRefreshing(true)

    browser.storage.local.get(['ssmClient']).then(({ ssmClient }) => setClient(ssmClient))

    setTimeout(() => setRefreshing(false), 500)
  }

  useEffect(() => {
    browser.storage.local.get(['ssmToken']).then(({ ssmToken }) => setToken(ssmToken))
    browser.storage.local.get(['ssmClient']).then(({ ssmClient }) => setClient(ssmClient))
    browser.storage.local.get(['ssmWeek']).then(({ ssmWeek }) => setWeek(ssmWeek))
    browser.storage.local.get(['ssmHours']).then(({ ssmHours }) => setHours(ssmHours))
  }, [])

  const toMake: { [key: string]: number } = useMemo(() => {
    return {
      200: handleXhours(200, client as { Duration: number }),
      180: handleXhours(180, client as { Duration: number }),
      170: handleXhours(170, client as { Duration: number }),
      160: handleXhours(160, client as { Duration: number })
    }
  }, [client])

  const toMake180hours = useMemo(() => handleXhours(180, client as { Duration: number }), [client])

  const toMake170hours = useMemo(() => handleXhours(170, client as { Duration: number }), [client])

  const toMake160hours = useMemo(() => handleXhours(160, client as { Duration: number }), [client])

  return (
    <div className="relative w-96 max-w-lg bg-gray-100 px-5 py-6 ring-1 ring-gray-900/5 mx-0 cursor-default">
      <div className="mx-auto max-w-md">
        <div className="flex content-center justify-between">
          <h1 className="text-xl font-extrabold text-[#79975c]">My SSM Strategy</h1>

          <button
            className={`${
              refreshing && 'animate-spin'
            } text-cyan-800 font-bold py-1 px-4 rounded-full`}
            disabled={refreshing}
            onClick={() => handleRefreshing()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
        </div>

        {token.length == 0 && (
          <div
            role="alert"
            className="flex-center p-2 justify-center items-center flex max-w bg-rose-800 text-white rounded-md shadow-sm mt-4"
          >
            <svg
              className="h-6 w-6 flex-none fill-sky-100 stroke-white stroke-2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                strokeLinecap="round"
                fill="none"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            <p className="flex pl-2 text-xs">
              You need to setup your API key to start calculating.
            </p>
          </div>
        )}

        <div className="divide-y divide-gray-300/50">
          {token.length > 0 && (
            <div className="space-y-6 py-8 text-base leading-7 text-gray-600">
              <ul className="space-y-4">
                <li className="flex items-center">
                  <svg
                    className="h-6 w-6 flex-none fill-sky-100 stroke-[#79975c] stroke-2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path
                      strokeLinecap="round"
                      fill="none"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>

                  <div className="flex flex-col">
                    <p className="ml-4">
                      This month total:
                      <code className="text-sm font-bold text-gray-900">
                        {' '}
                        {totalHoursAndMins(client.Duration)}
                      </code>
                    </p>

                    <p className="ml-4">
                      Target:&nbsp;
                      <code className="text-sm font-bold text-gray-900">
                        {totalHoursAndMins(hours * 60)}
                      </code>
                      ,&nbsp;
                      <code className="text-sm font-bold text-gray-900">{week}</code>
                    </p>
                  </div>
                </li>
                <li>
                  <div className="flex-center flex">
                    <svg
                      className="h-6 w-6 flex-none fill-sky-100 stroke-[#79975c] stroke-2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path
                        strokeLinecap="round"
                        fill="none"
                        strokeLinejoin="round"
                        d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
                      />
                    </svg>
                    <p className="ml-4 mb-2">
                      For the rest of the month if you target to work&nbsp;
                      <code className="text-sm font-bold text-gray-900">
                        {totalHoursAndMins(hours * 60)}
                      </code>
                      ,&nbsp; you should work daily at least&nbsp;
                      <code className="text-sm font-bold text-gray-900">
                        {totalHoursAndMins(toMake[hours])}
                      </code>
                      .
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          )}
          <div className="pt-8 text-base font-semibold leading-7">
            <p className="text-gray-900">Want to visit SSM?</p>
            <p>
              <a href="https://screenshotmonitor.com" className="text-[#79975c] hover:text-sky-600">
                Reports &rarr;
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById('app')
)
