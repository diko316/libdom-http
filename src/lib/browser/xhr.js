'use strict';

var LIBCORE = require("libcore"),
    BASE = require("../base.js"),
    STATE_UNSENT = 0,
    STATE_OPENED = 1,
    STATE_HEADERS_RECEIVED = 2,
    STATE_LOADING = 3,
    STATE_DONE = 4,
    HTTP_REQUEST = LIBCORE.buildInstance(BASE.request),
    BASE_DRIVER = HTTP_REQUEST.constructor;

function Xhr() {
    BASE_DRIVER.apply(this, arguments);
}


LIBCORE.assign(Xhr.prototype = HTTP_REQUEST, {
    
    constructor: Xhr,
    
    driver: void(0),
    
    bindNames: HTTP_REQUEST.bindNames.
                concat([
                    'onReadyStateChange'
                ]),
    
    onReadyStateChange: function (resolve, reject) {
        var driver = this.driver;
        var status;
        
        switch (driver.readyState) {
        case STATE_UNSENT: break;
        case STATE_OPENED: break;
        case STATE_HEADERS_RECEIVED: break;
        case STATE_LOADING: break;
        case STATE_DONE:
            status = driver.status;
            if (status < 200 || status > 399) {
                reject(status);
            }
            else {
                resolve(status);
            }
            
        }
        driver = null;
    },
    
    prepare: function (config) {
        var me = this,
            driver = new (global.XMLHttpRequest)();
        
        // create driver
        console.log(me.url);
        me.driver = driver;
        driver.open(me.method.toUpperCase(), me.url, true);
        driver = null;
        return config;
    },
    
    transport: function () {
        var me = this,
            promise = new Promise(me.onReadyStateChange);
            
        me.driver.send(me.body || null);
        return promise;
    },
    
    process: function (config) {
        return config;
    }
    
    
});

console.log('build ', LIBCORE.buildInstance(BASE.request));

module.exports = Xhr;