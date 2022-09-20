import browser from "webextension-polyfill";

const logFavoriteColor = (): void => {
  browser.storage.local.get(['favoriteColor'])
      .then(({favoriteColor} )=> console.log('Favorite color is: ' + favoriteColor))
}

logFavoriteColor()