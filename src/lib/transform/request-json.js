'use strict';

import {
            string,
            jsonFill
        } from "libcore";
        
import {
            jsonify,
            each
        } from "./helper.js";


function createValue(operation, name, value, type, fieldType) {
    var items = operation.returnValue,
        isField = type === "field";
    
    if (isField) {
        // i can't support file upload
        if (fieldType === "file") {
            return;
        }
        value = value.value;
    }
    
    if (value === 'number') {
        value = isFinite(value) ? value.toString(10) : '';
    }
    else if (!string(value)) {
        value = jsonify(value);
    }
    
    // this type of encoding is only available in form fields
    if ((isField || type === 'field-options')) {
        
        // use libcore to fill-in json
        jsonFill(items, name, value);
        
    }
    else {
        
        items[name] = value;
        
    }
    items = value = null;

}

function convert(data) {
    var operation = {
            index: {},
            returnValue: {}
        },
        body = each(data, createValue, operation);
    
    return [null, jsonify(body)];
}

export default convert;
