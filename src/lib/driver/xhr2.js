'use strict';

var LIBCORE = require("libcore"),
    MIDDLEWARE = LIBCORE.middleware("libdom-http.driver.xhr"),
    XHR = require("./xhr.js");



// apply middlewares according to capability of the platform






module.exports = XHR;