'use strict';

var LIBCORE = require("libcore"),
    TRANSFORM = require("./transform.js"),
    METHODS = ["head",
                "options",
                "trace",
                "get",
                "post",
                "put",
                "delete"],
    HEADER_TRANSFORM_TYPE = 'text/http-header',
    DEFAULTS = LIBCORE.createRegistry(),
    instantiate = LIBCORE.instantiate;

function bind(instance, method) {
    function bound() {
        return method.apply(instance, arguments);
    }
    return bound;
}


function HttpBase() {
}

function HttpRequest() {
    var me = this,
        names = me.bindNames,
        l = names.length,
        binder = bind;
    var name;
    // bind for promises
    for (; l--;) {
        name = names[l];
        me[name] = binder(me, me[name]);
    }
    
}

function HttpResponse(request) {
    var me = this;
    
    // connect to request
    request.response = me;
    me.request = request;
    
}

// http baseclass
HttpBase.prototype = {
        
    aborted: false,
    headers: null,
    body: null,
    data: null,
    
    typeSuffix: '',
    bodyOutput: 'body',
    contentType: 'application/octet-stream',
    
    constructor: HttpBase,
    
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
    },
    
    processHeaders: function (headers) {
        var me = this,
            transform = TRANSFORM.transform,
            transformType = HEADER_TRANSFORM_TYPE,
            defaults = transform(transformType, me.headers);
        var contentType;
            
        // create default
        me.headers = defaults;
        
        // apply headers
        headers = transform(transformType, headers);
        if (headers) {
            
            me.headers = defaults ?
                            LIBCORE.assign(defaults, headers) :
                            headers;
        }
        
        // update content type
        contentType = me.header('Content-type', 0);
        if (LIBCORE.string(contentType)) {
            me.contentType = contentType;
        }
        return me;
    },
    
    processBody: function (body) {
        var me = this;
        
        
        if (!me.typeSuffix) {
            console.log('transform: ', body, ' to ',
                        
                (me.header('Content-type', 0) ||
                            'application/octet-stream'));
        }
        
        me[me.bodyOutput] = TRANSFORM.
                                transform(me.contentType + me.typeSuffix,
                                            body);
        
        return me;
    }
    
};

HttpRequest.prototype = instantiate(HttpBase, {
    type: 'base',
    responder: HttpResponse,
    response: null,
    requesting: false,
    
    url: null,
    method: 'get',
    typeSuffix: '-request',
    timeout: 10 * 1000, 
    
    bindNames: ['prepare', 'transport', 'success', 'error'],
    
    constructor: HttpRequest,
    
    request: function (url, config) {
        var CORE = LIBCORE,
            isObject = CORE.object,
            me = this,
            methodList = METHODS,
            assign = CORE.assign;
            
        var item, defaults;
        
        if (isObject(url)) {
            config = url;
            url = config.url;
        }
        
        if (CORE.string(url) && isObject(config)) {
            
            // create config from defaults
            defaults = DEFAULTS.clone();
            
            config = assign(assign({}, defaults), config);
            
            me.url = url;
            
            // add timeout
            item = config.timeout;
            if (CORE.number(item) && item > 100) {
                me.timeout = item;
            }
            
            // process basic http config
            item = config.method;
            
            // override method
            if (methodList.indexOf(item) !== -1) {
                me.method = item;
            }
            
            // override headers
            me.headers = defaults.headers;
            me.processHeaders(config.headers);
            
            // set request data
            me.data = config.data || config.params || config.body || null;
            
            // set default request body
            me.processBody(me.data);
            
            me.requesting = true;
            
            return Promise.resolve(me.operation =  {
                        config: config,
                        resolve: null,
                        reject: null
                    }).
                    then(me.prepare).
                    then(me.transport).
                    then(me.success)
                    ["catch"](me.error);
        }
        
        return Promise.reject("Invalid request configuration");
    },
    
    prepare: function (operation) {
        return operation;
    },
    
    transport: function () {
        return Promise.reject("No transport() implementation.");
    },
    
    /* jshint unused:false */
    process: function (operation) {
        // extra process headers and body here...
    },
    
    success: function (status) {
        var me = this;
        var response = new (me.responder)(me);
        
        delete me.requesting;
        
        // request error when returning false
        if (status !== 0) {
            me.process(me.operation, response, status);
            
            // process response
            response.process();
        }
        
        response.aborted = me.aborted;
        
        me.cleanup();
        
        return response;
    
    },
    
    error: function (error) {
        var me = this,
            aborted = me.aborted;
        
        if (aborted) {
            return me.success(0);
        }
        
        delete me.requesting;
        
        me.cleanup();
        
        return Promise.reject(error);
    },
    
    abort: function () {
        var me = this,
            operation = me.operation;
        
        if (me.requesting && !me.aborted) {
            me.aborted = true;
            
            if (LIBCORE.method(operation.reject)) {
                operation.reject(0);
            }
            operation = null;
        }
        return me;
    },
    
    
    cleanup: function () {
        var me = this,
            operation = me.operation;
        
        if (operation) {
            operation =
                operation.config =
                operation.resolve = 
                operation.reject = null;
        }
        
        return me;
    }
});

HttpResponse.prototype = instantiate(HttpBase, {
    constructor: HttpResponse,
    request: void(0),
    contentType: null,
    
    status: 0,
    statusText: 'Uninitialized',
    bodyOutput: 'data',
    
    process: function () {
    },
    
    to: function (format) {
        return TRANSFORM.transform(format, this.body);
    }
});

module.exports = {
    defaults: DEFAULTS,
    
    request: HttpRequest,
    
    response: HttpResponse
    
};



// set request defaults
DEFAULTS.set('headers', {
    'accept': 'application/json, text/plain, */*;q=0.8',
    'content-type': 'application/json'
});

