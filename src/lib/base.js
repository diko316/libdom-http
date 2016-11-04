'use strict';

var LIBCORE = require("libcore"),
    HEADERS = require("./header.js"),
    METHODS = ["head",
                "options",
                "trace",
                "get",
                "post",
                "put",
                "delete"];

function bind(instance, method) {
    function bound() {
        return method.apply(instance, arguments);
    }
    return bound;
}

function HttpRequest() {
    var me = this,
        binder = bind;
    
    // bind for promises
    me.prepare = binder(me, me.prepare);
    me.transport = binder(me, me.transport);
    me.process = binder(me, me.process);
    me.success = binder(me, me.success);
    me.error = binder(me, me.error);
}

function HttpResponse(request) {
    var me = this;
    
    // connect to request
    request.response = me;
    me.request = request;
    
    // post process only if not aborted
    if (!request.aborted) {
        me.process(request);
    }
}


HttpRequest.prototype = {
    type: 'base',
    responder: HttpResponse,
    response: null,
    aborted: false,
    requesting: false,
    status: 0,
    statusText: 'Uninitialized',
    url: null,
    method: 'get',
    headers: void(0),
    body: void(0),
    constructor: HttpRequest,
    
    request: function (url, config) {
        var CORE = LIBCORE,
            me = this,
            methodList = METHODS;
        var item;
        
        if (CORE.object(url)) {
            config = url;
            url = config.url;
        }
        
        if (CORE.string(url) && CORE.object(config)) {
            config.url = me.url;
            
            // process basic http config
            item = config.method;
            
            // override method
            if (methodList.indexOf(item) !== -1) {
                me.method = item;
            }
            
            // override headers
            item = HEADERS.parse(config.headers);
            
            if (CORE.array(item)) {
                me.headers = item;
            }
            
            return Promise.resolve(config).
                    then(me.prepare).
                    then(me.send).
                    then(me.process)
                    ["catch"](me.error);
        }
        
        return Promise.reject("Invalid request configuration");
    },
    
    prepare: function () {
        return Promise.reject("No prepare() implementation.");
    },
    
    transport: function () {
        return Promise.reject("No send() implementation.");
    },
    
    process: function () {
        return Promise.reject("No process() implemenation.");
    },
    
    success: function (flag) {
        var me = this;
        
        // request error when returning false
        if (flag === false) {
            if (!me.status) {
                me.status = 400;
                me.statusText = "Bad Request";
            }
            return me.error(me.statusText);
        }
        
        me.cleanup(me.aborted);
        
        new (me.responder)(me);
        
        return me;
    
    },
    
    error: function (error) {
        var me = this;
        
        if (me.aborted) {
            return me.success();
        }
        
        return Promise.reject(error);
    },
    
    abort: function () {
        var me = this;
        
        if (me.requesting && !me.aborted) {
            me.aborted = true;
            
        }
        return me;
    },
    
    /* jshint unused:false */
    cleanup: function (aborted) {
        
        return this;
    },
    
    eachHeader: function (name, value) {
        
    }
};

HttpResponse.prototype = {
    constructor: HttpResponse,
    request: void(0),
    headers: void(0),
    body: void(0),
    contentType: null,
    data: null,
    
    /* jshint unused:false */
    process: function (request) {
    },
    
    /* jshint unused:false */
    to: function (format) {
    }
};


module.exports = {
    request: HttpRequest,
    response: HttpResponse
};