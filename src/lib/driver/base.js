'use strict';

var LIBCORE = require("libcore");

function bind(instance, method) {
    function bound() {
        return method.apply(instance, arguments);
    }
    return bound;
}

function Request() {
    var me = this,
        list = this.bindMethods,
        len = list.length,
        bindMethod = bind;
    var name;
    for (; len--;) {
        name = list[len];
        me[name] = bindMethod(me, me[name]);
    }
}

Request.prototype = {
    bindMethods: [
        'setup',
        'transport',
        'process',
        'success',
        'error'
    ],
    aborted: false,
    request: null,
    response: null,
    
    setup: function (operation) {
        return operation;
    },
    /* jshint unused:false */
    transport: function (operation) {
        return Promise.reject("No tranport() implementation.");
    },
    
    process: function (status) {
        return status;
    },
    
    /* jshint unused:false */
    success: function (status) {
        var response = this.response;
        
        // process response
        if (response) {
            response.process();
        }
        
        this.cleanup(status);
        return response;
    },
    
    error: function (status) {
        var response = this.response;
        
        // process response
        if (response) {
            response.process();
        }
        
        this.cleanup(status);
        return Promise.reject(status);
    },
    
    abort: function () {
        var me = this,
            request = me.request;
            
        me.aborted = true;
        if (request && LIBCORE.method(request.resolve)) {
            request.resolve(0);
        }
    },
    
    cleanup: function () {
        
    }
};

module.exports = Request;