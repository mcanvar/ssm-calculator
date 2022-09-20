import browser from "webextension-polyfill";

browser.runtime.onMessage.addListener(
    async (data, sender) => {
      if (data.color) {
        console.log("Receive color = " + data.color);

        document.body.style.backgroundColor = data.color;

        return "Change color to " + data.color;
      }

      return "Color message is none.";
    }
)