(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('libcore'), require('libdom')) :
	typeof define === 'function' && define.amd ? define(['exports', 'libcore', 'libdom'], factory) :
	(factory((global['libdom-http'] = {}),global.libcore,global.libdom));
}(this, (function (exports,libcore,DOM) { 'use strict';

var DOM__default = 'default' in DOM ? DOM['default'] : DOM;

var MAIN_MODULE;

function use(mainModule) {
        MAIN_MODULE = mainModule;
    }
    
function get() {
        return MAIN_MODULE;
    }

var global$1 = typeof global !== "undefined" ? global :
            typeof self !== "undefined" ? self :
            typeof window !== "undefined" ? window : {};

var ENV = DOM__default.env;
var G = global$1;
var XHR = G.XMLHttpRequest;
var support_xhr = !!XHR;
var support_xhrx = false;
var support_xhrmime = false;
var support_xhrtime = false;
var support_xhrbin = false;
var support_xhrprogress = false;
var support_xdr = !!G.XDomainRequest;

if (ENV) {
    if (ENV.browser) {
        if (XHR) {
            XHR = XHR.prototype;
            support_xhrx = 'withCredentials' in XHR;
            support_xhrmime = 'overrideMimeType' in XHR;
            support_xhrtime = 'timeout' in XHR;
            support_xhrbin = 'sendAsBinary' in XHR;
            support_xhrprogress = 'onprogress' in XHR;
        }
        
    }
    else if (ENV.node) {
        
    }
}

var DETECT = {
        xhr: support_xhr,
        xhrx: support_xhrx,
        xhrmime: support_xhrmime,
        xhrtime: support_xhrtime,
        xhrbin: support_xhrbin,
        xhrbytes: support_xhrprogress,
        xdr: support_xdr,
        formdata: !!G.FormData,
        file: !!G.File,
        blob: !!G.Blob
    };

G = XHR = null;

var DRIVERS = libcore.createRegistry();
var DEFAULT = null;
var exported = {
        register: register,
        exists: exists,
        use: use$1,
        get: get$1
    };
    
/**
 * driver management
 */
function register(name, Class) {
            
        if (libcore.string(name) && libcore.method(Class)) {
            DRIVERS.set(name, Class);
            Class.prototype.type = name;
            
            if (!DEFAULT) {
                DEFAULT = name;
            }
        }
        
        return get();
    }
function exists(name) {
        return DRIVERS.exists(name);
    }

function use$1(name) {
        if (arguments.length > 0 && exists(name)) {
            DEFAULT = name;
        }
        return DEFAULT;
    }

/**
 * driver process
 */
function get$1(type) {
        return DRIVERS.get(type);
    }

var MIME_TYPE_RE =
        /^([a-z0-9\-\_]+)\/([a-z\-\_0-9]+)(([ \s\t]*\;([^\;]+))*)$/;
var MIME_TYPE_PARAMS_RE =
        /^[ \t\s]*([a-z0-9\-\_]+)\=(\"([^\"]+)\"|[a-z0-9\-\_]+)[ \t\s]*$/;
var QUOTED_RE = /^\"[^\"]+\"/;


    function parseType(type) {
        var mtypeRe = MIME_TYPE_RE,
            paramRe = MIME_TYPE_PARAMS_RE,
            quotedRe = QUOTED_RE,
            paramGlue = "; ",
            parameterObject = null;
            
        var match, subtype, parameters, name, value, l, defaultType;
        
        if (libcore.string(type) && mtypeRe.test(type)) {
            match = type.match(mtypeRe);
            type = match[1].toLowerCase();
            subtype = match[2].toLowerCase();
            parameters = match[3] || '';
            
            if (parameters) {
                parameterObject = {};
                parameters = parameters.split(';');
                l = parameters.length;
                
                for (; l--;) {
                    match = parameters[l].match(paramRe);
                    if (match) {
                        name = match[1].toLowerCase();
                        value = match[2];
                        
                        // create parameters string
                        parameters[l] = name + '=' + value;
                        
                        // register
                        parameterObject[name] = quotedRe.test(value) ?
                                                    value.substring(1,
                                                                value.length -1) :
                                                    value;
                        
                    }
                }
                parameters = parameters.join(paramGlue);
            }
            
            defaultType = type + '/' + subtype;
            
            return {
                string: defaultType +
                        (parameters ?
                            paramGlue + parameters : ''),
                root: defaultType,
                type: type,
                subtype: subtype,
                params: parameterObject
            };
        }
        
        return void(0);
    }

var TYPE_OBJECT = 1;
var TYPE_ARRAY = 2;



function isForm(form) {
    return DOM.is(form, 1) && form.tagName.toUpperCase() === 'FORM';
}

function isField(field) {
    if (DOM.is(field, 1)) {
        switch (field.tagName.toUpperCase()) {
        case 'INPUT':
        case 'TEXTAREA':
        case 'BUTTON':
        case 'SELECT':
        case 'OUTPUT': return true;
        }
    }
    return false;
}

function onEachObjectValueProperty(value, name) {
    /* jshint validthis: true */
    var context = this;
    
    eachField(value,
              name,
              context[1],
              context[0]);
}

function eachValues(values, callback, operation) {
    var typeObject = TYPE_OBJECT,
        typeArray = TYPE_ARRAY,
        type = null,
        each$$1 = eachField,
        isObject = libcore.object,
        isObjectValue = isObject(values);
        
    var c, l;
    
    if (isForm(values)) {
        values = values.elements;
        type = typeArray;
        isObjectValue = false;
    }
    else if (isField(values)) {
        type = typeArray;
        values = [values];
    }
    else if (isObjectValue) {
        type = typeObject;
    }
    else if (libcore.array(values)) {
        type = typeArray;
        isObjectValue = false;
    }
    
    if (!isObject(operation)) {
        operation = {};
    }
    
    if (!libcore.contains(operation, 'returnValue')) {
        operation.returnValue = null;
    }
    
    if (isObjectValue || type === typeArray) {
        if (isObjectValue) {
            libcore.each(values,
                         onEachObjectValueProperty,
                         [operation, callback],
                         true);
        }
        else {
            for (c = -1, l = values.length; l--;) {
                each$$1(values[++c], null, callback, operation);
            }
        }
    }
    
    return operation.returnValue;
}

function eachField(field, name, callback, operation) {
    var isString = libcore.string,
        hasName = isString(name),
        fieldType = 'variant';
    var type, c, l, list, option;
    
    if (isField(field)) {
        if (!hasName && !isString(name = field.name)) {
            return;
        }
        type = 'field';
        hasName = true;
        fieldType = field.type;
        
        // field exception by tagname
        switch (field.tagName.toUpperCase()) {
        case "BUTTON":
            if (!isString(fieldType)) {
                fieldType = "button";
            }
            break;

        case "SELECT":
            type = 'field-options';
            fieldType = 'select';
            list = field.options;
            for (c = -1, l = list.length; l--;) {
                option = list[++c];
                // run callback
                if (option.selected) {
                    callback(operation,
                            name,
                            option.value,
                            type,
                            fieldType);
                }
            }
            list = option = null;
            return;
        
        case "TEXTAREA":
            fieldType = "text";
            break;
        }
        
        // field exception by type
        switch (fieldType) {
        case "checkbox":
        case "radio":
            if (!field.checked) {
                return;
            }
        }
        
    }
    else {
        switch (true) {
        case libcore.array(field):
            type = 'array';
            break;
        case libcore.date(field):
            type = 'date';
            break;
        default:
            type = typeof field;
        }
    }
    
    if (hasName) {
        callback(operation, name, field, type, fieldType);
    }
}

function jsonify(raw) {
        var json = global$1.JSON,
            data = null;
            
        if (!json) {
            throw new Error("JSON is not supported in this platform");
        }
        try {
            data = json.stringify(raw);
        }
        catch (e) {}
        return data === 'null' || data === null ? '' : data;
    }

function createValue(operation, name, value, type, fieldType) {
    var items = operation.returnValue,
        isField$$1 = type === "field";
    
    if (isField$$1) {
        // i can't support file upload
        if (fieldType === "file") {
            return;
        }
        value = value.value;
    }
    
    if (value === 'number') {
        value = isFinite(value) ? value.toString(10) : '';
    }
    else if (!libcore.string(value)) {
        value = jsonify(value);
    }
    
    // this type of encoding is only available in form fields
    if ((isField$$1 || type === 'field-options')) {
        
        // use libcore to fill-in json
        libcore.jsonFill(items, name, value);
        
    }
    else {
        
        items[name] = value;
        
    }
    items = value = null;

}

function convert(data) {
    var operation = {
            index: {},
            returnValue: {}
        },
        body = eachValues(data, createValue, operation);
    
    return [null, jsonify(body)];
}

var json = global$1.JSON;

if (!json) {
    json = false;
}


function convert$1(data) {
    
    if (!json) {
        throw new Error("JSON is not supported in this platform");
    }
    else if (!libcore.string(data)) {
        return null;
    }
    
    try {
        data = json.parse(data);
    }
    catch (e) {
        return null;
    }
    
    return [null, data];
}

function createValue$1(operation, name, value, type, fieldType) {
    var items = operation.returnValue;
    
    if (type === 'field') {
        // i can't support file upload
        if (fieldType === "file") {
            return;
        }
        value = value.value;
    }
    
    if (typeof value === 'number') {
        value = isFinite(value) ? value.toString(10) : '';
    }
    else if (typeof value !== 'string') {
        value = jsonify(value);
    }
    
    // encode
    items[items.length] = name + '=' + encodeURIComponent(value);
}


function convert$2(data) {
    var body = eachValues(data, createValue$1, {
                    returnValue: []
                });
    
    return [null, body.join('&')];
}

var EOL = "\r\n";
var BOUNDARY_LENGTH = 48;

function createBoundary() {
    var ender = Math.random().toString().substr(2),
        output = [],
        len = 0,
        total = BOUNDARY_LENGTH - ender.length;
    
    for (; total--;) {
        output[len++] = '-';
    }
    output[len++] = ender;
    return output.join('');
}

function createValue$2(operation, name, value, type, fieldType) {
    var eol = EOL,
        items = operation.returnValue;
    
    if (type === 'field') {
        // i can't support file upload
        if (fieldType === "file") {
            return;
        }
        value = value.value;
    }
    
    if (typeof value === 'number') {
        value = isFinite(value) ? value.toString(10) : '';
    }
    else if (typeof value !== 'string') {
        value = jsonify(value);
    }
    
    // encode
    items[items.length] = ([
                'Content-Disposition: form-data; name="' + name + '"',
                'Content-type: application/octet-stream',
                eol,
                value
            ]).join(eol);
    
}

function convert$3(data) {
    var eol = EOL,
        boundary = createBoundary(),
        body = eachValues(data,
                    createValue$2, {
                        returnValue: []
                    });
    // start boundary
    if (!body.length) {
        body.splice(0, 0, boundary);
    }
    
    
    return [
        // create header
        ([
            'Content-Type: multipart/form-data; charset=utf-8;',
            '    boundary=' + boundary
        ]).join(eol),
        
        // start boundary
        boundary + eol +
        
        body.join(eol + boundary + eol) +
        
        // end boundary
        boundary + '--' + eol
    ];
    
}

var TRANSFORMERS = libcore.createRegistry();
var REQUEST_PREFIX = 'request-';
var RESPONSE_PREFIX = 'response-';
var exported$2 = {
        register: register$1,
        transform: transform
    };

function register$1(type, response, handler) {
        var transformers = TRANSFORMERS,
            responsePrefix = RESPONSE_PREFIX;
        var finalType, current, all;
        
        if (libcore.method(handler)) {
            type = parseType(type);
            if (type) {
                all = response === 'all';
                response = response === true ? REQUEST_PREFIX : responsePrefix;
                
                finalType = response + type.root;
                current = response + type.string;
                
                // register root
                if (current !== finalType && !transformers.exists(finalType)) {
                    transformers.set(finalType, handler);
                }
                
                transformers.set(current, handler);
                
                // include response
                if (all) {
                    transformers.set(responsePrefix + type.string, handler);
                }
                
            }
        }
        return get();
    }

function transform(type, response, data) {
        var transformers = TRANSFORMERS;
        var finalType;
        
        type = parseType(type);
        
        if (type) {
            response = response === true ? REQUEST_PREFIX : RESPONSE_PREFIX;
            
            
            finalType = response + type.string;
            if (transformers.exists(finalType)) {
                return transformers.get(finalType)(data);
            }
            
            // try root
            finalType = response + type.root;
            if (transformers.exists(finalType)) {
                data = transformers.get(finalType)(data);
                return libcore.array(data) ? data : [null, null];
            }
            
        }
        
        return [null, data];
    }

/**
 * add default transformers
 */

register$1('application/json', false, convert);
    register$1('text/x-json', false, convert);
    
// response json
register$1('application/json', true, convert$1);
register$1('text/x-json', true, convert$1);


// old school requests
register$1('application/x-www-form-urlencoded',
        false,
        convert$2);

register$1('multipart/form-data',
    false,
    convert$3);

function bind(instance, method$$1) {
    function bound() {
        return method$$1.apply(instance, arguments);
    }
    return bound;
}

function Driver() {
    var me = this,
        list = this.bindMethods,
        len = list.length,
        bindMethod = bind;
    var name;
    for (; len--;) {
        name = list[len];
        me[name] = bindMethod(me, me[name]);
    }
}

Driver.prototype = {
    bindMethods: [
        'setup',
        'transport',
        'process',
        'success',
        'error'
    ],
    aborted: false,
    request: null,
    response: null,
    
    constructor: Driver,
    
    /* jshint unused:false */
    onSetup: function (request) {
        
    },
    
    /* jshint unused:false */
    onTransport: function (request) {
        
    },
    
    onCleanup: function (request) {
        
    },
    
    onSuccess: function (request, status) {
        
    },
    
    onError: function (status) {
        
        
    },
    
    setup: function (request) {
        var me = this;
        me.request = request;
        me.onSetup(request);
        request.process();
        me.response = request.response;
        return request;
    },
    
    /* jshint unused:false */
    transport: function (request) {
        var transportPromise;
        
        this.onTransport(request);
        
        // it's a promise! :-)
        transportPromise = request.transportPromise;
        if (transportPromise &&
            libcore.method(transportPromise.then)) {
            
            request.begin();
            
            return transportPromise;
        }
        
        return Promise.reject(610);
    },
    
    /* jshint unused:false */
    success: function (status) {
        var me = this,
            request = me.request,
            response = request && request.response;
        
        // aborted request or errors
        if (status === 0 ||
            (status < 200 && status > 299) ||
            !request || !response) {
            
            return me.error(status);
        }
        
        // process response
        me.onSuccess(request, status);
        response.process();
        
        // end request and response
        request.end();
        response.end();
        
        request.transportPromise = null;
        me.onCleanup(request, response);
        
        delete me.request;
        
        return response;
        
    },
    
    error: function (status) {
        var me = this,
            request = me.request,
            response = request && request.response;
        
        me.onError(status);
        
        // process response
        if (request) {
            request.transportPromise = null;
            
            me.onCleanup(request);
            request.end();
        }
        
        // end response
        if (response) {
            response.end();
        }
        
        delete me.request;
        return Promise.reject(status);
    },
    
    abort: function () {
        //var me = this,
        //    request = me.request;
        //
        //if (!me.aborted) {   
        //    me.aborted = true;
        //    
        //    if (request && LIBCORE.method(request.resolve)) {
        //        request.resolve(0);
        //    }
        //}
    }
};

var MIDDLEWARE = libcore.middleware("libdom-http.driver.xhr");
var STATE_UNSENT = 0;
var STATE_OPENED = 1;
var STATE_HEADERS_RECEIVED = 2;
var STATE_LOADING = 3;
var STATE_DONE = 4;
var BASE_PROTOTYPE = Driver.prototype;


function applyHeader(value, name) {
    /* jshint validthis:true */
    var me = this;
    var c, l;
    if (!libcore.array(value)) {
        value = [value];
    }
    for (c = -1, l = value.length; l--;) {
        me.setRequestHeader(name, value[++c]);
    }
}


function Xhr() {
    var me = this,
        args = [me];
    Driver.apply(me, arguments);
    
    MIDDLEWARE.run("after:instantiated", args);
    
    args = args[0] = null;
}


Xhr.prototype = libcore.instantiate(Driver, {
    level: 1,
    bindMethods: BASE_PROTOTYPE.bindMethods.concat([
                    'onReadyStateChange'
                ]),
    
    constructor: Xhr,
    
    onReadyStateChange: function () {
        var me = this,
            request = me.request,
            xhr = request.xhrTransport,
            run$$1 = MIDDLEWARE.run,
            args = [me, request],
            resolve = request.resolve,
            reject = request.reject;
        var status;
        
        if (!request.aborted && resolve && reject) {
            
            run$$1("before:readystatechange", args);
            
            switch (xhr.readyState) {
            case STATE_UNSENT:
            case STATE_OPENED:
            case STATE_HEADERS_RECEIVED: 
            case STATE_LOADING: break;
            case STATE_DONE:
                status = xhr.status;
                if (status < 200 || status > 299) {
                    reject(status);
                }
                else {
                    resolve(status);
                }
            }
            run$$1("after:statechange", args);
        }
        me = xhr = request = args = args[0] = args[1] = null;
    },
    
    createTransportPromise: function(request) {
        function bind(resolve, reject) {
            var local = request;
            local.resolve = resolve;
            local.reject = reject;
            local = null;
        }
        return new Promise(bind);
    },
    
    onSetup: function (request) {
        var me = this,
            args = [me, request],
            run$$1 = MIDDLEWARE.run,
            xhr = new (global$1.XMLHttpRequest)();
            
        
        request.xhrTransport = xhr;
        
        run$$1("before:setup", args);
        
        xhr.onreadystatechange = me.onReadyStateChange;
        xhr.open(request.method.toUpperCase(), request.getUrl(), true);
        
        
        run$$1("after:setup", args);
        
        xhr = args = args[0] = args[1] = null;
        
    },
    
    onTransport: function (request) {
        var me = this,
            xhr = request.xhrTransport,
            headers = request.headers,
            args = [me, request];
       
        MIDDLEWARE.run("before:request", args);
       
        request.transportPromise = me.createTransportPromise(request);
        
        
        
        // apply headers
        headers = request.headers;
        if (libcore.object(headers)) {
            libcore.each(headers, applyHeader, xhr);
        }
        
        xhr.send(request.body);
        
        MIDDLEWARE.run("after:request", args);
        
        
        xhr = args = args[0] = args[1] = null;
        
        
    },
    
    // process success
    onSuccess: function (request) {
        var me = this,
            xhr = request.xhrTransport,
            response = request.response,
            args = [me, request],
            run$$1 = MIDDLEWARE.run;
        
        response.status = xhr.status;
        response.statusText = xhr.statusText;
        response.addHeaders(xhr.getAllResponseHeaders());
        response.body = xhr.responseText;
        
        run$$1("after:response", args);
        
        xhr = args = args[0] = args[1] = null;
        
    },
    
    onCleanup: function (request) {
        var me = this,
            xhr = request.xhrTransport;
        var args;
        
        if (xhr) {
            args = [me, request];
            MIDDLEWARE.run("after:cleanup", args);
            args = args[0] = args[1] = 
                    xhr = xhr.onreadystatechange = null;
        }
        
        request.transportPromise = 
            request.resolve =
            request.reject = 
            request.xhrTransport = xhr = null;
    }

});

var MIDDLEWARE$1 = libcore.middleware("libdom-http.driver.xhr");
var register$2 = MIDDLEWARE$1.register;
var BEFORE_REQUEST = "before:request";
var PROTOTYPE = Xhr.prototype;
var BINDS = PROTOTYPE.bindMethods;
var BIND_LENGTH = BINDS.length;
var PROGRESS = DETECT.xhrbytes;
var features = 0;

// timeout
function addTimeout(instance, request) {
    var timeout = request.settings('timeout');
    
    if (libcore.number(timeout) && timeout > 10) {
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
        request = instance.request,
        api = request.api;
    var loaded;
    
    if (request && event.lengthComputable) {
        loaded = event.loaded / event.total;
        
        request.percentLoaded = loaded;
        if (api) {
            api.percentLoaded = loaded;
        }
    }

}

function addProgressEvent(instance, request) {
    var api = request.api;
    
    api.percentLoaded = 0;
    
    if (request) {
        request.percentLoaded = 0;
    }
    
    DOM.on(request.xhrTransport, 'progress', instance.onProgress);
}

// cleanup
function cleanup(instance, request) {
    if (PROGRESS) {
        DOM.un(request.xhrTransport, 'progress', instance.onProgress);
    }
}


function processFormData(instance, request) {

    // remove content type and use FormData defaults
    if (request.body instanceof global$1.FormData) {
        delete request.headers['Content-type'];
    }

}



// apply middlewares according to capability of the platform
if (DETECT.xhrx) {
    features++;
    register$2(BEFORE_REQUEST, addWithCredentials);
}

// form data fixes
if (DETECT.formdata) {
    features++;
    register$2(BEFORE_REQUEST, processFormData);
}

// progress
if (PROGRESS) {
    features++;
    BINDS[BIND_LENGTH++] = 'onProgress';
    PROTOTYPE.onProgress = onProgress;
    register$2(BEFORE_REQUEST, addProgressEvent);
}

// timeout
if (DETECT.xhrtime) {
    register$2(BEFORE_REQUEST, addTimeout);
}



// cleanup
if (features) {
    if (features > 2) {
        PROTOTYPE.level = 2;
    }
    register$2("cleanup", cleanup);
}

var BASE_PROTOTYPE$1 = Driver.prototype;
var RESPONSE_TRIM = /(^<pre>|<\/pre>$)/ig;
var FILE_UPLOAD_GEN = 0;

function createForm(method$$1, url, contentType, blankDocument) {
    var doc = global$1.document,
        id = 'libdom-http-oldschool-form' + (++FILE_UPLOAD_GEN),
        div = doc.createElement('div');
    var iframe;
        
    div.style.cssText = ([
            "visibility: hidden",
            "position: fixed",
            "top: -10px",
            "left: -10px",
            "overflow: hidden",
            "height: 1px",
            "width: 1px"
        ]).join(";");
    
    div.innerHTML = ([
            '<form id="', id ,'"',
                ' method="', method$$1.toUpperCase(),'"',
                ' action="', encodeURI(url),'"',
                ' target="', id,'-result"',
                ' enctype="', contentType, '"',
                ' encoding="', contentType,'"',
                ' data-readystate="uninitialized">',
                '<iframe name="', id,'-result"',
                    ' id="', id, '-result">',
                    ' src="' + blankDocument + '">',
                '</iframe>',
            '</form>'
        ]).join("");
    
    iframe = div.firstChild.firstChild;
    
    DOM.on(iframe, 'load', frameFirstOnloadEvent);
    
    doc.body.appendChild(div);
    
    doc = div = iframe = null;
    return id;
}

function frameFirstOnloadEvent(event) {
    var target = event.target,
        form = target.parentNode;
        
    DOM.un(target, 'load', frameFirstOnloadEvent);
    
    form.setAttribute('data-readystate', 'ready');
    
    DOM.dispatch(form, 'libdom-http-ready', {});
    
    target = form = null;
}

function getForm(id) {
    return global$1.document.getElementById(id);
}

function createField(operation, name, value, type, fieldType) {
    var impostors = operation.impostors,
        fragment = operation.fragment,
        isField$$1 = type === "field",
        isFile = isField$$1 && fieldType === "file",
        input = null;
    var parent;
    
    // include only if it has value
    if (isFile && value.value) {
        
        parent = value.parentNode;
        if (parent) {
            input = value.cloneNode();
            input.disabled = true;
            input.readOnly = true;
            impostors[impostors.length] = [value, input];
            DOM.replace(value, input);
        }
        input = value;
        operation.files = true;
        
    }
    else if (!isFile) {
        
        if (isField$$1) {
            value = value.value;
        }
        
        if (value === 'number') {
            value = isFinite(value) ? value.toString(10) : '';
        }
        else if (!libcore.string(value)) {
            value = jsonify(value);
        }
        
        input = fragment.ownerDocument.createElement('input');
        input.type = "hidden";
        input.name = name;
        input.value = value;
        
    }
    
    if (input) {
        fragment.appendChild(input);
    }
    
    fragment = parent = input = null;
    
}

function revertImpostors(impostors) {
    var l, pair, original, impostor, parent;
    
    for (l = impostors.length; l--;) {
        pair = impostors[l];
        original = pair[0];
        impostor = pair[1];
        parent = impostor.parentNode;
        if (parent) {
            parent.replaceChild(original, impostor);
        }
        parent = pair = pair[0] = pair[1] = original = impostor = null;
    }

}

    
function FormUpload() {
    var me = this;
        
    Driver.apply(me, arguments);

}


FormUpload.prototype = libcore.instantiate(Driver, {
    constructor: FormUpload,
    
    blankDocument: 'about:blank',
    defaultType: 'application/json',
    
    bindMethods: BASE_PROTOTYPE$1.bindMethods.concat([
                    'onFormReady',
                    'onFormDeferredSubmit',
                    'onRespond'
                ]),
    
    createTransportPromise: function (request) {
        function bind(resolve, reject) {
            var local = request;
            local.resolve = resolve;
            local.reject = reject;
        }
        return new Promise(bind);
    },
    
    onFormReady: function () {
        var me = this,
            request = me.request,
            form = request.form;

        // unset event if it was set
        DOM.un(form, 'libdom-http-ready', me.onFormReady);
        
        form.enctype = form.encoding = request.contentType;
        
        request.deferredSubmit = global$1.setTimeout(me.onFormDeferredSubmit, 10);
        
        form = null;
        
        
    },
    
    onFormDeferredSubmit: function () {
        var me = this,
            request = me.request,
            form = request && request.form;
        
        if (form) {
            DOM.on(request.iframe, 'load', me.onRespond);
            form.submit();
            
        }
        else if (request) {
            request.reject(408);
        }
        
        request = form = null;
    },
    
    onRespond: function () {
        var me = this,
            request = me.request,
            iframe = request.iframe,
            success = false,
            docBody = '';
        
        DOM.un(iframe, 'load', me.onRespond);
        
        try {
            docBody = iframe.contentWindow.document.body.innerHTML;
            success = true;
        }
        catch (e) {}

        if (success) {
            request.formResponse = docBody.replace(RESPONSE_TRIM, "");
            request.resolve(200);
        }
        else {
            request.reject(406);
        }
        
        iframe = null;
        
    },
    
    onSetup: function (request) {
        var me = this,
            impostors = [],
            id = createForm(request.method,
                            request.getUrl(),
                            request.contentType,
                            me.blankDocument),
            form = getForm(id),
            operation = {
                impostors: impostors,
                fragment: global$1.document.createDocumentFragment(),
                files: false,
                driver: me,
                request: request
            },
            currentResponseType = request.responseType;
            
        // recreate request
        eachValues(request.data, createField, operation);
        
        // add fields
        form.appendChild(operation.fragment);
        request.form = form;
        request.iframe = form.firstChild;
        request.impostors = operation.impostors;
        request.fileUpload = operation.files;
        
        // use application.json as default response type
        if (!libcore.string(currentResponseType)) {
            request.responseType = me.defaultType;
        }
        
        // cleanup operation
        libcore.clear(operation);
        
        request.transportPromise = me.createTransportPromise(request);
        
        form = null;
        
    },
    
    onTransport: function (request) {
        
        var form = request.form,
            contentType = 'application/x-www-form-urlencoded';
        
        // set proper content-type
        if (request.fileUpload) {
            contentType = 'multipart/form-data';
        }
        
        request.addHeaders('Content-type: ' + contentType);
        
        if (form.getAttribute('data-readystate') === 'ready') {
            this.onFormReady();
        }
        else {
            DOM.on(form, 'libdom-http-ready', this.onFormReady);
        }
        
    },
    
    onSuccess: function (request) {
        var me = this,
            response = me.response,
            responseBody = request.formResponse;
        
        if (libcore.string(responseBody)) {
            response.body = responseBody;
        }
    },
    
    onCleanup: function (request) {
        var impostors = request.impostors,
            form = request.form;
        
        // return impostors
        if (libcore.array(impostors)) {
            revertImpostors(impostors);
        }
        
        if (form) {
            DOM.remove(form.parentNode || form);
        }
        
        request.transportPromise = 
            request.resolve =
            request.reject = 
            request.form = form = null;
    }

    
});

function convert$4(data) {
    
    if (libcore.number(data)) {
        data = data.toString(10);
    }
    
    return ['Content-type: text/plain',
            libcore.string(data) ?
                data : ''];
}

function appendFormData(operation, name, value, type, fieldType) {
    var formData = operation.returnValue,
        isString = libcore.string;
    var list, c, l, filename;
    
    // don't use parsed name for formData
    if (type === 'field') {
        
        if (fieldType === "file") {
            list = value.files;
            for (c = -1, l = list.length; l--;) {
                value = list[++c];
                filename = value.name;

                if (isString(filename)) {
                    formData.append(name, value, filename);
                }
                else {
                    formData.append(name, value);
                }
            }
            formData = null;
            return;
        }
        value = value.value;
    }

        
    // natives
    if (typeof value === 'number') {
        value = isFinite(value) ? value.toString(10) : '';
    }
    else if (typeof value !== 'string') {
        value = jsonify(value);
    }
    formData.append(name, value);
    
    formData = null;
}


function convert$5(data) {
    return [null,
            eachValues(data,
                appendFormData,
                {
                    returnValue: new (global$1.FormData)()
                })];
    
}

var LINE_SPLIT_RE = /\r\n|\r|\n/;
var LINE_PAIR_RE = /^([^ \r\n\t\s\:]+)\:(.+)$/;
var LINE_EXTENSION_RE = /^([ \r\n\t\s]+.+|[^\:]+)$/;
var LINE_REQUEST_RE =
        /^([a-z]+)[ \t\s]+(\/[^\:]+)[ \t\s]+(HTTP\/[0-9]+\.[0-9]+)$/i;
var LINE_RESPONSE_RE =
        /^(HTTP\/[0-9]+.[0-9]+)[ \t\s]+([0-9]+)[ \t\s]+([a-z0-9\-\_]+)$/i;
var LINE_TRIM = /^[ \t\s]*(.+)[ \t\s]*$/;
var MULTI_VALUE_RE = /Set\-cookie/i;



function parseHeaderString(str, callback, scope) {
    var lines = str.split(LINE_SPLIT_RE),
        pairRe = LINE_PAIR_RE,
        extensionRe = LINE_EXTENSION_RE,
        requestRe = LINE_REQUEST_RE,
        responseRe = LINE_RESPONSE_RE,
        trimRe = LINE_TRIM,
        multivalueRe = MULTI_VALUE_RE,
        separator = ':',
        trimReplace = "$1",
        normalize = headerName,
        l = lines.length,
        c = -1,
        headers = {},
        names = [],
        nl = 0,
        name = null;
    var line, index, value, values, exist;
    
    if (typeof scope === 'undefined') {
        scope = null;
    }
        
    // parse
    for (; l--;) {
        line = lines[++c];
        
        // header request/response
        if (!c &&
            requestRe.test(line) || responseRe.test(line)) {
            names[nl++] = "";
            headers[""] = line;
            continue;
            
        }
        
        // pair
        if (pairRe.test(line)) {
            index = line.indexOf(separator);
            name = line.substring(0, index);
            value = line.
                        substring(index + 1, line.length).
                        replace(trimRe, trimReplace);
            
            if (!value) {
                continue;
            }
            
            // normalize
            name = normalize(name);
            
            
            exist = libcore.contains(headers, name);
            if (!exist) {
                names[nl++] = name;
            }
            
            if (multivalueRe.test(name)) {
                if (!exist) {
                    headers[name] = [];
                }
                values = headers[name];
                values[values.length] = value;
            }
            else {
                headers[name] = value;
            }
            
        }
        // continuation
        else if (name && extensionRe.test(line)) {
            value = line.replace(trimRe, trimReplace);
            
            if (multivalueRe.test(name)) {
                values = headers[name];
                values[values.length - 1] += ' ' + value;
            }
            else {
                headers[name] += ' ' + value;
            }
            
        }
    }
    
    // callback
    for (c = -1, l = names.length; l--;) {
        name = names[++c];
        callback.call(scope, name, headers[name]);
    }
}



function parseCallback(name, values) {
    
    /* jshint validthis:true */
    this[name] = values;
}

function cleanArrayValues(array$$1) {
    var isString = libcore.string,
        isNumber = libcore.number,
        l = array$$1.length;
    var value;
    
    for (; l--;) {
        value = array$$1[l];
        if (isNumber(value)) {
            array$$1[l] = value.toString(10);
        }
        else if (!isString(value)) {
            array$$1.splice(l, 1);
        }
    }
    return array$$1;
}

function onEachInput(value, name) {
    var context = this,
        callback = context[0],
        scope = context[1],
        multivalueRe = MULTI_VALUE_RE;
    
    var len;
    
    name = headerName(name);
    
    if (libcore.string(value) || libcore.number(value)) {
        callback.call(scope, name,
                                multivalueRe.test(name) ?
                                    [value] : value);
    }
    else if (libcore.array(value)) {
        
        value = cleanArrayValues(value.slice(0));
        
        if (!multivalueRe.test(name)) {
            len = value.length;
            value = len ? value[len - 1] : '';
        }
        
        if (value.length) {
            callback.call(scope, name, value);
        }
    }
}

function headerName(name) {
        if (!name) {
            return '';
        }
        
        return name.charAt(0).toUpperCase() +
                    name.
                        substring(1, name.length).
                        toLowerCase();
        
    }
    
function each$1(input, callback, scope, current) {
        
        // join as string
        if (libcore.array(input)) {
            input = cleanArrayValues(input.slice(0)).join("\r\n");
        }
        
        if (libcore.string(input)) {
            parseHeaderString(input, callback, scope, current);
            
        }
        else if (libcore.object(input)) {
            
            if (typeof scope === 'undefined') {
                scope = null;
            }
            
            libcore.each(input,
                         onEachInput,
                         [callback,
                          scope
                            
                         ],
                         true);
            
        }
        else {
            
            return false;
        }
        
        return true;
        
    }
    
function parse(headers) {
        var values = {};
        return each$1(headers, parseCallback, values) && values;
    }

var CLEANING = false;
var CLEAN_INTERVAL = 1000;
var TTL = 10000;
var RUNNING = false;
var OPERATIONS = [];
var URL_QUERY_STRING_RE = /^([^\?\#]+)(\?[^\?\#]*)?(\#.*)?$/;
    
function applyQueryString(url, queryString) {
    var match = url.match(URL_QUERY_STRING_RE);
    var query;
    
    if (match && libcore.string(queryString)) {
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

function destructor$1() {
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
        var me = this;
        var current, contentType;
            
        headers = parse(headers);
        
        if (headers) {
            current = me.headers;
            if (libcore.object(current)) {
                libcore.assign(current, headers);
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
            current = me.headers;
        
        if (libcore.string(name) && libcore.object(current)) {
            name = headerName(name);
            
            if (libcore.contains(current, name)) {
                return current[name];
            }
            
        }
        
        return null;
    },
    
    destroy: function () {
        var me = this;
        if (!me.destroyed) {
            me.destroyed = true;
            libcore.clear(me);
        }
        return me;
    }
};


Request.prototype = libcore.instantiate(Operation, {
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
            isString = libcore.string,
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
        var config = this.config;
            
        if (libcore.object(config) && libcore.contains(config, name)) {
            return config[name];
        }
        return void(0);
    },
    
    process: function () {
        var me = this,
            result = transform(me.header('content-type'),
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
        if (libcore.string(responseType)) {
            response.addHeaders('Content-type: ' + responseType);
        }
        response.request = me;
        response.begin();
        
        result = null;
    }
});

Response.prototype = libcore.instantiate(Operation, {
    constructor: Response,
    status: 0,
    statusText: 'Uninitialized',
    process: function () {
        var me = this,
            result = transform(me.header('content-type'),
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


DOM.destructor(destructor$1);

var DEFAULTS = libcore.createRegistry();
var METHODS = ['get','post','put','patch','delete','options'];
var ALLOWED_PAYLOAD = ['post', 'put', 'patch'];
var exported$6 = {
        request: request,
        defaults: defaults
    };
    


function normalizeMethod(method$$1) {
    if (libcore.string(method$$1)) {
        method$$1 = method$$1.toLowerCase();
        if (METHODS.indexOf(method$$1) !== -1) {
            return method$$1;
        }
    }
    
    return DEFAULTS.get('method');
}

function sniffDriver(config) {
    var driver = config.driver;
    
    // call middleware
    libcore.run("libdom-http.driver.resolve", [config, driver]);
    driver = config.driver;
    
    if (libcore.string(driver) && exists(driver)) {
        return driver;
    }
    
    // use default
    return use$1();
    
}

function applyRequestForm(form, requestObject) {
    var isString = libcore.string;
    var item;
    
    // use this as request header only if not default
    item = form.getAttribute('enctype') || form.getAttribute('encoding');
    if (isString(item)) {
        requestObject.addHeaders('Content-type: ' + item);
    }
    
    item = form.action;
    if (isString(item)) {
        requestObject.url = item;
    }
    
    item = form.method;
    if (isString(item)) {
        requestObject.method = normalizeMethod(item);
    }
    
    item = form.getAttribute('data-driver');
    if (isString(item)) {
        requestObject.driver = item;
    }
    
    
    item = form.getAttribute('data-response-type');
    if (isString(item)) {
        requestObject.responseType = item;
    }
    
    requestObject.data = form;
}

function applyRequestConfig(config, requestObject) {
    var isString = libcore.string,
        undef = void(0);
    var item;
    
    // apply defaults
    item = config.form || config.data || config.params || config.body;
    if (isForm(item)) {
        applyRequestForm(item, requestObject);
    }
    else if (item !== null || item !== undef) {
        requestObject.data = item;
    }
    
    item = config.query || config.urlData || config.urlParams;
    if (isForm(item) || (item !== null && item !== undef)) {
        requestObject.query = item;
    }
    
    item = config.url;
    if (isString(item)) {
        requestObject.url = item;
    }
    
    item = config.method;
    if (isString(item)) {
        requestObject.method = normalizeMethod(item);
    }
    
    item = config.driver;
    if (isString(item)) {
        requestObject.driver = item;
    }
    
    item = config.responseType;
    if (isString(item)) {
        requestObject.responseType = item;
    }
    
    // add headers
    requestObject.addHeaders('headers' in config && config.headers);
    
    requestObject.config = config;
    
    item = null;
}

function request(url, config) {
        var isString = libcore.string,
            isObject = libcore.object,
            isForm$$1 = isForm,
            applyConfig = applyRequestConfig,
            requestObject = new Request(),
            PROMISE = Promise;
        var driver, promise;
        
        // apply defaults
        applyConfig(DEFAULTS.clone(), requestObject);
        
        // process config
        if (isString(url)) {
            
            if (isObject(config)) {
                applyConfig(config, requestObject);
            }
            else if (isForm$$1(config)) {
                applyRequestForm(config, requestObject);
            }
            
            requestObject.url = url;
            
        }
        else if (isObject(url)) {
            applyConfig(url, requestObject);
        }
        else if (isForm$$1(url)) {
            applyRequestForm(url, requestObject);
        }
        
        // decide if body is allowed or not based from methods
        if (ALLOWED_PAYLOAD.indexOf(requestObject.method) === -1) {
            requestObject.allowedPayload = false;
        }
        
        
        // validate
        if (isString(requestObject.url)) {
            
            driver = sniffDriver(requestObject);
            if (driver) {
                driver = new (get$1(driver))(requestObject);
                requestObject.driver = driver;
                promise =  PROMISE.resolve(requestObject).
                                then(driver.setup).
                                then(driver.transport).
                                then(driver.success)
                                ["catch"](driver.error);
                
                requestObject.api = promise;
                requestObject = driver = null;
                return promise;
            }
            
        }
        
        return PROMISE.reject("Invalid HTTP request configuration.");
        
    }

function defaults(name, value) {
        var all = DEFAULTS;
        if (arguments.length > 1) {
            all.set(name, value);
            return get();
        }
        
        return all.get(name);
        
    }


// set default driver
use$1('xhr');

// set default method
DEFAULTS.set('method', 'get');

// add default header
DEFAULTS.set('headers', {
    'accept': 'application/json,text/x-json,text/plain,*/*;q=0.8',
    'content-type': 'application/json'
});

if (!global$1.libdom) {
    throw new Error("libdom package is not found! unable to load http module");
}



if (DETECT.xhr) {
    register('xhr', Xhr);
    
    register('xhr2', Xhr);
}

// file upload drivers
if (libcore.env && libcore.env.browser) {
    register('form-upload',
        DETECT.xhr && DETECT.file && DETECT.blob ?
            // form data
            Xhr :
            
            // old school iframe
            FormUpload);
}

// Transform Drivers
register$1('text/plain',
    true,
    convert$4);


if (DETECT.formdata) {
    
    // use html5 form data request
    register$1('multipart/form-data',
        false,
        convert$5);
}



        
        



var moduleApi$1 = Object.freeze({
	use: use$1,
	driver: register,
	transform: transform,
	transformer: register$1,
	request: request,
	defaults: defaults,
	parseHeader: parse,
	eachHeader: each$1
});

use(moduleApi$1);

exports['default'] = moduleApi$1;
exports.use = use$1;
exports.driver = register;
exports.transform = transform;
exports.transformer = register$1;
exports.request = request;
exports.defaults = defaults;
exports.parseHeader = parse;
exports.eachHeader = each$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=libdom-http.js.map
