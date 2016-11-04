'use strict';

var LIBCORE = require("libcore"),
    json = global.JSON;

if (!json) {
    json = false;
}


function convert(data) {
    
    if (!json) {
        throw new Error("JSON is not supported in this platform");
    }
    else if (!LIBCORE.string(data)) {
        return void(0);
    }
    
    try {
        data = json.parse(data);
    }
    catch (e) {
        return void(0);
    }
    return data;
}


module.exports = convert;