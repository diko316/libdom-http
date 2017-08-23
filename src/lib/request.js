'use strict';

var LIBCORE = require("libcore"),
    DRIVER = require("./driver.js"),
    OPERATION = require("./operation.js"),
    HELP = require("./transform/helper.js"),
    DEFAULTS = LIBCORE.createRegistry(),
    METHODS = ['get','post','put','patch','delete','options'],
    ALLOWED_PAYLOAD = ['post', 'put', 'patch'],
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
    
    if (LIBCORE.string(driver) && mgr.exists(driver)) {
        return driver;
    }
    
    // use default
    return mgr.use();
    
}

function applyRequestForm(form, requestObject) {
    var CORE = LIBCORE,
        isString = CORE.string;
    var item;
    
    // use this as request header only if not default
    item = form.getAttribute('enctype') || form.getAttribute('encoding');
    if (isString(item)) {
        requestObject.addHeaders('Content-type: ' + item);
    }
    
    item = form.action;
    if (isString(item)) {
        requestObject.url = item;
    }
    
    item = form.method;
    if (isString(item)) {
        requestObject.method = normalizeMethod(item);
    }
    
    item = form.getAttribute('data-driver');
    if (isString(item)) {
        requestObject.driver = item;
    }
    
    
    item = form.getAttribute('data-response-type');
    if (isString(item)) {
        requestObject.responseType = item;
    }
    
    requestObject.data = form;
}

function applyRequestConfig(config, requestObject) {
    var CORE = LIBCORE,
        isString = CORE.string,
        help = HELP,
        undef = void(0);
    var item;
    
    // apply defaults
    item = config.form || config.data || config.params || config.body;
    if (help.form(item)) {
        applyRequestForm(item, requestObject);
    }
    else if (item !== null || item !== undef) {
        requestObject.data = item;
    }
    
    item = config.query || config.urlData || config.urlParams;
    if (help.form(item) || (item !== null && item !== undef)) {
        requestObject.query = item;
    }
    
    item = config.url;
    if (isString(item)) {
        requestObject.url = item;
    }
    
    item = config.method;
    if (isString(item)) {
        requestObject.method = normalizeMethod(item);
    }
    
    item = config.driver;
    if (isString(item)) {
        requestObject.driver = item;
    }
    
    item = config.responseType;
    if (isString(item)) {
        requestObject.responseType = item;
    }
    
    // add headers
    requestObject.addHeaders('headers' in config && config.headers);
    
    requestObject.config = config;
    
    item = null;
}


function request(url, config) {
    var CORE = LIBCORE,
        H = HELP,
        isString = CORE.string,
        isObject = CORE.object,
        applyConfig = applyRequestConfig,
        requestObject = new OPERATION(),
        PROMISE = Promise;
    var driver, promise;
    
    // apply defaults
    applyConfig(DEFAULTS.clone(), requestObject);
    
    // process config
    if (isString(url)) {
        
        if (isObject(config)) {
            applyConfig(config, requestObject);
        }
        else if (H.form(config)) {
            applyRequestForm(config, requestObject);
        }
        
        requestObject.url = url;
        
    }
    else if (isObject(url)) {
        applyConfig(url, requestObject);
    }
    else if (H.form(url)) {
        applyRequestForm(url, requestObject);
    }
    
    // decide if body is allowed or not based from methods
    if (ALLOWED_PAYLOAD.indexOf(requestObject.method) === -1) {
        requestObject.allowedPayload = false;
    }
    
    
    // validate
    if (isString(requestObject.url)) {
        
        driver = sniffDriver(requestObject);
        if (driver) {
            driver = new (DRIVER.get(driver))(requestObject);
            requestObject.driver = driver;
            promise =  PROMISE.resolve(requestObject).
                            then(driver.setup).
                            then(driver.transport).
                            then(driver.success)
                            ["catch"](driver.error);
            
            requestObject.api = promise;
            requestObject = driver = null;
            return promise;
        }
        
    }
    
    return PROMISE.reject("Invalid HTTP request configuration.");
    
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

// set default method
DEFAULTS.set('method', 'get');

// add default header
DEFAULTS.set('headers', {
    'accept': 'application/json,text/x-json,text/plain,*/*;q=0.8',
    'content-type': 'application/json'
});



