import browser from 'webextension-polyfill'
import { isChrome, isFirefox } from './utils/platform'

const logFavoriteColor = (): void => {
  browser.storage.local
    .get(['favoriteColor'])
    .then(({ favoriteColor }) => console.log('Favorite color is: ' + favoriteColor))
}

setTimeout(() => logFavoriteColor(), 1000)

browser.runtime.onInstalled.addListener(() =>
  browser.storage.local.set({
    favoriteColor: '#000000'
  })
)
