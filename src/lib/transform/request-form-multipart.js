'use strict';

var LIBDOM = require("libdom"),
    LIBCORE = require("libcore"),
    browser = LIBDOM.env.browser,
    URL_ENCODE = require("./request-form-urlencoded.js"),
    EOL = "\r\n",
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

function encodePairs(output) {
    var boundary = createBoundary(),
        eol = EOL,
        headers = [
            'Content-Type: multipart/form-data; charset=utf-8;',
            '    boundary=' + boundary
        ],
        c = -1,
        l = output.length,
        len = 0,
        body = [];
    var contentHeader, name, value, index;
    
    // create body
    for (; l--;) {
        // break down
        value = output[++c];
        index = value.indexOf('=');
        name = value.substring(0, index);
        value = value.substring(index + 1, value.length);
        contentHeader = [
            'Content-Disposition: form-data; name="' + name + '"',
            'Content-type: application/octet-stream',
            eol
        ];
        
        body[len++] = contentHeader.join(eol) + value;
    }
    
    return [headers.join(eol),
            body.join(eol + boundary + eol)];
}



function convert(data) {
    var CORE = LIBCORE,
        urlencode = URL_ENCODE;
    
    // process form
    if (browser && LIBDOM.is(data, 1) &&
        data.tagName.toUpperCase() === 'FORM') {
        return encodePairs(urlencode.fromForm(data));
    }
    
    if (CORE.object(data)) {
        return encodePairs(urlencode.fromObject(data));
    }
    else if (CORE.string(data)) {
        return [null, data];
    }
    
    return null;
}


module.exports = convert;