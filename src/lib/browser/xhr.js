'use strict';

var LIBCORE = require("libcore"),
    BASE = require("../base.js"),
    STATE_UNSENT = 0,
    STATE_OPENED = 1,
    STATE_HEADERS_RECEIVED = 2,
    STATE_LOADING = 3,
    STATE_DONE = 4,
    
    HTTP_REQUEST = BASE.request,
    BASE_HTTP_REQUEST = HTTP_REQUEST.prototype;

function Xhr() {
    HTTP_REQUEST.apply(this, arguments);
}


Xhr.prototype = LIBCORE.instantiate(HTTP_REQUEST, {
    
    constructor: Xhr,
    
    driver: void(0),
    
    bindNames: BASE_HTTP_REQUEST.bindNames.
                concat([
                    'onReadyStateChange'
                ]),
    
    onReadyStateChange: function () {
        var me = this,
            driver = me.driver,
            operation = me.operation;
        var status;
        
        if (driver) {
            switch (driver.readyState) {
            case STATE_UNSENT: break;
            case STATE_OPENED: break;
            case STATE_HEADERS_RECEIVED: break;
            case STATE_LOADING: break;
            case STATE_DONE:
                
                status = driver.status;
                if (status < 200 || status > 299) {
                    operation.reject(status);
                }
                else {
                    operation.resolve(status);
                }
            }
        }
        else if (operation) {
            operation.reject(0);
        }
        
        operation = driver = null;
    },
    
    eachSetHeader: function (value, name) {
        var driver = this.driver,
            l = value.length,
            c = 0;
        
        for (; l--; c++) {
            driver.setRequestHeader(name, value[c]);
        }
    },
    
    createTransportPromise: function () {
        var me = this;
        
        // populate operation
        function callback(resolve, reject) {
            var operation = me.operation;
            operation.resolve = resolve;
            operation.reject = reject;
            operation = null;
        }
        
        return new Promise(callback);
    },
    
    prepare: function (operation) {
        var CORE = LIBCORE,
            me = this,
            config = operation.config,
            driver = new (global.XMLHttpRequest)(),
            withCredentials = config.withCredentials,
            headers = me.headers;
        
        // create driver
        me.driver = driver;
        
        driver.open(me.method.toUpperCase(), me.url, true);
        
        if (CORE.object(headers)) {
            CORE.each(headers, me.eachSetHeader, me);
        }
        if (typeof withCredentials === 'boolean') {
            driver.withCredentials = withCredentials;
        }
        driver.timeout = me.timeout;
        driver.onreadystatechange = me.onReadyStateChange;
        driver = null;
        return operation;
    },
    
    transport: function () {
        var me = this;
        
        me.driver.send(me.body || null);

        return me.createTransportPromise();
    },
    
    process: function (operation, response) {
        var driver = this.driver;
        var responseText;
        
        if (driver.readyState > STATE_HEADERS_RECEIVED) {
            
            response.status = driver.status;
            response.statusText = driver.statusText;
            
            responseText = driver.responseText;
            response.body = responseText;
            response.processHeaders(driver.getAllResponseHeaders());
            response.processBody(responseText);
        }
        
        response.process();
        
        
        driver = null;
        return operation;
    },
    
    cleanup: function () {
        var me = this,
            driver = me.driver;
            
        // unset driver
        if (driver) {
            me.driver = driver =
                        driver.onreadystatechange = null;
        }
        
        delete me.driver;
        
        BASE_HTTP_REQUEST.cleanup.apply(me, arguments);
        
        return me;
    }
    
    
});



module.exports = Xhr;