'use strict';

var LIBCORE = require("libcore"),
    LIBDOM = require("libdom"),
    DRIVER = require("./driver.js"),
    HEADER = require("./header.js"),
    OPERATION = require("./operation.js"),
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

function applyRequestForm(form, requestObject) {
    var CORE = LIBCORE,
        isString = CORE.string;
    var item;
    
    // use this as request header
    item = form.enctype || form.encoding;
    if (isString(item)) {
        requestObject.addHeaders('Content-type: ' + item);
    }
    
    item = form.action;
    if (isString(item)) {
        requestObject.url = item;
    }
    
    item = form.method;
    if (isString(item)) {
        requestObject.method = item;
    }
    
    requestObject.data = form;
    
}

function applyRequestConfig(config, requestObject) {
    var CORE = LIBCORE,
        isString = CORE.string,
        data = config.form || config.data || config.params || config.body;
    var item;
    
    // apply defaults
    if (isForm(data)) {
        applyRequestForm(data, requestObject);
    }
    else if (data !== null || data !== void(0)) {
        requestObject.data = data;
    }
    
    item = config.url;
    if (isString(item)) {
        requestObject.url = item;
    }
    
    item = config.method;
    if (isString(item)) {
        requestObject.method = item;
    }
    
    item = config.url;
    if (isString(item)) {
        requestObject.url = item;
    }
    
    // add headers
    requestObject.addHeaders(config.headers);
}

function isForm(object) {
    return LIBDOM.is(object, 1) && object.tagName.toUpperCase() === 'FORM';
}

function isValidRequest(reqeustObject) {
    
}


function request(url, config) {
    var CORE = LIBCORE,
        isString = CORE.string,
        isObject = CORE.object,
        applyConfig = applyRequestConfig,
        requestObject = new OPERATION();
        
    // apply defaults
    applyConfig(DEFAULTS.clone(), requestObject);
    
    // process config
    if (isString(url)) {
        requestObject.url = url;
        if (isObject(config)) {
            applyConfig(config, requestObject);
        }
    }
    else if (isObject(url)) {
        applyConfig(url, requestObject);
    }
    else if (isForm(url)) {
        applyRequestForm(url, requestObject);
    }
    
}

//function request(url, config) {
//    var CORE = LIBCORE,
//        isString = CORE.string,
//        isObject = CORE.object,
//        Header = HEADER,
//        runRequest = false;
//    var headers, item, defaults;
//    
//    // break it down
//    if (isObject(url)) {
//        config = url;
//        url = config.url;
//    }
//    
//    // yes it can run
//    if (isString(url)) {
//        
//        defaults = DEFAULTS.clone();
//        
//        // populate config
//        if (isObject(config)) {
//            config = CORE.assign({}, config, defaults);
//        }
//        else {
//            config = CORE.assign({}, defaults);
//        }
//        
//        // finalize url
//        config.url = url;
//        
//        // finalize method
//        config.method = normalizeMethod(config.method);
//        
//        // finalize headers before deciding what driver to use
//        headers = Header.parse(defaults.headers) || {};
//        item = Header.parse(config.headers);
//        if (item) {
//            CORE.assign(headers, item);
//        }
//        config.headers = item;
//        runRequest = true;
//    }
//    
//    if (runRequest) {
//        return DRIVER.run(sniffDriver(config),
//                        config);
//    }
//    
//    return Promise.reject("Invalid http request");
//}

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



