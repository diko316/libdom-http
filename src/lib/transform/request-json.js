'use strict';

var LIBCORE = require("libcore"),
    json = global.JSON;

if (!json) {
    json = false;
}

function processForm() {
    
}

function convert(data) {
    
    if (!json) {
        throw new Error("JSON is not supported in this platform");
    }
    else if (!LIBCORE.object(data)) {
        return [null, ''];
    }
    
    try {
        data = json.stringify(data);
    }
    catch (e) {
        return [null, ''];
    }
    return [null, data];
}


module.exports = convert;