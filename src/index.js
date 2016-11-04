'use strict';

var LIBCORE = require("libcore"),
    rehash = LIBCORE.rehash,
    DOM = require("libdom"),
    DRIVER = require("./lib/driver.js"),
    HEADER = require("./lib/header.js"),
    TRANSFORM = require("./lib/transform.js"),
    GLOB = global,
    ENV = DOM.env,
    EXPORTS = {};

// browsers
if (ENV.browser) {
    // register XHR
    if (GLOB.XMLHttpRequest) {
        DRIVER.register('xhr',
                require("./lib/browser/xhr.js"));
    }
    
    
    
}
else if (ENV.nodejs) {
    
}

// create api
rehash(EXPORTS,
    DRIVER,
    {
        "request": "request",
        "register": "register",
        "use": "use"
    });

rehash(EXPORTS,
    HEADER,
    {
        "parseHeader": "parse",
        "eachHeader": "each"
    });

rehash(EXPORTS,
    TRANSFORM,
    {
        "parseType": "parse",
        "transformer": "register",
        "transform": "transform"
    });

TRANSFORM.chain =
    DRIVER.chain = EXPORTS;

module.exports = EXPORTS['default'] = EXPORTS;

GLOB = null;
