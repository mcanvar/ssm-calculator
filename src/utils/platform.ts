/*
Some useful utils in case facing of browser related APIs such as Chrome setBadgeText API.
 */

import browser from 'webextension-polyfill'

export const isChrome = browser.runtime.getURL('').startsWith('chrome-extension://')

export const isFirefox = browser.runtime.getURL('').startsWith('moz-extension://')
