'use strict';

var LIBCORE = require("libcore"),
    HELP = require("./helper.js");

function appendFormData(operation, name, value, type, fieldType) {
    var formData = operation.returnValue,
        isString = LIBCORE.string;
    var list, c, l, filename;
    
    // don't use parsed name for formData
    if (type === 'field') {
        
        if (fieldType === "file") {
            list = value.files;
            for (c = -1, l = list.length; l--;) {
                value = list[++c];
                filename = value.name;

                if (isString(filename)) {
                    formData.append(name, value, filename);
                }
                else {
                    formData.append(name, value);
                }
            }
            formData = null;
            return;
        }
        value = value.value;
    }

        
    // natives
    if (typeof value === 'number') {
        value = isFinite(value) ? value.toString(10) : '';
    }
    else if (typeof value !== 'string') {
        value = HELP.jsonify(value);
    }
    formData.append(name, value);
    
    formData = null;
}


function convert(data) {
    return [null,
            HELP.each(data,
                    appendFormData,
                    {
                        returnValue: new (global.FormData)()
                    })];
    
}


module.exports = convert;