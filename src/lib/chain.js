'use strict';

var MAIN_MODULE;

export
    function use(mainModule) {
        MAIN_MODULE = mainModule;
    }
    
export
    function get() {
        return MAIN_MODULE;
    }