'use strict';

import {
            array,
            method,
            createRegistry
        } from "libcore";
        
import { get as getModule } from "./chain.js";

import { parse } from "./type.js";

import transformRequestJSON from "./transform/request-json.js";

import transformResponseJSON from "./transform/response-json.js";

import transformRequestURLEncode
            from "./transform/request-form-urlencoded.js";
            
import transformRequestFormMultipart
            from "./transform/request-form-multipart.js";

var TRANSFORMERS = createRegistry(),
    REQUEST_PREFIX = 'request-',
    RESPONSE_PREFIX = 'response-',
    exported = {
        register: register,
        transform: transform
    };

export
    function register(type, response, handler) {
        var transformers = TRANSFORMERS,
            responsePrefix = RESPONSE_PREFIX;
        var finalType, current, all;
        
        if (method(handler)) {
            type = parse(type);
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
        return getModule();
    }

export
    function transform(type, response, data) {
        var transformers = TRANSFORMERS;
        var finalType;
        
        type = parse(type);
        
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
                return array(data) ? data : [null, null];
            }
            
        }
        
        return [null, data];
    }

export default exported;


/**
 * add default transformers
 */

register('application/json', false, transformRequestJSON);
    register('text/x-json', false, transformRequestJSON);
    
// response json
register('application/json', true, transformResponseJSON);
register('text/x-json', true, transformResponseJSON);


// old school requests
register('application/x-www-form-urlencoded',
        false,
        transformRequestURLEncode);

register('multipart/form-data',
    false,
    transformRequestFormMultipart);
    

    
