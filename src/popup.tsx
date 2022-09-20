import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import browser from "webextension-polyfill";

const Popup = () => {
    const [count, setCount] = useState(0);
    const [currentURL, setCurrentURL] = useState<string>();

    useEffect(() => {
        // browser.action.setBadgeText({ text: count.toString() });
    }, [count]);

    useEffect(() => {
        browser.tabs.query({active: true, currentWindow: true})
            .then(tabs => setCurrentURL(tabs[0].url))
    }, []);

    const changeBackground = () => {
        browser.tabs.query({active: true, currentWindow: true})
            .then(tabs => {
                const tab = tabs[0];
                if (tab.id) {
                    browser.tabs.sendMessage(
                        tab.id,
                        {
                            color: "#555555",
                        }
                    ).then((msg) => console.log("result message:", msg))
                }
            })
    };

    return (
        <>
            <ul style={{minWidth: "700px"}}>
                <li>Current URL: {currentURL}</li>
                <li>Current Time: {new Date().toLocaleTimeString()}</li>
            </ul>
            <button
                onClick={() => setCount(count + 1)}
                style={{marginRight: "5px"}}
            >
                count up
            </button>
            <button onClick={changeBackground}>change background</button>
        </>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <Popup/>
    </React.StrictMode>,
    document.getElementById("app")
);
