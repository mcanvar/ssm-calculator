import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import browser from 'webextension-polyfill'
import './tailwind.css'

const Options = () => {
  const [token, setToken] = useState<string>('')
  const [hours, setHours] = useState<number>(170)
  const [week, setWeek] = useState<string>('weekdays')
  const [status, setStatus] = useState<string>('')

  useEffect(() => {
    browser.storage.local.get(['ssmToken']).then(({ ssmToken }) => setToken(ssmToken))
    browser.storage.local.get(['ssmHours']).then(({ ssmHours }) => setHours(ssmHours))
    browser.storage.local.get(['ssmWeek']).then(({ ssmWeek }) => setWeek(ssmWeek))
  }, [])

  const saveOptions = () => {
    browser.storage.local
      .set({
        ssmToken: token,
        ssmHours: hours,
        ssmWeek: week
      })
      .then(() => {
        setStatus('Options saved.')
        const id = setTimeout(() => {
          setStatus('')
        }, 1000)
        return () => clearTimeout(id)
      })
  }

  return (
    <div className="h-96 p-3 font-bold text-xl">
      <label className="m-4">
        API Key:
        <input
          className="p-2 rounded-md ml-2 p=2 border border-emerald-400 focus:outline focus:outline-emerald-700 focus:border-0"
          name="token"
          type="text"
          value={token}
          onChange={({ target: { value } }) => setToken(value)}
        />
      </label>
      <br />
      <br />
      <label className="m-4">
        Monthly target:
        <select
          className="p-2 rounded-md ml-2"
          name="hours"
          value={hours}
          onChange={({ target: { value } }) => setHours(parseInt(value))}
        >
          <option value="160">160 hours</option>
          <option value="170">170 hours</option>
          <option value="180">180 hours</option>
          <option value="200">200 hours</option>
        </select>
      </label>
      <br />
      <br />
      <label className="m-3">
        Week Days:
        <select
          className="p-2 rounded-md ml-2"
          name="week"
          value={week}
          onChange={({ target: { value } }) => setWeek(value)}
        >
          <option value="weekdays">Weekdays</option>
          <option value="weekdaysAndSaturday">Saturday Included</option>
          <option value="WholeWeek">Weekend Included</option>
        </select>
      </label>
      <hr className="my-3" />
      {!!status.length ? (
        <span>{status}</span>
      ) : (
        <button
          className="p-2 rounded-md bg-emerald-700 text-emerald-50 hover:bg-emerald-500"
          onClick={saveOptions}
        >
          Save
        </button>
      )}
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
  document.getElementById('app')
)
