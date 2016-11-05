'use strict';

var LIBCORE = require("libcore"),
    LIBDOM = require("libdom");

function eachForm(data, formData) {
    return formData;
}
function eachArray(data, formData) {
    return formData;
}

function eachObject(data, formData) {
    return formData;
}


function convert(data) {
    var CORE = LIBCORE,
        method = null;
    var form;
    
    if (CORE.object(data)) {
        method = eachObject;
    }
    else if (CORE.array(data)) {
        method = eachArray;
    }
    else if (LIBDOM.is(data, 1)) {
        form = data.tagName.toUpperCase() === 'FORM' ?
                    data : data.form || null;
        if (form) {
            data = form;
            method = eachForm;
        }
    }
    
    form = null;
    
    if (method) {
        return method(data, new (global.FormData)());
    }
    
    return null;
    
}


module.exports = convert;