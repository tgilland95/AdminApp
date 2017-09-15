import * as indexPage from './IndexPage.js'

import {getQueryStringParameter} from './Utils.js'

ExecuteOrDelayUntilScriptLoaded(init, "sp.js");

var hostWebUrl = '';
var appWebUrl = '';

function init() {
    // This code runs when the DOM is ready and creates a context object which is
    // needed to use the SharePoint object model
    $(document)
        .ready(function () {

            // parses hostweb and appweb URLs from page URL
            hostWebUrl = decodeURIComponent(getQueryStringParameter("SPHostUrl"));
            appWebUrl = decodeURIComponent(getQueryStringParameter("SPAppWebUrl"));
            // loads index.aspx page
            indexPage.run(hostWebUrl, appWebUrl);
            alert("hi")
        });
}
