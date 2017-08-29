'use strict';

import {
            string,
            object,
            array,
            date,
            contains,
            each as eachProperty
            
        } from "libcore";

import {
            is
        } from "libdom";

var TYPE_OBJECT = 1,
    TYPE_ARRAY = 2;



function isForm(form) {
    return is(form, 1) && form.tagName.toUpperCase() === 'FORM';
}

function isField(field) {
    if (is(field, 1)) {
        switch (field.tagName.toUpperCase()) {
        case 'INPUT':
        case 'TEXTAREA':
        case 'BUTTON':
        case 'SELECT':
        case 'OUTPUT': return true;
        }
    }
    return false;
}

function onEachObjectValueProperty(value, name) {
    /* jshint validthis: true */
    var context = this;
    
    eachField(value,
              name,
              context[1],
              context[0]);
}

function eachValues(values, callback, operation) {
    var typeObject = TYPE_OBJECT,
        typeArray = TYPE_ARRAY,
        type = null,
        each = eachField,
        isObject = object,
        isObjectValue = isObject(values);
        
    var c, l;
    
    if (isForm(values)) {
        values = values.elements;
        type = typeArray;
        isObjectValue = false;
    }
    else if (isField(values)) {
        type = typeArray;
        values = [values];
    }
    else if (isObjectValue) {
        type = typeObject;
    }
    else if (array(values)) {
        type = typeArray;
        isObjectValue = false;
    }
    
    if (!isObject(operation)) {
        operation = {};
    }
    
    if (!contains(operation, 'returnValue')) {
        operation.returnValue = null;
    }
    
    if (isObjectValue || type === typeArray) {
        if (isObjectValue) {
            eachProperty(values,
                         onEachObjectValueProperty,
                         [operation, callback],
                         true);
        }
        else {
            for (c = -1, l = values.length; l--;) {
                each(values[++c], null, callback, operation);
            }
        }
    }
    
    return operation.returnValue;
}

function eachField(field, name, callback, operation) {
    var isString = string,
        hasName = isString(name),
        fieldType = 'variant';
    var type, c, l, list, option;
    
    if (isField(field)) {
        if (!hasName && !isString(name = field.name)) {
            return;
        }
        type = 'field';
        hasName = true;
        fieldType = field.type;
        
        // field exception by tagname
        switch (field.tagName.toUpperCase()) {
        case "BUTTON":
            if (!isString(fieldType)) {
                fieldType = "button";
            }
            break;

        case "SELECT":
            type = 'field-options';
            fieldType = 'select';
            list = field.options;
            for (c = -1, l = list.length; l--;) {
                option = list[++c];
                // run callback
                if (option.selected) {
                    callback(operation,
                            name,
                            option.value,
                            type,
                            fieldType);
                }
            }
            list = option = null;
            return;
        
        case "TEXTAREA":
            fieldType = "text";
            break;
        }
        
        // field exception by type
        switch (fieldType) {
        case "checkbox":
        case "radio":
            if (!field.checked) {
                return;
            }
        }
        
    }
    else {
        switch (true) {
        case array(field):
            type = 'array';
            break;
        case date(field):
            type = 'date';
            break;
        default:
            type = typeof field;
        }
    }
    
    if (hasName) {
        callback(operation, name, field, type, fieldType);
    }
}

export
    function jsonify(raw) {
        var json = global.JSON,
            data = null;
            
        if (!json) {
            throw new Error("JSON is not supported in this platform");
        }
        try {
            data = json.stringify(raw);
        }
        catch (e) {}
        return data === 'null' || data === null ? '' : data;
    }

export {
            eachValues as each,
            isForm as form,
            isField as field
        };

export default {
                each: eachValues,
                form: isForm,
                field: isField,
                jsonify: jsonify
            };
