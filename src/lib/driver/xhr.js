'use strict';

var LIBCORE = require("libcore"),
    BASE = require("./base.js"),
    MIDDLEWARE = LIBCORE.middleware("libdom-http.driver.xhr"),
    STATE_UNSENT = 0,
    STATE_OPENED = 1,
    STATE_HEADERS_RECEIVED = 2,
    STATE_LOADING = 3,
    STATE_DONE = 4,
    BASE_PROTOTYPE = BASE.prototype;


function applyHeader(value, name) {
    /* jshint validthis:true */
    var me = this;
    var c, l;
    if (!LIBCORE.array(value)) {
        value = [value];
    }
    for (c = -1, l = value.length; l--;) {
        me.setRequestHeader(name, value[++c]);
    }
}


function Xhr() {
    var me = this,
        args = [me];
    BASE.apply(me, arguments);
    
    MIDDLEWARE.run("after:instantiated", args);
    
    args = args[0] = null;
}


Xhr.prototype = LIBCORE.instantiate(BASE, {
    level: 1,
    bindMethods: BASE_PROTOTYPE.bindMethods.concat([
                    'onReadyStateChange'
                ]),
    
    onReadyStateChange: function () {
        var me = this,
            xhr = me.xhr,
            run = MIDDLEWARE.run,
            operation = me.request,
            args = [me, xhr];
        var status;
        
        if (!me.aborted) {
            run("before:readystatechange", args);
            
            switch (xhr.readyState) {
            case STATE_UNSENT:
            case STATE_OPENED:
            case STATE_HEADERS_RECEIVED: 
            case STATE_LOADING: break;
            case STATE_DONE:
                status = xhr.status;
                if (status < 200 || status > 299) {
                    operation.reject(status);
                }
                else {
                    operation.resolve(status);
                }
            }
            run("after:statechange", args);
        }
        me = xhr = operation = args = args[0] = args[1] = null;
    },
    
    createTransportPromise: function(operation) {
        function bind(resolve, reject) {
            operation.resolve = resolve;
            operation.reject = reject;
        }
        return new Promise(bind);
    },
    
    setup: function (operation) {
        var me = this,
            CORE = LIBCORE,
            xhr = new (global.XMLHttpRequest)(),
            args = [me, xhr],
            run = MIDDLEWARE.run;
        var headers;
        
        BASE_PROTOTYPE.setup.apply(me, arguments);
        
        me.xhr = xhr;
        
        run("after:setup", args);
        
        xhr.open(me.method.toUpperCase(), me.url, true);
        xhr.onreadystatechange = me.onReadyStateChange;
        
        run("before:request", args);
        
        headers = operation.headers;
        if (CORE.object(headers)) {
            CORE.each(headers, applyHeader, xhr);
        }
        
        
        xhr = args = args[0] = args[1] = null;
        return operation;
    },
    
    transport: function (operation) {
        var me = this,
            xhr = me.xhr,
            args = [me, xhr];
        
        MIDDLEWARE.run("after:request", args);
        
        xhr.send(null);
        
        xhr = args = args[0] = args[1] = null;
        
        return me.createTransportPromise(operation);
    },
    
    process: function (status) {
        var me = this,
            xhr = me.xhr,
            response = me.response,
            args = [me, xhr],
            run = MIDDLEWARE.run,
            readyState = xhr.readyState;
        
        if (me.aborted) {
            run("after:abort", args);
        }
        
        if (readyState >= STATE_OPENED) {
            response.status = xhr.status;
            response.statusText = xhr.statusText;
            response.addHeaders(xhr.getAllResponseHeaders());
        }
        
        if (readyState > STATE_LOADING) {
            response.body = xhr.responseText;
            run("after:response", args);
        }
        xhr = args = args[0] = args[1] = null;
        
        return status;
    },
    
    cleanup: function () {
        var me = this,
            request = me.request,
            xhr = me.xhr;
        var args;
        
        if (xhr) {
            args = [me, xhr];
            MIDDLEWARE.run("after:cleanup", args);
            me.xhr = args = args[0] = args[1] =
                    xhr = xhr.onreadystatechange = null;
        }
        if (request) {
            request.reject = null;
            request.resolve = null;
        }
        delete me.xhr;
    },
    
    abort: function () {
        var me = this,
            before = me.aborted,
            result = BASE_PROTOTYPE.abort.apply(me, arguments),
            xhr = me.xhr;
        
        if (!before && me.aborted && xhr) {
            xhr.abort();
        }
        xhr = null;
        return result;
    }
});



module.exports = Xhr;