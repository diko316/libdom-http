'use strict';

var LIBCORE = require("libcore"),
    BASE = require("../base.js"),
    HTTP_REQUEST = LIBCORE.buildInstance(BASE.request);

function Xhr() {
    
}


LIBCORE.assign(Xhr.prototype = HTTP_REQUEST, {
    driver: void(0),
    
    prepare: function (config) {
        var me = this,
            driver = new (global.XMLHttpRequest)();
        
        // create driver
        me.driver = driver;
        driver.open(me.url, me.method.toUpperCase(), true);
        driver = null;
        return config;
    },
    
    transport: function (config) {
        
        //this.driver.send();
        
        return config;
    },
    
    process: function (config) {
        return config;
    }
    
    
});

console.log('build ', LIBCORE.buildInstance(BASE.request));

module.exports = Xhr;