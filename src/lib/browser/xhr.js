'use strict';

var LIBCORE = require("libcore"),
    BASE = require("../base.js"),
    BASE_DRIVER = BASE.request,
    HTTP_REQUEST = LIBCORE.buildInstance(BASE_DRIVER);

function Xhr() {
    BASE_DRIVER.apply(this, arguments);
}


LIBCORE.assign(Xhr.prototype = HTTP_REQUEST, {
    
    constructor: Xhr,
    
    driver: void(0),
    
    prepare: function (config) {
        var me = this,
            driver = new (global.XMLHttpRequest)();
        
        // create driver
        me.driver = driver;
        driver.open(me.url, me.method.toUpperCase(), true);
        driver = null;
        
        console.log('prepared!');
        return config;
    },
    
    transport: function (config) {
        console.log('transport!');
        //this.driver.send();
        
        return config;
    },
    
    process: function (config) {
        console.log('processed!');
        return config;
    }
    
    
});

console.log('build ', LIBCORE.buildInstance(BASE.request));

module.exports = Xhr;