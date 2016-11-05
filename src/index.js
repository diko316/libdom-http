'use strict';

var LIBCORE = require("libcore"),
    DETECT = require("./lib/detect.js"),
    DRIVER = require("./lib/driver.js"),
    TRANSFORMER = require("./lib/request.js"),
    REQUEST = require("./lib/request.js"),
    rehash = LIBCORE.rehash,
    register = TRANSFORMER.register,
    EXPORTS = REQUEST.request;

// xhr
if (DETECT.xhr) {
    DRIVER.register('xhr',
                require("./lib/driver/xhr.js"));
    
    DRIVER.register('xhr2',
                require("./lib/driver/xhr2.js"));
}

// transforms
if (DETECT.formdata) {
    // apply html5 form data here
    register('multipart/form-data',
        false,
        require("./lib/transform/request-html5-form-data.js"));
}





// create api
rehash(EXPORTS, REQUEST, {
        "request": "request"
    });
//rehash(EXPORTS,
//    DRIVER,
//    {
//        "request": "request",
//        "register": "register",
//        "use": "use"
//    });
//
//rehash(EXPORTS,
//    HEADER,
//    {
//        "parseHeader": "parse",
//        "eachHeader": "each"
//    });
//
//rehash(EXPORTS,
//    TRANSFORM,
//    {
//        "parseType": "parse",
//        "transformer": "register",
//        "transform": "transform"
//    });

//TRANSFORM.chain =
//    DRIVER.chain = EXPORTS;

module.exports = EXPORTS['default'] = EXPORTS;

