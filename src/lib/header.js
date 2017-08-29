'use strict';

import {
            string,
            number,
            object,
            array,
            contains,
            each as eachProperty
        } from "libcore";
        
var LINE_SPLIT_RE = /\r\n|\r|\n/,
    LINE_PAIR_RE = /^([^ \r\n\t\s\:]+)\:(.+)$/,
    LINE_EXTENSION_RE = /^([ \r\n\t\s]+.+|[^\:]+)$/,
    LINE_REQUEST_RE =
        /^([a-z]+)[ \t\s]+(\/[^\:]+)[ \t\s]+(HTTP\/[0-9]+\.[0-9]+)$/i,
    LINE_RESPONSE_RE =
        /^(HTTP\/[0-9]+.[0-9]+)[ \t\s]+([0-9]+)[ \t\s]+([a-z0-9\-\_]+)$/i,
    LINE_TRIM = /^[ \t\s]*(.+)[ \t\s]*$/,
    MULTI_VALUE_RE = /Set\-cookie/i,
    exported = {
        each: each,
        parse: parse,
        headerName: headerName
    };



function parseHeaderString(str, callback, scope) {
    var lines = str.split(LINE_SPLIT_RE),
        pairRe = LINE_PAIR_RE,
        extensionRe = LINE_EXTENSION_RE,
        requestRe = LINE_REQUEST_RE,
        responseRe = LINE_RESPONSE_RE,
        trimRe = LINE_TRIM,
        multivalueRe = MULTI_VALUE_RE,
        separator = ':',
        trimReplace = "$1",
        normalize = headerName,
        l = lines.length,
        c = -1,
        headers = {},
        names = [],
        nl = 0,
        name = null;
    var line, index, value, values, exist;
    
    if (typeof scope === 'undefined') {
        scope = null;
    }
        
    // parse
    for (; l--;) {
        line = lines[++c];
        
        // header request/response
        if (!c &&
            requestRe.test(line) || responseRe.test(line)) {
            names[nl++] = "";
            headers[""] = line;
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
            
            // normalize
            name = normalize(name);
            
            
            exist = contains(headers, name);
            if (!exist) {
                names[nl++] = name;
            }
            
            if (multivalueRe.test(name)) {
                if (!exist) {
                    headers[name] = [];
                }
                values = headers[name];
                values[values.length] = value;
            }
            else {
                headers[name] = value;
            }
            
        }
        // continuation
        else if (name && extensionRe.test(line)) {
            value = line.replace(trimRe, trimReplace);
            
            if (multivalueRe.test(name)) {
                values = headers[name];
                values[values.length - 1] += ' ' + value;
            }
            else {
                headers[name] += ' ' + value;
            }
            
        }
    }
    
    // callback
    for (c = -1, l = names.length; l--;) {
        name = names[++c];
        callback.call(scope, name, headers[name]);
    }
}



function parseCallback(name, values) {
    
    /* jshint validthis:true */
    this[name] = values;
}

function cleanArrayValues(array) {
    var isString = string,
        isNumber = number,
        l = array.length;
    var value;
    
    for (; l--;) {
        value = array[l];
        if (isNumber(value)) {
            array[l] = value.toString(10);
        }
        else if (!isString(value)) {
            array.splice(l, 1);
        }
    }
    return array;
}

function onEachInput(value, name) {
    var context = this,
        callback = context[0],
        scope = context[1],
        multivalueRe = MULTI_VALUE_RE;
    
    var len;
    
    name = headerName(name);
    
    if (string(value) || number(value)) {
        callback.call(scope, name,
                                multivalueRe.test(name) ?
                                    [value] : value);
    }
    else if (array(value)) {
        
        value = cleanArrayValues(value.slice(0));
        
        if (!multivalueRe.test(name)) {
            len = value.length;
            value = len ? value[len - 1] : '';
        }
        
        if (value.length) {
            callback.call(scope, name, value);
        }
    }
}

export 
    function headerName(name) {
        if (!name) {
            return '';
        }
        
        return name.charAt(0).toUpperCase() +
                    name.
                        substring(1, name.length).
                        toLowerCase();
        
    }
    
export
    function each(input, callback, scope, current) {
        
        // join as string
        if (array(input)) {
            input = cleanArrayValues(input.slice(0)).join("\r\n");
        }
        
        if (string(input)) {
            parseHeaderString(input, callback, scope, current);
            
        }
        else if (object(input)) {
            
            if (typeof scope === 'undefined') {
                scope = null;
            }
            
            eachProperty(input,
                         onEachInput,
                         [callback,
                          scope
                            
                         ],
                         true);
            
        }
        else {
            
            return false;
        }
        
        return true;
        
    }
    
export
    function parse(headers) {
        var values = {};
        return each(headers, parseCallback, values) && values;
    }
    
export default exported;
