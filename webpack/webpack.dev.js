import { merge } from 'webpack-merge'
import common, {isChromium} from './webpack.common.js'
import WebExtPlugin from "web-ext-plugin";

export default merge(common, {
    devtool: 'inline-source-map',
    mode: 'development',
    plugins: [new WebExtPlugin({
        startUrl: 'https://google.com/',
        sourceDir: '../../dist',
        browserConsole: true,
        target: isChromium ? 'chromium' : 'firefox-desktop',
        runLint: !isChromium // causes error for Chromium target, see: https://github.com/mozilla/web-ext/issues/2484
    })],
});