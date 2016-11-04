'use strict';

var LIBCORE = require("libcore"),
    EMPTY = '',
    json = global.JSON;

if (!json) {
    json = false;
}


function convert(data) {
    
    if (!json) {
        throw new Error("JSON is not supported in this platform");
    }
    else if (!LIBCORE.object(data)) {
        return EMPTY;
    }
    
    try {
        data = json.stringify(data);
    }
    catch (e) {
        return EMPTY;
    }
    return data;
}


module.exports = convert;