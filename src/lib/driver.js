'use strict';

var HTTP_DRIVERS = require("libcore").createRegistry(),
    EXPORTS = {
        register: register,
        get: get
    };

function register(name, api) {
    var E = EXPORTS;
    
    HTTP_DRIVERS.set(name, api);
    if (!E.defaultDriver) {
        E.defaultDriver = name;
    }
    return E.chain;
}

function get(name) {
    return HTTP_DRIVERS.get(name);
}

module.exports = EXPORTS;