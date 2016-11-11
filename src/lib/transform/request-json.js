'use strict';

var LIBCORE = require("libcore"),
    HELP = require("./helper.js");



function applyObject(index, root, rawName, access, value, dimensions) {
    var CORE = LIBCORE,
        object = CORE.object,
        array = CORE.array,
        contains = CORE.contains,
        c = -1,
        parent = root,
        l = dimensions.length;
    var l, item, name, isObject;
    
    // add base name
    dimensions[l++] = access;
    
    for (; l--;) {
        item = dimensions[++c];
        isObject = object(parent);
        
        
    }
}


function createValue(operation, name, value, type, fieldType) {
    var items = operation.returnValue,
        isField = type === "field";
    var parsed;
    
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
    if ((isField || type === 'field-options')) {
        parsed = HELP.fieldName(name);
        if (parsed) {
            applyObject(operation.index,
                        items,
                        name,
                        parsed[0],
                        value,
                        parsed[1]);
        }
    }
    
    items[name] = value;

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