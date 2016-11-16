'use strict';

var LIBCORE = require("libcore"),
    HELP = require("./helper.js");


function createValue(operation, name, value, type, fieldType) {
    var CORE = LIBCORE,
        items = operation.returnValue,
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
    else if (!CORE.string(value)) {
        value = HELP.jsonify(value);
    }
    
    // this type of encoding is only available in form fields
    if ((isField || type === 'field-options')) {
        
        // use libcore to fill-in json
        CORE.urlFill(items, name, value);
        
    }
    else {
        
        items[name] = value;
        
    }
    items = value = null;

}

function convert(data) {
    var H = HELP,
        operation = {
            index: {},
            returnValue: {}
        },
        body = H.each(data, createValue, operation);
    
    return [null, H.jsonify(body)];
}


module.exports = convert;