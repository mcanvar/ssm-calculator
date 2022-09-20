import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import browser from "webextension-polyfill";

const Options = () => {
    const [color, setColor] = useState<string>('#000000');
    const [status, setStatus] = useState<string>("");

    useEffect(() => {
        browser.storage.local.get(['favoriteColor']).then(({favoriteColor}) => {
            setColor(favoriteColor);
        })
    }, []);

    const saveOptions = () => {
        browser.storage.local.set(
            {
                favoriteColor: color
            }
        ).then(() => {
            setStatus("Options saved.");
            const id = setTimeout(() => {
                setStatus('');
            }, 1000);
            return () => clearTimeout(id);
        })
    };

    return (
        <div style={{height: '60px', padding: '10px'}}>
            <label>
                Favorite color:
                <input style={{marginLeft: '10px'}} type="color" value={color}
                       onChange={({target: {value}}) => setColor(value)}/>
            </label>
            <hr style={{marginBottom: '10px'}}/>
            {!!status.length ? <span>{status}</span> : <button onClick={saveOptions}>Save</button>}
        </div>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <Options/>
    </React.StrictMode>,
    document.getElementById("app")
);
