'use strict';

var LIBCORE = require("libcore"),
    HELP = require("./helper.js"),
    NUMERIC_RE = /^[0-9]*$/;



function fillValue(parent, name, value) {
    var CORE = LIBCORE;
    var current;
    
    // doesn't contain
    if (!CORE.contains(parent, name)) {
        parent[name] = value;
    }
    
    current = parent[name];
    
    if (CORE.object(current)) {
        current[""] = value;
    }
    else if (CORE.array(current)) {
        current[current.length] = value;
    }
    else {
        parent[name] = [current, value];
    }
}


function createValue(operation, name, value, type, fieldType) {
    var CORE = LIBCORE,
        contains = CORE.contains,
        object = CORE.object,
        array = CORE.array,
        assign = CORE.assign,
        items = operation.returnValue,
        numericRe = NUMERIC_RE,
        isField = type === "field";
    var parsed, index, parent, item, c, l, property, current, numeric, isArray;
    
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
        
        parsed = HELP.fieldName(name);
        
        // must conform to https://darobin.github.io/formic/specs/json/
        if (parsed) {
            
            parent = items;
            name = parsed[0];
            index = parsed[1];
            
            for (c = -1, l = index.length; l--;) {
                item = index[++c];
                numeric = numericRe.test(item);
                
                // replace name
                if (!name && array(parent)) {
                    name = parent.length.toString(10);
                }
                
                // finalize property
                if (contains(parent, name)) {
                    property = parent[name];
                    isArray = array(property);
                    
                    // replace property into object or array
                    if (!isArray && !object(property)) {
                        if (numeric) {
                            property = [property];
                        }
                        else {
                            current = property;
                            property = {};
                            property[""] = current;
                        }
                    }
                    // change property to object
                    else if (isArray && numeric) {
                        property = assign({}, property);
                        delete property.length;
                    }
                }
                else {
                    property = numeric ? [] : {};
                }
                
                parent = parent[name] = property;
                name = item;
                
                
            }
            items = parent;
        }
    }
    
    items[name] = value;
    
    parent = value = null;

}

function convert(data) {
    var H = HELP,
        operation = {
            index: {},
            returnValue: {}
        },
        body = H.each(data, createValue, operation);
    console.log('created! ', body);
    return [null, H.jsonify(body)];
}


module.exports = convert;