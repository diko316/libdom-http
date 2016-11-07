'use strict';

var LIBCORE = require("libcore"),
    REQUEST = require("./operation.js"),
    OPERATION = REQUEST.Operation,
    TRANSFORMER = require("./transform.js");
    
    
function Response() {
    OPERATION.apply(this, arguments);
}


Response.prototype = LIBCORE.instantiate(OPERATION, {
    constructor: Response,
    status: 0,
    statusText: 'Uninitialized',
    process: function () {
        var me = this,
            result = TRANSFORMER.transform(me.header('content-type'),
                                        true,
                                        me.body),
            headers = result[0];
        
        me.using();
        // body will be parsed to create data based on the content type
        if (headers) {
            me.addHeaders(headers);
        }
        me.data = result[1];
        
    }
});

module.exports = Response;