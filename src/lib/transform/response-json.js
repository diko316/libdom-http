'use strict';

import { string } from "libcore";

var json = global.JSON;

if (!json) {
    json = false;
}


function convert(data) {
    
    if (!json) {
        throw new Error("JSON is not supported in this platform");
    }
    else if (!string(data)) {
        return null;
    }
    
    try {
        data = json.parse(data);
    }
    catch (e) {
        return null;
    }
    
    return [null, data];
}

export default convert;