'use strict';


var LIBDOM = require("libdom"),
    LIBCORE = require("libcore"),
    FIELD_NAME_RE = /^([a-z0-9\-\_])((\[[^\[\]]*\])*)$/i,
    FIELD_NAME_DIMENSION_RE = /\[[^\[\]]*\]/g;



function isForm(form) {
    return LIBDOM.is(form, 1) && form.tagName.toUpperCase() === 'FORM';
}

function isField(field) {
    if (LIBDOM.is(field, 1)) {
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

function parseFieldName(name) {
    var match, base, array, index, c, l;
    
    if (LIBCORE.string(name)) {
        match = name.match(FIELD_NAME_RE);
        if (match) {
            base = match[1];
            array = match[2] && name.match(FIELD_NAME_DIMENSION_RE);
            
            // create dimension index
            if (array) {
                for (c = -1, l = array.length; l--;) {
                    index = array[++c];
                    array[c] = index.substring(1, index.length - 1);
                }
            }
            return [base, array || null];
        }
    }
    return null;
}

function eachFields(form, callback, scope) {
    var parse = parseFieldName,
        elements = form.elements,
        l = elements.length,
        c = -1;
        
    var field, name;
    
    scope = scope || null;
    
    for (; l--;) {
        field = elements[++c];
        name = parse(field.name);
        
        if (name) {
            callback.call(scope, field, name[0], name[1]);
        }
    }
    
}


module.exports = {
    eachFields: eachFields,
    form: isForm,
    field: isField
};



