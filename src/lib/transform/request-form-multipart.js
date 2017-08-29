'use strict';

import {
            each,
            jsonify
        } from "./helper.js";

var EOL = "\r\n",
    BOUNDARY_LENGTH = 48;

function createBoundary() {
    var ender = Math.random().toString().substr(2),
        output = [],
        len = 0,
        total = BOUNDARY_LENGTH - ender.length;
    
    for (; total--;) {
        output[len++] = '-';
    }
    output[len++] = ender;
    return output.join('');
}

function createValue(operation, name, value, type, fieldType) {
    var eol = EOL,
        items = operation.returnValue;
    
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
    items[items.length] = ([
                'Content-Disposition: form-data; name="' + name + '"',
                'Content-type: application/octet-stream',
                eol,
                value
            ]).join(eol);
    
}

function convert(data) {
    var eol = EOL,
        boundary = createBoundary(),
        body = each(data,
                    createValue, {
                        returnValue: []
                    });
    // start boundary
    if (!body.length) {
        body.splice(0, 0, boundary);
    }
    
    
    return [
        // create header
        ([
            'Content-Type: multipart/form-data; charset=utf-8;',
            '    boundary=' + boundary
        ]).join(eol),
        
        // start boundary
        boundary + eol +
        
        body.join(eol + boundary + eol) +
        
        // end boundary
        boundary + '--' + eol
    ];
    
}


export default convert;