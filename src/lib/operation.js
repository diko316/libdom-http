'use strict';

var LIBCORE = require("libcore"),
    LIBDOM = require("libdom"),
    HEADER = require("./header.js"),
    TRANSFORMER = require("./transform.js"),
    CLEANING = false,
    CLEAN_INTERVAL = 1000,
    TTL = 10000,
    RUNNING = false,
    OPERATIONS = [],
    URL_QUERY_STRING_RE = /^([^\?\#]+)(\?[^\?\#]*)?(\#.*)?$/;
    
function applyQueryString(url, queryString) {
    var match = url.match(URL_QUERY_STRING_RE);
    var query;
    
    if (match && LIBCORE.string(queryString)) {
        query = match[2];
        match[2] = (query ? query + '&' : '?') + queryString;
        match[3] = match[3] || '';
        return match.slice(1).join('');
    }
    
    return url;
}



function onCleanup(force) {
    var list = OPERATIONS,
        id = RUNNING;
    var len, operation, now, ttl, created;

    if (!CLEANING) {
        CLEANING = true;
        now = (new Date()).getTime();
        ttl = TTL;
        force = force === true;
        
        for (len = list.length; len--;) {
            operation = list[len];

            if (force) {
                operation.destroy();
                
            }
            else if (!operation.destroyed) {
                created = operation.createdAt;
                
                if (!created || operation.processing) {
                    operation.createdAt = now;
                }
                else if (created + ttl < now) {
                    operation.destroy();
                }
            }
            
            if (operation.destroyed) {
                list.splice(len, 1);
            }
        }
        
        // unset running interval if no operations left
        if (!list.length && id) {
            clearInterval(id);
            RUNNING = false;
        }
        CLEANING = false;
    }
}

function runCleaner(force) {
    var id = RUNNING;
    
    if (force === true) {
        if (id) {
            clearInterval(id);
            RUNNING = false;
        }
        onCleanup(force);
    }
    else if (!id) {
        RUNNING = setInterval(onCleanup, CLEAN_INTERVAL);
    }
}

function destructor() {
    runCleaner(true);
}

function Request() {
    Operation.apply(this, arguments);
}

function Response() {
    Operation.apply(this, arguments);
}


function Operation() {
    var list = OPERATIONS,
        me = this;
    me.destroyed = false;
    list[list.length] = me;
    runCleaner();
}

Operation.prototype = {
    
    createdAt: void(0),
    contentType: 'application/octet-stream',
    headers: null,
    body: null,
    data: null,
    destroyed: true,
    processing: false,
    constructor: Operation,
    
    begin: function () {
        var me = this;
        if (!me.destroyed && !me.processing) {
            me.processing = true;
            delete me.createdAt;
            runCleaner();
        }
        return me;
    },
    
    end: function () {
        var me = this;
        if (!me.destroyed && me.processing) {
            delete me.processing;
            delete me.createdAt;
            runCleaner();
        }
        return me;
    },
    
    addHeaders: function (headers) {
        var me = this,
            CORE = LIBCORE;
        var current, contentType;
            
        headers = HEADER.parse(headers);
        
        if (headers) {
            current = me.headers;
            if (CORE.object(current)) {
                CORE.assign(current, headers);
            }
            else {
                me.headers = headers;
            }
            
            // apply content type from headers
            contentType = me.header('content-type');
            if (contentType) {
                me.contentType = contentType;
            }
            else {
                delete me.contenType;
            }
            
        }
        
        return this;
    },
    
    header: function (name) {
        var me = this,
            current = me.headers,
            CORE = LIBCORE;
        
        if (CORE.string(name) && CORE.object(current)) {
            name = HEADER.headerName(name);
            
            if (CORE.contains(current, name)) {
                return current[name];
            }
            
        }
        
        return null;
    },
    
    destroy: function () {
        var me = this;
        if (!me.destroyed) {
            me.destroyed = true;
            LIBCORE.clear(me);
        }
        return me;
    }
};


Request.prototype = LIBCORE.instantiate(Operation, {
    url: null,
    method: 'get',
    constructor: Request,
    response: null,
    aborted: false,
    timeout: 0,
    config: null,
    queryTransformer: 'application/x-www-form-urlencoded',
    queryAllowed: true,
    allowedPayload: true,
    
    getUrl: function () {
        var me = this,
            isString = LIBCORE.string,
            transform = TRANSFORMER.transform,
            url = me.url,
            query = me.query,
            data = me.data,
            transformerType = me.queryTransformer,
            apply = applyQueryString;
            
        
        if (me.queryAllowed && isString(url) && isString(transformerType)) {
            // transform url
            query = transform(transformerType, false, query)[1];
            if (isString(query)) {
                url = apply(url, query);
            }
            
            // should include body as query string
            if (me.allowedPayload === false) {
                data = transform(transformerType, false, data)[1];
                
                if (isString(data)) {
                    url = apply(url, data);
                }
            }
        }
        return url;
    },
    
    settings: function (name) {
        var config = this.config,
            CORE = LIBCORE;
            
        if (CORE.object(config) && CORE.contains(config, name)) {
            return config[name];
        }
        return void(0);
    },
    
    process: function () {
        var me = this,
            result = TRANSFORMER.transform(me.header('content-type'),
                                        false,
                                        me.data),
            headers = result[0],
            responseType = me.responseType,
            response = me.response;
        
        // data will be parsed to create body based on the content type
        if (headers) {
            me.addHeaders(headers);
        }
        
        if (me.allowedPayload === false) {
            delete me.body;
        }
        else {
            me.body = result[1];
        }
        
        // create response
        if (response) {
            response.destroy();
        }
        
        me.response = response = new Response();
        
        // use response type as resonse contentType
        if (LIBCORE.string(responseType)) {
            response.addHeaders('Content-type: ' + responseType);
        }
        response.request = me;
        response.begin();
        
        result = null;
    }
});

Response.prototype = LIBCORE.instantiate(Operation, {
    constructor: Response,
    status: 0,
    statusText: 'Uninitialized',
    process: function () {
        var me = this,
            result = TRANSFORMER.transform(me.header('content-type'),
                                        true,
                                        me.body),
            headers = result[0];
        
        // body will be parsed to create data based on the content type
        if (headers) {
            me.addHeaders(headers);
        }

        me.data = result[1];
        
    }
});


LIBDOM.destructor(destructor);

module.exports = Request;