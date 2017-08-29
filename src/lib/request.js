'use strict';

import {
            string,
            object,
            run,
            createRegistry
        } from "libcore";
        
import { get as getModule } from "./chain.js";

import {
            exists,
            use,
            get
        } from "./driver.js";
        
import OPERATION from "./operation.js";

import {
            form
        } from "./transform/helper.js";


var DEFAULTS = createRegistry(),
    METHODS = ['get','post','put','patch','delete','options'],
    ALLOWED_PAYLOAD = ['post', 'put', 'patch'],
    exported = {
        request: request,
        defaults: defaults
    };
    


function normalizeMethod(method) {
    if (string(method)) {
        method = method.toLowerCase();
        if (METHODS.indexOf(method) !== -1) {
            return method;
        }
    }
    
    return DEFAULTS.get('method');
}

function sniffDriver(config) {
    var driver = config.driver;
    
    // call middleware
    run("libdom-http.driver.resolve", [config, driver]);
    driver = config.driver;
    
    if (string(driver) && exists(driver)) {
        return driver;
    }
    
    // use default
    return use();
    
}

function applyRequestForm(form, requestObject) {
    var isString = string;
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
    var isString = string,
        undef = void(0);
    var item;
    
    // apply defaults
    item = config.form || config.data || config.params || config.body;
    if (form(item)) {
        applyRequestForm(item, requestObject);
    }
    else if (item !== null || item !== undef) {
        requestObject.data = item;
    }
    
    item = config.query || config.urlData || config.urlParams;
    if (form(item) || (item !== null && item !== undef)) {
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

export
    function request(url, config) {
        var isString = string,
            isObject = object,
            isForm = form,
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
            else if (isForm(config)) {
                applyRequestForm(config, requestObject);
            }
            
            requestObject.url = url;
            
        }
        else if (isObject(url)) {
            applyConfig(url, requestObject);
        }
        else if (isForm(url)) {
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
                driver = new (get(driver))(requestObject);
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

export
    function defaults(name, value) {
        var all = DEFAULTS;
        if (arguments.length > 1) {
            all.set(name, value);
            return getModule();
        }
        
        return all.get(name);
        
    }


export default exported;


// set default driver
use('xhr');

// set default method
DEFAULTS.set('method', 'get');

// add default header
DEFAULTS.set('headers', {
    'accept': 'application/json,text/x-json,text/plain,*/*;q=0.8',
    'content-type': 'application/json'
});



