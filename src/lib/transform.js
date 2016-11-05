'use strict';

var LIBCORE = require("libcore"),
    TYPES = require("./type.js"),
    TRANSFORMERS = LIBCORE.createRegistry(),
    REQUEST_PREFIX = 'request-',
    RESPONSE_PREFIX = 'response-',
    EXPORTS = {
        register: register,
        transform: transform
    };

var item;

function register(type, response, handler) {
    var CORE = LIBCORE,
        transformers = TRANSFORMERS,
        responsePrefix = RESPONSE_PREFIX;
    var finalType, current, all;
    
    if (CORE.method(handler)) {
        type = TYPES.parse(type);
        if (type) {
            all = response === 'all';
            response = response === true ? REQUEST_PREFIX : responsePrefix;
            
            finalType = response + type.root;
            current = response + type.string;
            
            // register root
            if (current !== finalType && !transformers.exists(finalType)) {
                transformers.set(finalType, handler);
            }
            
            transformers.set(current, handler);
            
            // include response
            if (all) {
                transformers.set(responsePrefix + type.string, handler);
            }
            
        }
    }
    return EXPORTS;
}

function transform(type, response, data) {
    var transformers = TRANSFORMERS;
    var finalType;
    
    type = TYPES.parse(type);
    
    if (type) {
        response = response === true ? REQUEST_PREFIX : RESPONSE_PREFIX;
        
        
        finalType = response + type.string;
        if (transformers.exists(finalType)) {
            return transformers.get(finalType)(data);
        }
        
        // try root
        finalType = response + type.root;
        if (transformers.exists(finalType)) {
            data = transformers.get(finalType)(data);
            return LIBCORE.array(data) ? data : [null, null];
        }
        
    }
    
    return [null, data];
}

module.exports = EXPORTS;


/**
 * add default transformers
 */

// request json
item = require("./transform/request-json.js");
register('application/json', false, item).
    register('text/x-json', false, item);
    
// response json
item = require("./transform/response-json.js");
register('application/json', true, item).
    register('text/x-json', true, item);


// old school requests
register('application/x-www-form-urlencoded',
        false,
        require("./transform/request-form-urlencoded.js")).

    register('multipart/form-data',
        false,
        require("./transform/request-form-multipart.js"));
    
