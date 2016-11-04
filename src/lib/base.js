'use strict';

var LIBCORE = require("libcore"),
    TRANSFORM = require("./transform.js"),
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
    console.log('bound all methods');
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
    headers: null,
    body: null,
    data: null,
    constructor: HttpRequest,
    
    request: function (url, config) {
        var CORE = LIBCORE,
            isObject = CORE.object,
            me = this,
            methodList = METHODS,
            transformer = TRANSFORM;
        var item;
        
        if (isObject(url)) {
            config = url;
            url = config.url;
        }
        
        if (CORE.string(url) && isObject(config)) {
            config.url = me.url;
            
            // process basic http config
            item = config.method;
            
            // override method
            if (methodList.indexOf(item) !== -1) {
                me.method = item;
            }
            
            // override headers
            item = transformer.transform('text/http-header', config.headers);
            
            if (item) {
                me.headers = item;
            }
            else if (!isObject(me.headers)) {
                me.headers = null;
            }
            
            // set request data
            item = config.data || config.params || config.body;
            
            if (isObject(item)) {
                me.data = item;
            }
            
            // set default request body
            item = me.data || me.body;
            
            if (item) {
                me.body = transformer.transform(
                                (me.header('Content-type', 0) ||
                                    'application/octet-stream') + '-request',
                                item);
            }
            console.log('me: ', me.error);
            return Promise.resolve(config).
                    then(me.prepare).
                    then(me.send).
                    then(me.process)
                    ["catch"](me.error);
        }
        
        return Promise.reject("Invalid request configuration");
    },
    
    prepare: function (data) {
        console.log('bunga! ', this);
        return data;
    },
    
    transport: function () {
        return Promise.reject("No transport() implementation.");
    },
    
    process: function (data) {
        return data;
    },
    
    success: function (flag) {
        var me = this,
            aborted = me.aborted;
        
        // request error when returning false
        if (flag === false) {
            if (!me.status) {
                me.status = 400;
                me.statusText = "Bad Request";
            }
            return me.error(me.statusText);
        }
        
        if (!aborted) {
            new (me.responder)(me);
        }
        
        me.cleanup(aborted);
        
        return me;
    
    },
    
    error: function (error) {
        var me = this;
        console.log('me!!! ', me);
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
    
    header: function (name, index) {
        var CORE = LIBCORE,
            headers = this.headers;
        var found;
        
        if (CORE.object(headers) && CORE.string(name)) {
            name = name.charAt(0).toUpperCase() +
                    name.substring(1, name.length).toLowerCase();
            if (CORE.contains(headers, name)) {
                found = headers[name];
                
                if (!CORE.number(index)) {
                    return found;
                    
                }
                
                return index in found ?
                            found[index] :
                            found[found.length - 1];
                
            }
        }
        
        return void(0);
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