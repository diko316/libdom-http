'use strict';

var LIBCORE = require("libcore"),
    HTTP_DRIVERS = LIBCORE.createRegistry(),
    DEFAULT = null,
    EXPORTS = {
        register: register,
        get: get,
        request: request,
        use: defaultDriver
    };

function register(name, api) {
  
    HTTP_DRIVERS.set(name, api);
    
    if (!DEFAULT) {
        DEFAULT = name;
    }
    return EXPORTS.chain;
}

function get(name) {
    return HTTP_DRIVERS.get(name);
}

function request(url, config) {
    var CORE = LIBCORE,
        isObject = CORE.object,
        getDriver = get;
    var Driver = null;
    
    // sniff driver
    if (isObject(url)) {
        Driver = url.driver;
    }
    if (!getDriver(Driver) && isObject(config)) {
        Driver =  config.driver;
    }
    
    Driver = getDriver(Driver) || getDriver(DEFAULT);
    
    console.log('finally? ', Driver);
    
    if (Driver) {
        return (new Driver()).request(url, config);
    }
    return Promise.reject("Unable to find driver for http transport");
}

function defaultDriver(driver) {
    if (HTTP_DRIVERS.get(driver)) {
        DEFAULT = driver;
    }
    return EXPORTS.chain;
}

module.exports = EXPORTS;