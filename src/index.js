'use strict';

var LIBCORE = require("libcore"),
    DETECT = require("./lib/detect.js"),
    DRIVER = require("./lib/driver.js"),
    TRANSFORMER = require("./lib/transform.js"),
    REQUEST = require("./lib/request.js"),
    rehash = LIBCORE.rehash,
    driverRegister = DRIVER.register,
    transformRegister = TRANSFORMER.register,
    EXPORTS = REQUEST.request;



// xhr
if (DETECT.xhr) {
    driverRegister('xhr',
                require("./lib/driver/xhr.js"));
    
    driverRegister('xhr2',
                require("./lib/driver/xhr2.js"));
}

// transforms
transformRegister('text/plain',
    true,
    require("./lib/transform/response-text-plain.js"));

if (DETECT.formdata) {
    // use html5 form data request
    transformRegister('multipart/form-data',
        false,
        require("./lib/transform/request-html5-form-data.js"));
}




// file upload drivers
if (LIBCORE.env.browser) {
    driverRegister('form-upload',
        DETECT.xhr && DETECT.file && DETECT.blob ?
            // form data
            require("./lib/driver/xhr2.js") :
            
            // old school iframe
            require('./lib/driver/form-upload.js'));
}

// create api
rehash(EXPORTS, REQUEST, {
        "request": "request"
    });

rehash(EXPORTS,
    DRIVER,
    {
        "driver": "register",
        "use": "use"
    });


rehash(EXPORTS,
    require("./lib/header.js"),
    {
        "parseHeader": "parse",
        "eachHeader": "each"
    });

rehash(EXPORTS,
    TRANSFORMER,
    {
        "transformer": "register",
        "transform": "transform"
    });

TRANSFORMER.chain =
    DRIVER.chain = EXPORTS;

module.exports = EXPORTS['default'] = EXPORTS;

