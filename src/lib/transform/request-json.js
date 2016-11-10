'use strict';

var HELP = require("./helper.js");


function createValue(operation, name, value, type, fieldType, parsed) {
    var items = operation.returnValue,
        isField = type === "field" || type === 'field-options';
    var dimensions, base;
    
    if (isField) {
        // i can't support file upload
        if (fieldType === "file") {
            return;
        }
        value = value.value;
    }
    
    if (typeof value === 'number') {
        value = isFinite(value) ? value.toString(10) : '';
    }
    else if (typeof value !== 'string') {
        value = HELP.jsonify(value);
    }
    
    // this type of encoding is only available in form fields
    if (isField && parsed) {
        base = parsed[0];
        dimensions;
        console.log('base ', base);
    }
    else {
        console.log('not parsed', name);
    }
    
    
    
    ///items[items.length] = name + '=' + encodeURIComponent(value);
}

function convert(data) {
    var H = HELP,
        body = H.each(data, createValue, {
                    returnValue: {}
                });
    console.log('run! ', data);
    return [null, H.jsonify(body)];
}


module.exports = convert;