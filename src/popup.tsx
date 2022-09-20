import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import browser from "webextension-polyfill";

const Popup = () => {
    const [color, setColor] = useState('#000000');

    useEffect(() => {
        browser.storage.local.get(['favoriteColor'])
            .then(({favoriteColor}) => setColor(favoriteColor))
    }, []);


    const changeBackground = () => {
        browser.tabs.query({active: true, currentWindow: true})
            .then(tabs => {
                const tab = tabs[0];
                if (tab.id) {
                    browser.tabs.sendMessage(
                        tab.id,
                        {
                            color,
                        }
                    ).then((msg) => console.log("result message:", msg))
                }
            })
    };

    return (
        <div style={{padding: '10px', backgroundColor: color}}>
            <button onClick={changeBackground}>change background</button>
        </div>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <Popup/>
    </React.StrictMode>,
    document.getElementById("app")
);
