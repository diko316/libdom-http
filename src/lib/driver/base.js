'use strict';

function bind(instance, method) {
    function bound() {
        return method.apply(instance, arguments);
    }
    return bound;
}

function Driver() {
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

Driver.prototype = {
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
    
    constructor: Driver,
    
    /* jshint unused:false */
    onSetup: function (request) {
        
    },
    
    /* jshint unused:false */
    onTransport: function (request) {
        
    },
    
    onCleanup: function (request) {
        
    },
    
    onSuccess: function (request, status) {
        
    },
    
    onError: function (status) {
        
        
    },
    
    setup: function (request) {
        var me = this;
        me.request = request;
        me.onSetup(request);
        request.process();
        me.response = request.response;
        return request;
    },
    
    /* jshint unused:false */
    transport: function (request) {
        this.onTransport(request);
        request.begin();
        return request;
    },
    
    /* jshint unused:false */
    success: function (status) {
        var me = this,
            request = me.request,
            response = request && request.response;
        
        
        
        // process response
        if (request) {
            me.onSuccess(request, status);
            me.onCleanup(request);
            request.end();
        }
        else {
            
            return me.error(status);
        
        }
        
        // end response
        response.end();
        
        delete me.request;
        
        return response;
    },
    
    error: function (status) {
        var me = this,
            request = me.request,
            response = request && request.response;
        
        me.onError(status);
        
        // process response
        if (request) {
            me.onCleanup(request);
            request.end();
        }
        
        // end response
        if (response) {
            response.end();
        }
        
        delete me.request;
        
        return Promise.reject(status);
    },
    
    abort: function () {
        //var me = this,
        //    request = me.request;
        //
        //if (!me.aborted) {   
        //    me.aborted = true;
        //    
        //    if (request && LIBCORE.method(request.resolve)) {
        //        request.resolve(0);
        //    }
        //}
    }
};

module.exports = Driver;