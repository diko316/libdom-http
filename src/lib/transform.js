'use strict';

var LIBCORE = require("libcore"),
    TRANSFORMERS = LIBCORE.createRegistry(),
    MIME_TYPE_RE =
        /^([a-z0-9\-\_]+)\/([a-z\-\_0-9]+)(([ \s\t]*\;([^\;]+))*)$/,
    MIME_TYPE_PARAMS_RE =
        /^[ \t\s]*([a-z0-9\-\_]+)\=(\"([^\"]+)\"|[a-z0-9\-\_]+)[ \t\s]*$/,
    QUOTED_RE = /^\"[^\"]+\"/,
    EXPORTS = {
        register: register,
        transform: transform,
        parse: parseType
    };
var item;

function parseType(type) {
    var mtypeRe = MIME_TYPE_RE,
        paramRe = MIME_TYPE_PARAMS_RE,
        quotedRe = QUOTED_RE,
        CORE = LIBCORE,
        paramGlue = "; ",
        parameterObject = null;
        
    var match, subtype, parameters, name, value, l, defaultType;
    
    if (CORE.string(type) && mtypeRe.test(type)) {
        match = type.match(mtypeRe);
        type = match[1].toLowerCase();
        subtype = match[2].toLowerCase();
        parameters = match[3] || '';
        
        if (parameters) {
            parameterObject = {};
            parameters = parameters.split(';');
            l = parameters.length;
            
            for (; l--;) {
                match = parameters[l].match(paramRe);
                if (match) {
                    name = match[1].toLowerCase();
                    value = match[2];
                    
                    // create parameters string
                    parameters[l] = name + '=' + value;
                    
                    // register
                    parameterObject[name] = quotedRe.test(value) ?
                                                value.substring(1,
                                                            value.length -1) :
                                                value;
                    
                }
            }
            parameters = parameters.join(paramGlue);
        }
        
        defaultType = type + '/' + subtype;
        
        return {
            string: defaultType +
                    (parameters ?
                        paramGlue + parameters : ''),
            defaultType: defaultType,
            type: type,
            subtype: subtype,
            params: parameterObject
        };
    }
    
    return void(0);
}

function register(type, transformFunction) {
    var CORE = LIBCORE,
        registry = TRANSFORMERS;
        
    var defaultType;
    
    type = CORE.method(transformFunction) && parseType(type);
    
    if (type) {
        
        // register as default if not set
        defaultType = type.defaultType;
        if (!registry.get(defaultType)) {
            registry.set(defaultType, transformFunction);
        }
        
        registry.set(defaultType, transformFunction);
        
        
    }
    return EXPORTS.chain;
}


function transform(type, data) {
    var registry = TRANSFORMERS,
        undef = void(0);
    var transformer, params;
    type = parseType(type);
    
    if (type) {
        transformer = registry.get(type.string);
        params = type.params;

        if (!transformer) {
            if (!params) {
                return undef;
            }
            // try using default
            transformer = registry.get(type.defaultType);
            params = null;
        }
        
        return transformer(data, params);
    }
    
    return undef;
}


module.exports = EXPORTS.chain = EXPORTS;


/**
 * Register standard transformers
 */
// header for request and response
item = require("./transform/header.js");
register('text/http-header', item).
    register('text/http-header-request', item);

// octet-stream for request and response
item = require("./transform/octet-stream.js");
register('application/octet-stream', item).
    register('application/octet-stream-request', item);

// json stringify for request
item = require("./transform/request/json.js");
register('application/json-request', item).
    register('text/json-request', item);
    
// json parse for response
item = require("./transform/json.js");
register('application/json', item).
    register('text/json', item);
    

