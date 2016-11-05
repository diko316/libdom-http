'use strict';

var LIBCORE = require("libcore"),
    DRIVER = require("./driver.js"),
    HEADER = require("./header.js"),
    DEFAULTS = LIBCORE.createRegistry(),
    METHODS = ['get','post','put','patch','delete','options'],
    EXPORTS = {
        request: request,
        defaults: accessDefaults
    };

function normalizeMethod(method) {
    if (LIBCORE.string(method)) {
        method = method.toLowerCase();
        if (METHODS.indexOf(method) !== -1) {
            return method;
        }
    }
    
    return DEFAULTS.get('method');
}

function sniffDriver(config) {
    var driver = config.driver,
        mgr = DRIVER;
    
    // call middleware
    LIBCORE.run("libdom-http.driver.resolve", [config, driver]);
    driver = config.driver;
    
    if (mgr.exists(driver)) {
        return driver;
    }
    
    // use default
    return mgr.use();
    
}

function request(url, config) {
    var CORE = LIBCORE,
        isString = CORE.string,
        isObject = CORE.object,
        Header = HEADER;
    var headers, item, defaults;
    
    // break it down
    if (isObject(url)) {
        config = url;
        url = config.url;
    }
    
    // yes it can run
    if (isString(url)) {
        
        defaults = DEFAULTS.clone();
        
        // populate config
        if (isObject(config)) {
            config = CORE.assign({}, config, defaults);
        }
        else {
            config = CORE.assign({}, defaults);
        }
        
        // finalize url
        config.url = url;
        
        // finalize method
        config.method = normalizeMethod(config.method);
        
        // finalize headers before deciding what driver to use
        headers = Header.parse(defaults.headers) || {};
        item = Header.parse(config.headers);
        if (item) {
            CORE.assign(headers, item);
        }
        config.headers = item;
        
        return DRIVER.run(sniffDriver(config),
                        config);
        
        
    }
    
    return Promise.reject("Invalid http request");
}

function accessDefaults(name, value) {
    var defaults = DEFAULTS;
    if (arguments.length > 1) {
        defaults.set(name, value);
        return EXPORTS.chain;
    }
    
    return defaults.get(name);
    
}


module.exports = EXPORTS;


// set default driver
DRIVER.use('xhr');


DEFAULTS.set('method', 'get');

// add default header
DEFAULTS.set('headers', {
    'accept': 'application/json,text/x-json,text/plain,*/*;q=0.8',
    'conten-type': 'application/json'
});



