(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === "object" && typeof module === "object") module.exports = factory(require(undefined), require(undefined)); else if (typeof define === "function" && define.amd) define("libdom-http", [ ,  ], factory); else if (typeof exports === "object") exports["libdom-http"] = factory(require(undefined), require(undefined)); else root["libdom-http"] = factory(root[undefined], root[undefined]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_4__) {
    return function(modules) {
        var installedModules = {};
        function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) return installedModules[moduleId].exports;
            var module = installedModules[moduleId] = {
                exports: {},
                id: moduleId,
                loaded: false
            };
            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            module.loaded = true;
            return module.exports;
        }
        __webpack_require__.m = modules;
        __webpack_require__.c = installedModules;
        __webpack_require__.p = "/assets/";
        return __webpack_require__(0);
    }([ function(module, exports, __webpack_require__) {
        module.exports = __webpack_require__(1);
    }, function(module, exports, __webpack_require__) {
        (function(global) {
            "use strict";
            var LIBCORE = __webpack_require__(2), DETECT = __webpack_require__(3), DRIVER = __webpack_require__(5), TRANSFORMER = __webpack_require__(6), REQUEST = __webpack_require__(13), rehash = LIBCORE.rehash, driverRegister = DRIVER.register, transformRegister = TRANSFORMER.register, EXPORTS = REQUEST.request;
            if (!global.libdom) {
                throw new Error("libdom package is not found! unable to load http module");
            }
            global.libdom.http = EXPORTS;
            if (DETECT.xhr) {
                driverRegister("xhr", __webpack_require__(16));
                driverRegister("xhr2", __webpack_require__(18));
            }
            transformRegister("text/plain", true, __webpack_require__(19));
            if (DETECT.formdata) {
                transformRegister("multipart/form-data", false, __webpack_require__(20));
            }
            if (LIBCORE.env.browser) {
                driverRegister("form-upload", DETECT.xhr && DETECT.file && DETECT.blob ? __webpack_require__(18) : __webpack_require__(21));
            }
            rehash(EXPORTS, REQUEST, {
                request: "request",
                defaults: "defaults"
            });
            rehash(EXPORTS, DRIVER, {
                driver: "register",
                use: "use"
            });
            rehash(EXPORTS, __webpack_require__(15), {
                parseHeader: "parse",
                eachHeader: "each"
            });
            rehash(EXPORTS, TRANSFORMER, {
                transformer: "register",
                transform: "transform"
            });
            TRANSFORMER.chain = DRIVER.chain = EXPORTS;
            module.exports = EXPORTS["default"] = EXPORTS;
        }).call(exports, function() {
            return this;
        }());
    }, function(module, exports) {
        module.exports = __WEBPACK_EXTERNAL_MODULE_2__;
    }, function(module, exports, __webpack_require__) {
        (function(global) {
            "use strict";
            var DOM = __webpack_require__(4), ENV = DOM.env, G = global, XHR = G.XMLHttpRequest, support_xhr = !!XHR, support_xhrx = false, support_xhrmime = false, support_xhrtime = false, support_xhrbin = false, support_xhrprogress = false, support_xdr = !!G.XDomainRequest;
            if (ENV.browser) {
                if (XHR) {
                    XHR = XHR.prototype;
                    support_xhrx = "withCredentials" in XHR;
                    support_xhrmime = "overrideMimeType" in XHR;
                    support_xhrtime = "timeout" in XHR;
                    support_xhrbin = "sendAsBinary" in XHR;
                    support_xhrprogress = "onprogress" in XHR;
                }
            } else if (ENV.node) {}
            module.exports = {
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
        }).call(exports, function() {
            return this;
        }());
    }, function(module, exports) {
        module.exports = __WEBPACK_EXTERNAL_MODULE_4__;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var LIBCORE = __webpack_require__(2), DRIVERS = LIBCORE.createRegistry(), DEFAULT = null, EXPORTS = {
            register: register,
            exists: exists,
            use: use,
            get: get
        };
        function register(name, Class) {
            var CORE = LIBCORE;
            if (CORE.string(name) && CORE.method(Class)) {
                DRIVERS.set(name, Class);
                Class.prototype.type = name;
                if (!DEFAULT) {
                    DEFAULT = name;
                }
            }
            return EXPORTS.chain;
        }
        function exists(name) {
            return DRIVERS.exists(name);
        }
        function use(name) {
            if (arguments.length > 0 && exists(name)) {
                DEFAULT = name;
            }
            return DEFAULT;
        }
        function get(type) {
            return DRIVERS.get(type);
        }
        module.exports = EXPORTS.chain = EXPORTS;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var LIBCORE = __webpack_require__(2), TYPES = __webpack_require__(7), TRANSFORMERS = LIBCORE.createRegistry(), REQUEST_PREFIX = "request-", RESPONSE_PREFIX = "response-", EXPORTS = {
            register: register,
            transform: transform
        };
        var item;
        function register(type, response, handler) {
            var CORE = LIBCORE, transformers = TRANSFORMERS, responsePrefix = RESPONSE_PREFIX;
            var finalType, current, all;
            if (CORE.method(handler)) {
                type = TYPES.parse(type);
                if (type) {
                    all = response === "all";
                    response = response === true ? REQUEST_PREFIX : responsePrefix;
                    finalType = response + type.root;
                    current = response + type.string;
                    if (current !== finalType && !transformers.exists(finalType)) {
                        transformers.set(finalType, handler);
                    }
                    transformers.set(current, handler);
                    if (all) {
                        transformers.set(responsePrefix + type.string, handler);
                    }
                }
            }
            return EXPORTS.chain;
        }
        function transform(type, response, data) {
            var transformers = TRANSFORMERS;
            var finalType;
            type = TYPES.parse(type);
            if (type) {
                response = response === true ? REQUEST_PREFIX : RESPONSE_PREFIX;
                finalType = response + type.string;
                if (transformers.exists(finalType)) {
                    return transformers.get(finalType)(data);
                }
                finalType = response + type.root;
                if (transformers.exists(finalType)) {
                    data = transformers.get(finalType)(data);
                    return LIBCORE.array(data) ? data : [ null, null ];
                }
            }
            return [ null, data ];
        }
        module.exports = EXPORTS.chain = EXPORTS;
        item = __webpack_require__(8);
        register("application/json", false, item).register("text/x-json", false, item);
        item = __webpack_require__(10);
        register("application/json", true, item).register("text/x-json", true, item);
        register("application/x-www-form-urlencoded", false, __webpack_require__(11)).register("multipart/form-data", false, __webpack_require__(12));
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var LIBCORE = __webpack_require__(2), MIME_TYPE_RE = /^([a-z0-9\-\_]+)\/([a-z\-\_0-9]+)(([ \s\t]*\;([^\;]+))*)$/, MIME_TYPE_PARAMS_RE = /^[ \t\s]*([a-z0-9\-\_]+)\=(\"([^\"]+)\"|[a-z0-9\-\_]+)[ \t\s]*$/, QUOTED_RE = /^\"[^\"]+\"/, EXPORTS = {
            parse: parseType
        };
        function parseType(type) {
            var mtypeRe = MIME_TYPE_RE, paramRe = MIME_TYPE_PARAMS_RE, quotedRe = QUOTED_RE, CORE = LIBCORE, paramGlue = "; ", parameterObject = null;
            var match, subtype, parameters, name, value, l, defaultType;
            if (CORE.string(type) && mtypeRe.test(type)) {
                match = type.match(mtypeRe);
                type = match[1].toLowerCase();
                subtype = match[2].toLowerCase();
                parameters = match[3] || "";
                if (parameters) {
                    parameterObject = {};
                    parameters = parameters.split(";");
                    l = parameters.length;
                    for (;l--; ) {
                        match = parameters[l].match(paramRe);
                        if (match) {
                            name = match[1].toLowerCase();
                            value = match[2];
                            parameters[l] = name + "=" + value;
                            parameterObject[name] = quotedRe.test(value) ? value.substring(1, value.length - 1) : value;
                        }
                    }
                    parameters = parameters.join(paramGlue);
                }
                defaultType = type + "/" + subtype;
                return {
                    string: defaultType + (parameters ? paramGlue + parameters : ""),
                    root: defaultType,
                    type: type,
                    subtype: subtype,
                    params: parameterObject
                };
            }
            return void 0;
        }
        module.exports = EXPORTS;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var LIBCORE = __webpack_require__(2), HELP = __webpack_require__(9);
        function createValue(operation, name, value, type, fieldType) {
            var CORE = LIBCORE, items = operation.returnValue, isField = type === "field";
            if (isField) {
                if (fieldType === "file") {
                    return;
                }
                value = value.value;
            }
            if (value === "number") {
                value = isFinite(value) ? value.toString(10) : "";
            } else if (!CORE.string(value)) {
                value = HELP.jsonify(value);
            }
            if (isField || type === "field-options") {
                CORE.urlFill(items, name, value);
            } else {
                items[name] = value;
            }
            items = value = null;
        }
        function convert(data) {
            var H = HELP, operation = {
                index: {},
                returnValue: {}
            }, body = H.each(data, createValue, operation);
            return [ null, H.jsonify(body) ];
        }
        module.exports = convert;
    }, function(module, exports, __webpack_require__) {
        (function(global) {
            "use strict";
            var LIBDOM = __webpack_require__(4), LIBCORE = __webpack_require__(2), TYPE_OBJECT = 1, TYPE_ARRAY = 2;
            function isForm(form) {
                return LIBDOM.is(form, 1) && form.tagName.toUpperCase() === "FORM";
            }
            function isField(field) {
                if (LIBDOM.is(field, 1)) {
                    switch (field.tagName.toUpperCase()) {
                      case "INPUT":
                      case "TEXTAREA":
                      case "BUTTON":
                      case "SELECT":
                      case "OUTPUT":
                        return true;
                    }
                }
                return false;
            }
            function eachValues(values, callback, operation) {
                var CORE = LIBCORE, typeObject = TYPE_OBJECT, typeArray = TYPE_ARRAY, type = null, each = eachField, isObject = CORE.object, contains = CORE.contains, isObjectValue = isObject(values);
                var c, l, name;
                if (isForm(values)) {
                    values = values.elements;
                    type = typeArray;
                    isObjectValue = false;
                } else if (isField(values)) {
                    type = typeArray;
                    values = [ values ];
                } else if (isObjectValue) {
                    type = typeObject;
                } else if (CORE.array(values)) {
                    type = typeArray;
                    isObjectValue = false;
                }
                if (!isObject(operation)) {
                    operation = {};
                }
                if (!contains(operation, "returnValue")) {
                    operation.returnValue = null;
                }
                if (isObjectValue || type === typeArray) {
                    if (isObjectValue) {
                        for (name in values) {
                            if (contains(values, name)) {
                                each(values[name], name, callback, operation);
                            }
                        }
                    } else {
                        for (c = -1, l = values.length; l--; ) {
                            each(values[++c], null, callback, operation);
                        }
                    }
                }
                return operation.returnValue;
            }
            function eachField(field, name, callback, operation) {
                var CORE = LIBCORE, isString = CORE.string, hasName = isString(name), fieldType = "variant";
                var type, c, l, list, option;
                if (isField(field)) {
                    if (!hasName && !isString(name = field.name)) {
                        return;
                    }
                    type = "field";
                    hasName = true;
                    fieldType = field.type;
                    switch (field.tagName.toUpperCase()) {
                      case "BUTTON":
                        if (!isString(fieldType)) {
                            fieldType = "button";
                        }
                        break;

                      case "SELECT":
                        type = "field-options";
                        fieldType = "select";
                        list = field.options;
                        for (c = -1, l = list.length; l--; ) {
                            option = list[++c];
                            if (option.selected) {
                                callback(operation, name, option.value, type, fieldType);
                            }
                        }
                        list = option = null;
                        return;

                      case "TEXTAREA":
                        fieldType = "text";
                        break;
                    }
                    switch (fieldType) {
                      case "checkbox":
                      case "radio":
                        if (!field.checked) {
                            return;
                        }
                    }
                } else {
                    switch (true) {
                      case CORE.array(field):
                        type = "array";
                        break;

                      case CORE.date(field):
                        type = "date";
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
                var json = global.JSON, data = null;
                if (!json) {
                    throw new Error("JSON is not supported in this platform");
                }
                try {
                    data = json.stringify(raw);
                } catch (e) {}
                return data === "null" || data === null ? "" : data;
            }
            module.exports = {
                each: eachValues,
                form: isForm,
                field: isField,
                jsonify: jsonify
            };
        }).call(exports, function() {
            return this;
        }());
    }, function(module, exports, __webpack_require__) {
        (function(global) {
            "use strict";
            var LIBCORE = __webpack_require__(2), json = global.JSON;
            if (!json) {
                json = false;
            }
            function convert(data) {
                if (!json) {
                    throw new Error("JSON is not supported in this platform");
                } else if (!LIBCORE.string(data)) {
                    return null;
                }
                try {
                    data = json.parse(data);
                } catch (e) {
                    return null;
                }
                return [ null, data ];
            }
            module.exports = convert;
        }).call(exports, function() {
            return this;
        }());
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var HELP = __webpack_require__(9);
        function createValue(operation, name, value, type, fieldType) {
            var items = operation.returnValue;
            if (type === "field") {
                if (fieldType === "file") {
                    return;
                }
                value = value.value;
            }
            if (typeof value === "number") {
                value = isFinite(value) ? value.toString(10) : "";
            } else if (typeof value !== "string") {
                value = HELP.jsonify(value);
            }
            items[items.length] = name + "=" + encodeURIComponent(value);
        }
        function convert(data) {
            var body = HELP.each(data, createValue, {
                returnValue: []
            });
            return [ null, body.join("&") ];
        }
        module.exports = convert;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var HELP = __webpack_require__(9), EOL = "\r\n", BOUNDARY_LENGTH = 48;
        function createBoundary() {
            var ender = Math.random().toString().substr(2), output = [], len = 0, total = BOUNDARY_LENGTH - ender.length;
            for (;total--; ) {
                output[len++] = "-";
            }
            output[len++] = ender;
            return output.join("");
        }
        function createValue(operation, name, value, type, fieldType) {
            var eol = EOL, items = operation.returnValue;
            if (type === "field") {
                if (fieldType === "file") {
                    return;
                }
                value = value.value;
            }
            if (typeof value === "number") {
                value = isFinite(value) ? value.toString(10) : "";
            } else if (typeof value !== "string") {
                value = HELP.jsonify(value);
            }
            items[items.length] = [ 'Content-Disposition: form-data; name="' + name + '"', "Content-type: application/octet-stream", eol, value ].join(eol);
        }
        function convert(data) {
            var eol = EOL, boundary = createBoundary(), body = HELP.each(data, createValue, {
                returnValue: []
            });
            if (!body.length) {
                body.splice(0, 0, boundary);
            }
            return [ [ "Content-Type: multipart/form-data; charset=utf-8;", "    boundary=" + boundary ].join(eol), boundary + eol + body.join(eol + boundary + eol) + boundary + "--" + eol ];
        }
        module.exports = convert;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var LIBCORE = __webpack_require__(2), DRIVER = __webpack_require__(5), OPERATION = __webpack_require__(14), HELP = __webpack_require__(9), DEFAULTS = LIBCORE.createRegistry(), METHODS = [ "get", "post", "put", "patch", "delete", "options" ], ALLOWED_PAYLOAD = [ "post", "put", "patch" ], EXPORTS = {
            request: request,
            defaults: accessDefaults
        };
        function normalizeMethod(method) {
            if (LIBCORE.string(method)) {
                method = method.toLowerCase();
                if (METHODS.indexOf(method) !== -1) {
                    return method;
                }
            }
            return DEFAULTS.get("method");
        }
        function sniffDriver(config) {
            var driver = config.driver, mgr = DRIVER;
            LIBCORE.run("libdom-http.driver.resolve", [ config, driver ]);
            driver = config.driver;
            if (mgr.exists(driver)) {
                return driver;
            }
            return mgr.use();
        }
        function applyRequestForm(form, requestObject) {
            var CORE = LIBCORE, isString = CORE.string;
            var item;
            item = form.getAttribute("enctype") || form.getAttribute("encoding");
            if (isString(item)) {
                requestObject.addHeaders("Content-type: " + item);
            }
            item = form.action;
            if (isString(item)) {
                requestObject.url = item;
            }
            item = form.method;
            if (isString(item)) {
                requestObject.method = normalizeMethod(item);
            }
            item = form.getAttribute("data-driver");
            if (isString(item)) {
                requestObject.driver = item;
            }
            item = form.getAttribute("data-response-type");
            if (isString(item)) {
                requestObject.responseType = item;
            }
            requestObject.data = form;
        }
        function applyRequestConfig(config, requestObject) {
            var CORE = LIBCORE, isString = CORE.string, help = HELP, undef = void 0;
            var item;
            item = config.form || config.data || config.params || config.body;
            if (help.form(item)) {
                applyRequestForm(item, requestObject);
            } else if (item !== null || item !== undef) {
                requestObject.data = item;
            }
            item = config.query || config.urlData || config.urlParams;
            if (help.form(item) || item !== null && item !== undef) {
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
            requestObject.addHeaders("headers" in config && config.headers);
            requestObject.config = config;
            item = null;
        }
        function request(url, config) {
            var CORE = LIBCORE, H = HELP, isString = CORE.string, isObject = CORE.object, applyConfig = applyRequestConfig, requestObject = new OPERATION(), PROMISE = Promise;
            var driver, promise;
            applyConfig(DEFAULTS.clone(), requestObject);
            if (isString(url)) {
                if (isObject(config)) {
                    applyConfig(config, requestObject);
                } else if (H.form(config)) {
                    applyRequestForm(config, requestObject);
                }
                requestObject.url = url;
            } else if (isObject(url)) {
                applyConfig(url, requestObject);
            } else if (H.form(url)) {
                applyRequestForm(url, requestObject);
            }
            if (ALLOWED_PAYLOAD.indexOf(requestObject.method) === -1) {
                requestObject.allowedPayload = false;
            }
            if (isString(requestObject.url)) {
                driver = sniffDriver(requestObject);
                if (driver) {
                    driver = new (DRIVER.get(driver))(requestObject);
                    requestObject.driver = driver;
                    promise = PROMISE.resolve(requestObject).then(driver.setup).then(driver.transport).then(driver.success)["catch"](driver.error);
                    requestObject.api = promise;
                    requestObject = driver = null;
                    return promise;
                }
            }
            return PROMISE.reject("Invalid HTTP request configuration.");
        }
        function accessDefaults(name, value) {
            var defaults = DEFAULTS;
            if (arguments.length > 1) {
                defaults.set(name, value);
                return EXPORTS.chain;
            }
            return defaults.get(name);
        }
        module.exports = EXPORTS;
        DRIVER.use("xhr");
        DEFAULTS.set("method", "get");
        DEFAULTS.set("headers", {
            accept: "application/json,text/x-json,text/plain,*/*;q=0.8",
            "content-type": "application/json"
        });
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var LIBCORE = __webpack_require__(2), LIBDOM = __webpack_require__(4), HEADER = __webpack_require__(15), TRANSFORMER = __webpack_require__(6), CLEANING = false, CLEAN_INTERVAL = 1e3, TTL = 1e4, RUNNING = false, OPERATIONS = [], URL_QUERY_STRING_RE = /^([^\?\#]+)(\?[^\?\#]*)?(\#.*)?$/;
        function applyQueryString(url, queryString) {
            var match = url.match(URL_QUERY_STRING_RE);
            var query;
            if (match && LIBCORE.string(queryString)) {
                query = match[2];
                match[2] = (query ? query + "&" : "?") + queryString;
                match[3] = match[3] || "";
                return match.slice(1).join("");
            }
            return url;
        }
        function onCleanup(force) {
            var list = OPERATIONS, id = RUNNING;
            var len, operation, now, ttl, created;
            if (!CLEANING) {
                CLEANING = true;
                now = new Date().getTime();
                ttl = TTL;
                force = force === true;
                for (len = list.length; len--; ) {
                    operation = list[len];
                    if (force) {
                        operation.destroy();
                    } else if (!operation.destroyed) {
                        created = operation.createdAt;
                        if (!created || operation.processing) {
                            operation.createdAt = now;
                        } else if (created + ttl < now) {
                            operation.destroy();
                        }
                    }
                    if (operation.destroyed) {
                        list.splice(len, 1);
                    }
                }
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
            } else if (!id) {
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
            var list = OPERATIONS, me = this;
            me.destroyed = false;
            list[list.length] = me;
            runCleaner();
        }
        Operation.prototype = {
            createdAt: void 0,
            contentType: "application/octet-stream",
            headers: null,
            body: null,
            data: null,
            destroyed: true,
            processing: false,
            constructor: Operation,
            begin: function() {
                var me = this;
                if (!me.destroyed && !me.processing) {
                    me.processing = true;
                    delete me.createdAt;
                    runCleaner();
                }
                return me;
            },
            end: function() {
                var me = this;
                if (!me.destroyed && me.processing) {
                    delete me.processing;
                    delete me.createdAt;
                    runCleaner();
                }
                return me;
            },
            addHeaders: function(headers) {
                var me = this, CORE = LIBCORE;
                var current, contentType;
                headers = HEADER.parse(headers);
                if (headers) {
                    current = me.headers;
                    if (CORE.object(current)) {
                        CORE.assign(current, headers);
                    } else {
                        me.headers = headers;
                    }
                    contentType = me.header("content-type");
                    if (contentType) {
                        me.contentType = contentType;
                    } else {
                        delete me.contenType;
                    }
                }
                return this;
            },
            header: function(name) {
                var me = this, current = me.headers, CORE = LIBCORE;
                if (CORE.string(name) && CORE.object(current)) {
                    name = HEADER.headerName(name);
                    if (CORE.contains(current, name)) {
                        return current[name];
                    }
                }
                return null;
            },
            destroy: function() {
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
            method: "get",
            constructor: Request,
            response: null,
            aborted: false,
            timeout: 0,
            config: null,
            queryTransformer: "application/x-www-form-urlencoded",
            queryAllowed: true,
            allowedPayload: true,
            getUrl: function() {
                var me = this, isString = LIBCORE.string, transform = TRANSFORMER.transform, url = me.url, query = me.query, data = me.data, transformerType = me.queryTransformer, apply = applyQueryString;
                if (me.queryAllowed && isString(url) && isString(transformerType)) {
                    query = transform(transformerType, false, query)[1];
                    if (isString(query)) {
                        url = apply(url, query);
                    }
                    if (me.allowedPayload === false) {
                        data = transform(transformerType, false, data)[1];
                        if (isString(data)) {
                            url = apply(url, data);
                        }
                    }
                }
                return url;
            },
            settings: function(name) {
                var config = this.config, CORE = LIBCORE;
                if (CORE.object(config) && CORE.contains(config, name)) {
                    return config[name];
                }
                return void 0;
            },
            process: function() {
                var me = this, result = TRANSFORMER.transform(me.header("content-type"), false, me.data), headers = result[0], responseType = me.responseType, response = me.response;
                if (headers) {
                    me.addHeaders(headers);
                }
                if (me.allowedPayload === false) {
                    delete me.body;
                } else {
                    me.body = result[1];
                }
                if (response) {
                    response.destroy();
                }
                me.response = response = new Response();
                if (LIBCORE.string(responseType)) {
                    response.addHeaders("Content-type: " + responseType);
                }
                response.request = me;
                response.begin();
                result = null;
            }
        });
        Response.prototype = LIBCORE.instantiate(Operation, {
            constructor: Response,
            status: 0,
            statusText: "Uninitialized",
            process: function() {
                var me = this, result = TRANSFORMER.transform(me.header("content-type"), true, me.body), headers = result[0];
                if (headers) {
                    me.addHeaders(headers);
                }
                me.data = result[1];
            }
        });
        LIBDOM.destructor(destructor);
        module.exports = Request;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var LIBCORE = __webpack_require__(2), LINE_SPLIT_RE = /\r\n|\r|\n/, LINE_PAIR_RE = /^([^ \r\n\t\s\:]+)\:(.+)$/, LINE_EXTENSION_RE = /^([ \r\n\t\s]+.+|[^\:]+)$/, LINE_REQUEST_RE = /^([a-z]+)[ \t\s]+(\/[^\:]+)[ \t\s]+(HTTP\/[0-9]+\.[0-9]+)$/i, LINE_RESPONSE_RE = /^(HTTP\/[0-9]+.[0-9]+)[ \t\s]+([0-9]+)[ \t\s]+([a-z0-9\-\_]+)$/i, LINE_TRIM = /^[ \t\s]*(.+)[ \t\s]*$/, MULTI_VALUE_RE = /Set\-cookie/i, EXPORTS = {
            each: eachHeader,
            parse: parse,
            headerName: normalizeHeaderName
        };
        function normalizeHeaderName(name) {
            if (!name) {
                return "";
            }
            return name.charAt(0).toUpperCase() + name.substring(1, name.length).toLowerCase();
        }
        function parseHeaderString(str, callback, scope) {
            var lines = str.split(LINE_SPLIT_RE), pairRe = LINE_PAIR_RE, extensionRe = LINE_EXTENSION_RE, requestRe = LINE_REQUEST_RE, responseRe = LINE_RESPONSE_RE, trimRe = LINE_TRIM, multivalueRe = MULTI_VALUE_RE, separator = ":", trimReplace = "$1", contains = LIBCORE.contains, normalize = normalizeHeaderName, l = lines.length, c = -1, headers = {}, names = [], nl = 0, name = null;
            var line, index, value, values, exist;
            if (typeof scope === "undefined") {
                scope = null;
            }
            for (;l--; ) {
                line = lines[++c];
                if (!c && requestRe.test(line) || responseRe.test(line)) {
                    names[nl++] = "";
                    headers[""] = line;
                    continue;
                }
                if (pairRe.test(line)) {
                    index = line.indexOf(separator);
                    name = line.substring(0, index);
                    value = line.substring(index + 1, line.length).replace(trimRe, trimReplace);
                    if (!value) {
                        continue;
                    }
                    name = normalize(name);
                    exist = contains(headers, name);
                    if (!exist) {
                        names[nl++] = name;
                    }
                    if (multivalueRe.test(name)) {
                        if (!exist) {
                            headers[name] = [];
                        }
                        values = headers[name];
                        values[values.length] = value;
                    } else {
                        headers[name] = value;
                    }
                } else if (name && extensionRe.test(line)) {
                    value = line.replace(trimRe, trimReplace);
                    if (multivalueRe.test(name)) {
                        values = headers[name];
                        values[values.length - 1] += " " + value;
                    } else {
                        headers[name] += " " + value;
                    }
                }
            }
            for (c = -1, l = names.length; l--; ) {
                name = names[++c];
                callback.call(scope, name, headers[name]);
            }
        }
        function eachHeader(input, callback, scope, current) {
            var CORE = LIBCORE, isString = CORE.string, isNumber = CORE.number, isArray = CORE.array, contains = CORE.contains, clean = cleanArrayValues, multivalueRe = MULTI_VALUE_RE, normalize = normalizeHeaderName;
            var name, value, len;
            if (CORE.array(input)) {
                input = clean(input.slice(0)).join("\r\n");
            }
            if (isString(input)) {
                parseHeaderString(input, callback, scope, current);
            } else if (CORE.object(input)) {
                if (typeof scope === "undefined") {
                    scope = null;
                }
                for (name in input) {
                    if (contains(input, name)) {
                        value = input[name];
                        name = normalize(name);
                        if (isString(value) || isNumber(value)) {
                            callback.call(scope, name, multivalueRe.test(name) ? [ value ] : value);
                        } else if (isArray(value)) {
                            value = clean(value.slice(0));
                            if (!multivalueRe.test(name)) {
                                len = value.length;
                                value = len ? value[len - 1] : "";
                            }
                            if (value.length) {
                                callback.call(scope, name, value);
                            }
                        }
                    }
                }
            } else {
                return false;
            }
            return true;
        }
        function parse(headers) {
            var values = {};
            return eachHeader(headers, parseCallback, values) && values;
        }
        function parseCallback(name, values) {
            this[name] = values;
        }
        function cleanArrayValues(array) {
            var CORE = LIBCORE, isString = CORE.string, isNumber = CORE.number, l = array.length;
            var value;
            for (;l--; ) {
                value = array[l];
                if (isNumber(value)) {
                    array[l] = value.toString(10);
                } else if (!isString(value)) {
                    array.splice(l, 1);
                }
            }
            return array;
        }
        module.exports = EXPORTS;
    }, function(module, exports, __webpack_require__) {
        (function(global) {
            "use strict";
            var LIBCORE = __webpack_require__(2), BASE = __webpack_require__(17), MIDDLEWARE = LIBCORE.middleware("libdom-http.driver.xhr"), STATE_UNSENT = 0, STATE_OPENED = 1, STATE_HEADERS_RECEIVED = 2, STATE_LOADING = 3, STATE_DONE = 4, BASE_PROTOTYPE = BASE.prototype;
            function applyHeader(value, name) {
                var me = this;
                var c, l;
                if (!LIBCORE.array(value)) {
                    value = [ value ];
                }
                for (c = -1, l = value.length; l--; ) {
                    me.setRequestHeader(name, value[++c]);
                }
            }
            function Xhr() {
                var me = this, args = [ me ];
                BASE.apply(me, arguments);
                MIDDLEWARE.run("after:instantiated", args);
                args = args[0] = null;
            }
            Xhr.prototype = LIBCORE.instantiate(BASE, {
                level: 1,
                bindMethods: BASE_PROTOTYPE.bindMethods.concat([ "onReadyStateChange" ]),
                constructor: Xhr,
                onReadyStateChange: function() {
                    var me = this, request = me.request, xhr = request.xhrTransport, run = MIDDLEWARE.run, args = [ me, request ], resolve = request.resolve, reject = request.reject;
                    var status;
                    if (!request.aborted && resolve && reject) {
                        run("before:readystatechange", args);
                        switch (xhr.readyState) {
                          case STATE_UNSENT:
                          case STATE_OPENED:
                          case STATE_HEADERS_RECEIVED:
                          case STATE_LOADING:
                            break;

                          case STATE_DONE:
                            status = xhr.status;
                            if (status < 200 || status > 299) {
                                reject(status);
                            } else {
                                resolve(status);
                            }
                        }
                        run("after:statechange", args);
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
                onSetup: function(request) {
                    var me = this, args = [ me, request ], run = MIDDLEWARE.run, xhr = new global.XMLHttpRequest();
                    request.xhrTransport = xhr;
                    run("before:setup", args);
                    xhr.onreadystatechange = me.onReadyStateChange;
                    xhr.open(request.method.toUpperCase(), request.getUrl(), true);
                    run("after:setup", args);
                    xhr = args = args[0] = args[1] = null;
                },
                onTransport: function(request) {
                    var me = this, CORE = LIBCORE, xhr = request.xhrTransport, headers = request.headers, args = [ me, request ];
                    MIDDLEWARE.run("before:request", args);
                    request.transportPromise = me.createTransportPromise(request);
                    headers = request.headers;
                    if (CORE.object(headers)) {
                        CORE.each(headers, applyHeader, xhr);
                    }
                    xhr.send(request.body);
                    MIDDLEWARE.run("after:request", args);
                    xhr = args = args[0] = args[1] = null;
                },
                onSuccess: function(request) {
                    var me = this, xhr = request.xhrTransport, response = request.response, args = [ me, request ], run = MIDDLEWARE.run;
                    response.status = xhr.status;
                    response.statusText = xhr.statusText;
                    response.addHeaders(xhr.getAllResponseHeaders());
                    response.body = xhr.responseText;
                    run("after:response", args);
                    xhr = args = args[0] = args[1] = null;
                },
                onCleanup: function(request) {
                    var me = this, xhr = request.xhrTransport;
                    var args;
                    if (xhr) {
                        args = [ me, request ];
                        MIDDLEWARE.run("after:cleanup", args);
                        args = args[0] = args[1] = xhr = xhr.onreadystatechange = null;
                    }
                    request.transportPromise = request.resolve = request.reject = request.xhrTransport = xhr = null;
                }
            });
            module.exports = Xhr;
        }).call(exports, function() {
            return this;
        }());
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var LIBCORE = __webpack_require__(2);
        function bind(instance, method) {
            function bound() {
                return method.apply(instance, arguments);
            }
            return bound;
        }
        function Driver() {
            var me = this, list = this.bindMethods, len = list.length, bindMethod = bind;
            var name;
            for (;len--; ) {
                name = list[len];
                me[name] = bindMethod(me, me[name]);
            }
        }
        Driver.prototype = {
            bindMethods: [ "setup", "transport", "process", "success", "error" ],
            aborted: false,
            request: null,
            response: null,
            constructor: Driver,
            onSetup: function(request) {},
            onTransport: function(request) {},
            onCleanup: function(request) {},
            onSuccess: function(request, status) {},
            onError: function(status) {},
            setup: function(request) {
                var me = this;
                me.request = request;
                me.onSetup(request);
                request.process();
                me.response = request.response;
                return request;
            },
            transport: function(request) {
                var transportPromise;
                this.onTransport(request);
                transportPromise = request.transportPromise;
                if (transportPromise && LIBCORE.method(transportPromise.then)) {
                    request.begin();
                    return transportPromise;
                }
                return Promise.reject(610);
            },
            success: function(status) {
                var me = this, request = me.request, response = request && request.response;
                if (status === 0 || status < 200 && status > 299 || !request || !response) {
                    return me.error(status);
                }
                me.onSuccess(request, status);
                response.process();
                request.end();
                response.end();
                request.transportPromise = null;
                me.onCleanup(request, response);
                delete me.request;
                return response;
            },
            error: function(status) {
                var me = this, request = me.request, response = request && request.response;
                me.onError(status);
                if (request) {
                    request.transportPromise = null;
                    me.onCleanup(request);
                    request.end();
                }
                if (response) {
                    response.end();
                }
                delete me.request;
                return Promise.reject(status);
            },
            abort: function() {}
        };
        module.exports = Driver;
    }, function(module, exports, __webpack_require__) {
        (function(global) {
            "use strict";
            var LIBCORE = __webpack_require__(2), LIBDOM = __webpack_require__(4), DETECT = __webpack_require__(3), MIDDLEWARE = LIBCORE.middleware("libdom-http.driver.xhr"), register = MIDDLEWARE.register, BEFORE_REQUEST = "before:request", XHR = __webpack_require__(16), PROTOTYPE = XHR.prototype, BINDS = PROTOTYPE.bindMethods, BIND_LENGTH = BINDS.length, PROGRESS = DETECT.xhrbytes, features = 0;
            function addTimeout(instance, request) {
                var timeout = request.settings("timeout");
                if (LIBCORE.number(timeout) && timeout > 10) {
                    request.xhrTransport.timeout = timeout;
                }
            }
            function addWithCredentials(instance, request) {
                if (request.settings("withCredentials") === true) {
                    request.xhrTransport.withCredentials = true;
                }
            }
            function onProgress(event) {
                var instance = this, request = instance.request, api = request.api;
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
                LIBDOM.on(request.xhrTransport, "progress", instance.onProgress);
            }
            function cleanup(instance, request) {
                if (PROGRESS) {
                    LIBDOM.un(request.xhrTransport, "progress", instance.onProgress);
                }
            }
            function processFormData(instance, request) {
                if (request.body instanceof global.FormData) {
                    delete request.headers["Content-type"];
                }
            }
            if (DETECT.xhrx) {
                features++;
                register(BEFORE_REQUEST, addWithCredentials);
            }
            if (DETECT.formdata) {
                features++;
                register(BEFORE_REQUEST, processFormData);
            }
            if (PROGRESS) {
                features++;
                BINDS[BIND_LENGTH++] = "onProgress";
                PROTOTYPE.onProgress = onProgress;
                register(BEFORE_REQUEST, addProgressEvent);
            }
            if (DETECT.xhrtime) {
                register(BEFORE_REQUEST, addTimeout);
            }
            if (features) {
                if (features > 2) {
                    PROTOTYPE.level = 2;
                }
                register("cleanup", cleanup);
            }
            module.exports = XHR;
        }).call(exports, function() {
            return this;
        }());
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var LIBCORE = __webpack_require__(2);
        function convert(data) {
            var CORE = LIBCORE;
            if (CORE.number(data)) {
                data = data.toString(10);
            }
            return [ "Content-type: text/plain", CORE.string(data) ? data : "" ];
        }
        module.exports = convert;
    }, function(module, exports, __webpack_require__) {
        (function(global) {
            "use strict";
            var LIBCORE = __webpack_require__(2), HELP = __webpack_require__(9);
            function appendFormData(operation, name, value, type, fieldType) {
                var formData = operation.returnValue, isString = LIBCORE.string;
                var list, c, l, filename;
                if (type === "field") {
                    if (fieldType === "file") {
                        list = value.files;
                        for (c = -1, l = list.length; l--; ) {
                            value = list[++c];
                            filename = value.name;
                            if (isString(filename)) {
                                formData.append(name, value, filename);
                            } else {
                                formData.append(name, value);
                            }
                        }
                        formData = null;
                        return;
                    }
                    value = value.value;
                }
                if (typeof value === "number") {
                    value = isFinite(value) ? value.toString(10) : "";
                } else if (typeof value !== "string") {
                    value = HELP.jsonify(value);
                }
                formData.append(name, value);
                formData = null;
            }
            function convert(data) {
                return [ null, HELP.each(data, appendFormData, {
                    returnValue: new global.FormData()
                }) ];
            }
            module.exports = convert;
        }).call(exports, function() {
            return this;
        }());
    }, function(module, exports, __webpack_require__) {
        (function(global) {
            "use strict";
            var LIBCORE = __webpack_require__(2), LIBDOM = __webpack_require__(4), HELP = __webpack_require__(9), BASE = __webpack_require__(17), BASE_PROTOTYPE = BASE.prototype, RESPONSE_TRIM = /(^<pre>|<\/pre>$)/gi, FILE_UPLOAD_GEN = 0;
            function createForm(method, url, contentType, blankDocument) {
                var doc = global.document, id = "libdom-http-oldschool-form" + ++FILE_UPLOAD_GEN, div = doc.createElement("div");
                var iframe;
                div.style.cssText = [ "visibility: hidden", "position: fixed", "top: -10px", "left: -10px", "overflow: hidden", "height: 1px", "width: 1px" ].join(";");
                div.innerHTML = [ '<form id="', id, '"', ' method="', method.toUpperCase(), '"', ' action="', encodeURI(url), '"', ' target="', id, '-result"', ' enctype="', contentType, '"', ' encoding="', contentType, '"', ' data-readystate="uninitialized">', '<iframe name="', id, '-result"', ' id="', id, '-result">', ' src="' + blankDocument + '">', "</iframe>", "</form>" ].join("");
                iframe = div.firstChild.firstChild;
                LIBDOM.on(iframe, "load", frameFirstOnloadEvent);
                doc.body.appendChild(div);
                doc = div = iframe = null;
                return id;
            }
            function frameFirstOnloadEvent(event) {
                var DOM = LIBDOM, target = event.target, form = target.parentNode;
                DOM.un(target, "load", frameFirstOnloadEvent);
                form.setAttribute("data-readystate", "ready");
                DOM.dispatch(form, "libdom-http-ready", {});
                DOM = target = form = null;
            }
            function getForm(id) {
                return global.document.getElementById(id);
            }
            function createField(operation, name, value, type, fieldType) {
                var CORE = LIBCORE, impostors = operation.impostors, fragment = operation.fragment, isField = type === "field", isFile = isField && fieldType === "file", input = null;
                var parent;
                if (isFile && value.value) {
                    parent = value.parentNode;
                    if (parent) {
                        input = value.cloneNode();
                        input.disabled = true;
                        input.readOnly = true;
                        impostors[impostors.length] = [ value, input ];
                        LIBDOM.replace(value, input);
                    }
                    input = value;
                    operation.files = true;
                } else if (!isFile) {
                    if (isField) {
                        value = value.value;
                    }
                    if (value === "number") {
                        value = isFinite(value) ? value.toString(10) : "";
                    } else if (!CORE.string(value)) {
                        value = HELP.jsonify(value);
                    }
                    input = fragment.ownerDocument.createElement("input");
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
                for (l = impostors.length; l--; ) {
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
                BASE.apply(me, arguments);
            }
            FormUpload.prototype = LIBCORE.instantiate(BASE, {
                constructor: FormUpload,
                blankDocument: "about:blank",
                defaultType: "application/json",
                bindMethods: BASE_PROTOTYPE.bindMethods.concat([ "onFormReady", "onFormDeferredSubmit", "onRespond" ]),
                createTransportPromise: function(request) {
                    function bind(resolve, reject) {
                        var local = request;
                        local.resolve = resolve;
                        local.reject = reject;
                    }
                    return new Promise(bind);
                },
                onFormReady: function() {
                    var me = this, DOM = LIBDOM, request = me.request, form = request.form;
                    DOM.un(form, "libdom-http-ready", me.onFormReady);
                    form.enctype = form.encoding = request.contentType;
                    request.deferredSubmit = global.setTimeout(me.onFormDeferredSubmit, 10);
                    form = null;
                },
                onFormDeferredSubmit: function() {
                    var me = this, request = me.request, form = request && request.form;
                    if (form) {
                        LIBDOM.on(request.iframe, "load", me.onRespond);
                        form.submit();
                    } else if (request) {
                        request.reject(408);
                    }
                    request = form = null;
                },
                onRespond: function() {
                    var me = this, request = me.request, iframe = request.iframe, success = false, docBody = "";
                    LIBDOM.un(iframe, "load", me.onRespond);
                    try {
                        docBody = iframe.contentWindow.document.body.innerHTML;
                        success = true;
                    } catch (e) {}
                    if (success) {
                        request.formResponse = docBody.replace(RESPONSE_TRIM, "");
                        request.resolve(200);
                    } else {
                        request.reject(406);
                    }
                    iframe = null;
                },
                onSetup: function(request) {
                    var me = this, CORE = LIBCORE, impostors = [], id = createForm(request.method, request.getUrl(), request.contentType, me.blankDocument), form = getForm(id), operation = {
                        impostors: impostors,
                        fragment: global.document.createDocumentFragment(),
                        files: false,
                        driver: me,
                        request: request
                    }, currentResponseType = request.responseType;
                    HELP.each(request.data, createField, operation);
                    form.appendChild(operation.fragment);
                    request.form = form;
                    request.iframe = form.firstChild;
                    request.impostors = operation.impostors;
                    request.fileUpload = operation.files;
                    if (!CORE.string(currentResponseType)) {
                        request.responseType = me.defaultType;
                    }
                    CORE.clear(operation);
                    request.transportPromise = me.createTransportPromise(request);
                    form = null;
                },
                onTransport: function(request) {
                    var form = request.form, contentType = "application/x-www-form-urlencoded";
                    if (request.fileUpload) {
                        contentType = "multipart/form-data";
                    }
                    request.addHeaders("Content-type: " + contentType);
                    if (form.getAttribute("data-readystate") === "ready") {
                        this.onFormReady();
                    } else {
                        LIBDOM.on(form, "libdom-http-ready", this.onFormReady);
                    }
                },
                onSuccess: function(request) {
                    var me = this, response = me.response, responseBody = request.formResponse;
                    if (LIBCORE.string(responseBody)) {
                        response.body = responseBody;
                    }
                },
                onCleanup: function(request) {
                    var impostors = request.impostors, form = request.form;
                    if (LIBCORE.array(impostors)) {
                        revertImpostors(impostors);
                    }
                    if (form) {
                        LIBDOM.remove(form.parentNode || form);
                    }
                    request.transportPromise = request.resolve = request.reject = request.form = form = null;
                }
            });
            module.exports = FormUpload;
        }).call(exports, function() {
            return this;
        }());
    } ]);
});

