'use strict';

var LIBCORE = require("libcore"),
    LINE_SPLIT_RE = /\r\n|\r|\n/,
    LINE_PAIR_RE = /^([^ \r\n\t\s\:]+)\:(.+)$/,
    LINE_EXTENSION_RE = /^([ \r\n\t\s]+.+|[^\:]+)$/,
    LINE_REQUEST_RE =
        /^([a-z]+)[ \t\s]+(\/[^\:]+)[ \t\s]+(HTTP\/[0-9]+\.[0-9]+)$/i,
    LINE_RESPONSE_RE =
        /^(HTTP\/[0-9]+.[0-9]+)[ \t\s]+([0-9]+)[ \t\s]+([a-z0-9\-\_]+)$/i,
    LINE_TRIM = /^[ \t\s]*(.+)[ \t\s]*$/,
    EXPORTS = {
        each: eachHeader,
        parse: parse
    };
    
function parseHeaderString(str, callback) {
    var lines = str.split(LINE_SPLIT_RE),
        pairRe = LINE_PAIR_RE,
        extensionRe = LINE_EXTENSION_RE,
        requestRe = LINE_REQUEST_RE,
        responseRe = LINE_RESPONSE_RE,
        trimRe = LINE_TRIM,
        separator = ':',
        trimReplace = "$1",
        contains = LIBCORE.contains,
        l = lines.length,
        c = -1,
        headers = {},
        names = [],
        nl = 0,
        name = null;
    var line, index, value, values, len;
    
    // parse
    for (; l--;) {
        line = lines[++c];
        
        // header request/response
        if (!c &&
            requestRe.test(line) || responseRe.test(line)) {
            
            headers[""] = line;
            callback("", line);
            continue;
            
        }
        
        // pair
        if (pairRe.test(line)) {
            index = line.indexOf(separator);
            name = line.substring(0, index);
            value = line.
                        substring(index + 1, line.length).
                        replace(trimRe, trimReplace);
                        
            if (!value) {
                continue;
            }
            
            if (!contains(headers, name)) {
                headers[name] = [];
                names[nl++] = name;
            }
            values = headers[name];
            values[values.length] = value;
        }
        else if (name && extensionRe.test(line)) {
            if (!contains(headers, name)) {
                headers[name] = [];
            }
            values = headers[name];
            len = values.length;
            
            values[!len ?
                    len : len -1] = (len ? ' ' : '') + line.replace(trimRe,
                                                                trimReplace);
        }
    }
    
    // callback
    for (c = -1, l = names.length; l--;) {
        name = names[++c];
        callback(name, headers[name]);
    }
}

function eachHeader(input, callback, scope) {
    var CORE = LIBCORE,
        isString = CORE.string,
        isNumber = CORE.number,
        isArray = CORE.array,
        contains = CORE.contains,
        clean = cleanArrayValues;
    var name, value;
    
    // join as string
    if (CORE.array(input)) {
        input = clean(input.slice(0)).join("\r\n");
    }
    
    if (isString(input)) {
        parseHeaderString(input, callback, scope);
        
    }
    else if (CORE.object(input)) {
        if (typeof scope === 'undefined') {
            scope = null;
        }
        for (name in input) {
            if (contains(input, name)) {
                value = input[name];
                
                if (isString(value) || isNumber(value)) {
                    value = [value];
                    callback.call(scope, name, value);
                }
                else if (isArray(value)) {
                    value = clean(value.slice(0));
                    if (value.length) {
                        callback.call(scope, name, value);
                    }
                }
            }
        }
    }
    
    return EXPORTS.chain;
    
}

function parse(headers) {
    var values = {};
    eachHeader(headers, parseCallback, values);
    return values;
}

function parseCallback(name, values, target) {
    target[name.charAt(0).toUpperCase() +
            name.
                substring(1, name.length).
                toLowerCase()] = values;
}

function cleanArrayValues(array) {
    var CORE = LIBCORE,
        isString = CORE.string,
        isNumber = CORE.number,
        l = array.length;
    var value;
    
    for (; l--;) {
        value = array[l];
        if (!isString(value) && !isNumber(value)) {
            array.splice(l, 1);
        }
    }
    return array;
}


module.exports = EXPORTS;