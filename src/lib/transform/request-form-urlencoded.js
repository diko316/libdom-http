'use strict';

var LIBCORE = require("libcore"),
    LIBDOM = require("libdom"),
    browser = LIBDOM.env.browser,
    jsonTransform = require("./request-json.js");


function eachProperty(value, name) {
    /* jshint validthis:true */
    var CORE = LIBCORE,
        set = setOutputValue,
        output = this;
    var c, l;
    
    if (CORE.array(value)) {
        for (c = -1, l = value.length; l--;) {
            set(output, name, value[++c]);
        }
    }
    else {
        set(output, name, value);
    }
}

function setOutputValue(output, name, value) {
    var CORE = LIBCORE,
        isString = CORE.string;
        
    value = CORE.number(value) ?
                value.toString(10) :
                isString(value) ?
                    value :
                    jsonTransform(value);
                    
    output[output.length] = name + '=' + (
                                    isString(value) ?
                                        encodeURIComponent(value) :
                                        '');
}

function applyFieldValue(name, input, output) {
    var value = input.value,
        set = setOutputValue;
    var options, option, c, l;
    
    switch (input.type) {
    case 'select':
        options = input.options;
        for (c = -1, l = options.length; l--;) {
            option = options[++c];
            if (option.selected) {
                set(output, name, option.value);
            }
        }
        break;
    case 'radio':
    case 'checkbox':
        if (input.checked) {
            set(output, name, value);
        }
        break;
    default:
        set(output, name, value);
    }
    
    options = option = null;
    
    return output;
}

function getFieldPairs(form) {
    var isString = LIBCORE.string,
        elements = form.elements,
        c = -1,
        l = elements.length,
        apply = applyFieldValue,
        output = [];
    var node, name;
    
    for (; l--;) {
        node = elements[++c];
        name = node.name;
        if (isString(name)) {
            apply(name, node, output);
        }
    }
    
    elements = node = null;
    
    return output;
}

function fromObject(data) {
    var output = [];
    LIBCORE.each(data, eachProperty, output);
    return output;
}

function convert(data) {
    var CORE = LIBCORE;
    
    // process form
    if (browser && LIBDOM.is(data, 1) &&
        data.tagName.toUpperCase() === 'FORM') {
        data = getFieldPairs(data).join('&');
    }
    
    if (CORE.object(data)) {
        return [null, fromObject(data).join('&')];
    }
    else if (CORE.string(data)) {
        return [null, data];
    }
    
    return null;
}

module.exports = convert;

convert.fromForm = getFieldPairs;
convert.fromObject = fromObject;