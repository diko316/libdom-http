'use strict';

var LIBCORE = require("libcore");


function convert(data) {
    var CORE = LIBCORE;
    
    if (CORE.number(data)) {
        data = data.toString(10);
    }
    
    return ['Content-type: text/plain',
            CORE.string(data) ?
                data : ''];
}


module.exports = convert;