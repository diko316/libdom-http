'use strict';

import {
            each,
            jsonify
        } from "./helper.js";

function createValue(operation, name, value, type, fieldType) {
    var items = operation.returnValue;
    
    if (type === 'field') {
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
        value = jsonify(value);
    }
    
    // encode
    items[items.length] = name + '=' + encodeURIComponent(value);
}


function convert(data) {
    var body = each(data, createValue, {
                    returnValue: []
                });
    
    return [null, body.join('&')];
}

export default convert;
