'use strict';

var LIBCORE = require("libcore"),
    LIBDOM = require("libdom"),
    DETECT = require("../detect.js"),
    MIDDLEWARE = LIBCORE.middleware("libdom-http.driver.xhr"),
    register = MIDDLEWARE.register,
    BEFORE_REQUEST = "before:request",
    XHR = require("./xhr.js"),
    PROTOTYPE = XHR.prototype,
    BINDS = PROTOTYPE.bindMethods,
    BIND_LENGTH = BINDS.length,
    PROGRESS = DETECT.xhrbytes,
    features = 0;

// timeout
function addTimeout(instance, request) {
    var timeout = request.settings('timeout');
    
    if (LIBCORE.number(timeout) && timeout > 10) {
        request.xhrTransport.timeout = timeout;
    }
}

// withCredentials
function addWithCredentials(instance, request) {

    if (request.settings('withCredentials') === true) {
        request.xhrTransport.withCredentials = true;
    }
}

// Progress
function onProgress(event) {
    /* jshint validthis: true */
    var instance = this,
        request = instance.request;
    
    if (request && event.lengthComputable) {
        request.percentLoaded =
            instance.api.percentLoaded = event.loaded / event.total;
    }

}

function addProgressEvent(instance, request) {
    var api = request.api;
    
    api.percentLoaded = 0;
    
    if (request) {
        request.percentLoaded = 0;
    }
    
    LIBDOM.on(request.xhrTransport, 'progress', instance.onProgress);
}

// cleanup
function cleanup(instance, request) {
    if (PROGRESS) {
        LIBDOM.un(request.xhrTransport, 'progress', instance.onProgress);
    }
}



// apply middlewares according to capability of the platform
if (DETECT.xhrx) {
    features++;
    register(BEFORE_REQUEST, addWithCredentials);
}

// progress
if (PROGRESS) {
    features++;
    BINDS[BIND_LENGTH++] = 'onProgress';
    PROTOTYPE.onProgress = onProgress;
    register(BEFORE_REQUEST, addProgressEvent);
}

if (DETECT.xhrtime) {
    register(BEFORE_REQUEST, addTimeout);
}

// cleanup
if (features) {
    if (features > 2) {
        PROTOTYPE.level = 2;
    }
    register("cleanup", cleanup);
}


module.exports = XHR;