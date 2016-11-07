'use strict';

var LIBCORE = require("libcore"),
    LIBDOM = require("libdom"),
    HEADER = require("./header.js"),
    TRANSFORMER = require("./transform.js"),
    CLEANING = false,
    CLEAN_INTERVAL = 1000,
    TTL = 10000,
    RUNNING = false,
    OPERATIONS = [];

function onCleanup(force) {
    var list = OPERATIONS,
        id = RUNNING;
    var len, operation, now, ttl;

    if (!CLEANING) {
        CLEANING = true;
        now = (new Date()).getTime();
        ttl = TTL;
        force = force === true;
        
        for (len = list.length; len--;) {
            operation = list[len];
            
            if (!operation.destroyed &&
                (force || operation.createdAt + ttl < now)) {
                
                operation.destroy();
                
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

function cleanup(force) {
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
    cleanup(true);
}

function Request() {
    Operation.apply(this, arguments);
}

function Operation() {
    var list = OPERATIONS,
        me = this;
    me.destroyed = false;
    me.using();
    list[list.length] = me;
    cleanup();
}

Operation.prototype = {
    
    createdAt: void(0),
    contentType: 'application/octet-stream',
    headers: null,
    body: null,
    data: null,
    destroyed: true,
    constructor: Operation,
    
    using: function () {
        this.createdAt = (new Date()).getTime();
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
        
        me.using();
        
        return this;
    },
    
    header: function (name) {
        var me = this,
            current = me.headers,
            CORE = LIBCORE;
            
        me.using();
        
        if (CORE.string(name) && CORE.object(current)) {
            name = HEADER.headerName(name);
            
            if (CORE.contains(current, name)) {
                return current[name];
            }
            
        }
        
        return null;
    },
    
    process: function () {
        var me = this,
            result = TRANSFORMER.transform(me.header('content-type'),
                                        false,
                                        me.data),
            headers = result[0];
        
        me.using();
        
        // data will be parsed to create body based on the content type
        if (headers) {
            me.addHeaders(headers);
        }
        
        me.body = result[1];
    },
    
    destroy: function () {
        LIBCORE.clear(this);
    }
};


Request.prototype = LIBCORE.instantiate(Operation, {
    url: null,
    method: 'get',
    constructor: Request
});

Request.Operation = Operation;

LIBDOM.destructor(destructor);

module.exports = Request;