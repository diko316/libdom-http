'use strict';

var LIBCORE = require("libcore"),
    HELP = require("./helper.js"),
    json = global.JSON;

if (!json) {
    json = false;
}

function eachFields(field, name, dimension) {
    
}

function convert(data) {
    var H = HELP;
    var raw;
    
    if (!json) {
        throw new Error("JSON is not supported in this platform");
    }
    else if (H.form(data)) {
        raw = data;
        H.eachFields(raw, eachFields, data = {});
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