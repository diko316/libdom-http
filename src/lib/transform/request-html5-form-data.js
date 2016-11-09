'use strict';

var LIBCORE = require("libcore"),
    HELP = require("./helper.js"),
    REQUEST_JSON = require("./request-json.js");

function eachArray(data, formData) {
    var c = -1,
        l = data.length;
    
    for (; l--;) {
        add(data[++c], formData);
    }
    
    return formData;
}

function eachObject(data, formData) {
    var contains = LIBCORE.contains;
    var name;
    for (name in data) {
        if (contains(data, name)) {
            add(data[name], formData, name);
        }
    }
    return formData;
}


function file(data) {
    return data instanceof global.File;
}

function add(value, formData, name) {
    var CORE = LIBCORE,
        isString = CORE.string,
        isFile = file,
        finite = isFinite,
        jsonify = REQUEST_JSON,
        hasName = isString(name),
        multiple = CORE.array(value);
    var c, l, list, filename;
    
    if (HELP.field(value)) {
        if (!hasName && !isString(name = value.name)) {
            value = null;
            return;
        }
        
        switch (value.type) {
        case 'file':
            value = value.files;
            multiple = true;
            break;
        case 'select':
            list = value.options;
            for (c = -1, l = list.length; l--;) {
                value = list[++c];
                if (value.selected) {
                    formData.append(name, value || '');
                }
            }
            list = value = null;
            return;
            
        case 'checkbox':
        case 'radio':
            if (!value.checked) {
                value = null;
                return;
            }
        /* falls through */
        default:
            value = value.value;
        }
    }
    
    if (hasName) {
        list = !multiple ? [value] : value;
        for (c = -1, l = list.length; l--;) {
            value = list[++c];
            
            // file upload
            if (isFile(value)) {
                filename = value.name;
                if (isString(filename)) {
                    formData.append(name, value, filename);
                }
                else {
                    formData.append(name, value);
                }
                continue;
            }
            
            // natives
            if (typeof value === 'number') {
                value = finite(value) ? value.toString(10) : '';
            }
            else if (typeof value !== 'string') {
                value = jsonify(value);
                value = value && value[1];
                if (!isString(value) || value === 'null') {
                    value = '';
                }
            }
            formData.append(name, value);
        }
    }
    list = value = null;
}


function convert(data) {
    var CORE = LIBCORE,
        H = HELP,
        method = null;
    var form;
    
    if (CORE.object(data)) {
        method = eachObject;
    }
    else if (CORE.array(data)) {
        method = eachArray;
    }
    else if (H.form(data)) {
        method = eachArray;
        data = data.elements;
    }
    else if (H.field(data)) {
        method = eachArray;
        data = [data];
    }
    
    form = null;
    
    if (method) {
        return [null, method(data, new (global.FormData)())];
    }
    
    return null;
    
}


module.exports = convert;