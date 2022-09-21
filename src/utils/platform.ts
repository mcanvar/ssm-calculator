import browser from 'webextension-polyfill'

/*
    Some useful utils in case facing of browser specific APIs.
 */

export const isChrome: boolean = browser.runtime.getURL('').startsWith('chrome-extension://')

export const isFirefox: boolean = browser.runtime.getURL('').startsWith('moz-extension://')
