'use strict';

var DOM = require("libdom"),
    DRIVER = require("./lib/driver.js"),
    GLOB = global,
    ENV = DOM.env,
    EXPORTS = {};
    
if (ENV.browser) {
    // register XHR
    if (GLOB.XMLHttpRequest) {
        DRIVER.register('xhr',
                require("./lib/browser/xhr.js"));
    }
    
    
    
}
else if (ENV.nodejs) {
    
}

module.exports = EXPORTS['default'] = EXPORTS;

GLOB = null;
