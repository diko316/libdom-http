'use strict';

import {
            object,
            array,
            each,
            instantiate,
            middleware
        } from "libcore";

import BASE from "./base.js";

var MIDDLEWARE = middleware("libdom-http.driver.xhr"),
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
    if (!array(value)) {
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


Xhr.prototype = instantiate(BASE, {
    level: 1,
    bindMethods: BASE_PROTOTYPE.bindMethods.concat([
                    'onReadyStateChange'
                ]),
    
    constructor: Xhr,
    
    onReadyStateChange: function () {
        var me = this,
            request = me.request,
            xhr = request.xhrTransport,
            run = MIDDLEWARE.run,
            args = [me, request],
            resolve = request.resolve,
            reject = request.reject;
        var status;
        
        if (!request.aborted && resolve && reject) {
            
            run("before:readystatechange", args);
            
            switch (xhr.readyState) {
            case STATE_UNSENT:
            case STATE_OPENED:
            case STATE_HEADERS_RECEIVED: 
            case STATE_LOADING: break;
            case STATE_DONE:
                status = xhr.status;
                if (status < 200 || status > 299) {
                    reject(status);
                }
                else {
                    resolve(status);
                }
            }
            run("after:statechange", args);
        }
        me = xhr = request = args = args[0] = args[1] = null;
    },
    
    createTransportPromise: function(request) {
        function bind(resolve, reject) {
            var local = request;
            local.resolve = resolve;
            local.reject = reject;
            local = null;
        }
        return new Promise(bind);
    },
    
    onSetup: function (request) {
        var me = this,
            args = [me, request],
            run = MIDDLEWARE.run,
            xhr = new (global.XMLHttpRequest)();
            
        
        request.xhrTransport = xhr;
        
        run("before:setup", args);
        
        xhr.onreadystatechange = me.onReadyStateChange;
        xhr.open(request.method.toUpperCase(), request.getUrl(), true);
        
        
        run("after:setup", args);
        
        xhr = args = args[0] = args[1] = null;
        
    },
    
    onTransport: function (request) {
        var me = this,
            xhr = request.xhrTransport,
            headers = request.headers,
            args = [me, request];
       
        MIDDLEWARE.run("before:request", args);
       
        request.transportPromise = me.createTransportPromise(request);
        
        
        
        // apply headers
        headers = request.headers;
        if (object(headers)) {
            each(headers, applyHeader, xhr);
        }
        
        xhr.send(request.body);
        
        MIDDLEWARE.run("after:request", args);
        
        
        xhr = args = args[0] = args[1] = null;
        
        
    },
    
    // process success
    onSuccess: function (request) {
        var me = this,
            xhr = request.xhrTransport,
            response = request.response,
            args = [me, request],
            run = MIDDLEWARE.run;
        
        response.status = xhr.status;
        response.statusText = xhr.statusText;
        response.addHeaders(xhr.getAllResponseHeaders());
        response.body = xhr.responseText;
        
        run("after:response", args);
        
        xhr = args = args[0] = args[1] = null;
        
    },
    
    onCleanup: function (request) {
        var me = this,
            xhr = request.xhrTransport;
        var args;
        
        if (xhr) {
            args = [me, request];
            MIDDLEWARE.run("after:cleanup", args);
            args = args[0] = args[1] = 
                    xhr = xhr.onreadystatechange = null;
        }
        
        request.transportPromise = 
            request.resolve =
            request.reject = 
            request.xhrTransport = xhr = null;
    }

});



export default Xhr;