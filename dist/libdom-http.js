(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === "object" && typeof module === "object") module.exports = factory(require(undefined)); else if (typeof define === "function" && define.amd) define("libdom-http", [], factory); else if (typeof exports === "object") exports["libdom-http"] = factory(require(undefined)); else root["libdom-http"] = factory(root[undefined]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_15__) {
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
            var LIBCORE = __webpack_require__(2), DETECT = __webpack_require__(14), DRIVER = __webpack_require__(16), TRANSFORMER = __webpack_require__(17), REQUEST = __webpack_require__(24), rehash = LIBCORE.rehash, driverRegister = DRIVER.register, transformRegister = TRANSFORMER.register, EXPORTS = REQUEST.request;
            if (!global.libdom) {
                throw new Error("libdom package is not found! unable to load http module");
            }
            global.libdom.http = EXPORTS;
            if (DETECT.xhr) {
                driverRegister("xhr", __webpack_require__(27));
                driverRegister("xhr2", __webpack_require__(29));
            }
            transformRegister("text/plain", true, __webpack_require__(30));
            if (DETECT.formdata) {
                transformRegister("multipart/form-data", false, __webpack_require__(31));
            }
            if (LIBCORE.env.browser) {
                driverRegister("form-upload", DETECT.xhr && DETECT.file && DETECT.blob ? __webpack_require__(29) : __webpack_require__(32));
            }
            rehash(EXPORTS, REQUEST, {
                request: "request"
            });
            rehash(EXPORTS, DRIVER, {
                driver: "register",
                use: "use"
            });
            rehash(EXPORTS, __webpack_require__(26), {
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
    }, function(module, exports, __webpack_require__) {
        "use strict";
        module.exports = __webpack_require__(3);
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var DETECT = __webpack_require__(4), OBJECT = __webpack_require__(6), PROCESSOR = __webpack_require__(9), EXPORTS = {
            env: DETECT
        };
        OBJECT.assign(EXPORTS, __webpack_require__(7));
        OBJECT.assign(EXPORTS, OBJECT);
        OBJECT.assign(EXPORTS, __webpack_require__(10));
        OBJECT.assign(EXPORTS, __webpack_require__(8));
        OBJECT.assign(EXPORTS, PROCESSOR);
        OBJECT.assign(EXPORTS, __webpack_require__(11));
        OBJECT.assign(EXPORTS, __webpack_require__(12));
        PROCESSOR.chain = EXPORTS;
        EXPORTS.Promise = __webpack_require__(13);
        module.exports = EXPORTS["default"] = EXPORTS;
    }, function(module, exports, __webpack_require__) {
        (function(global) {
            "use strict";
            var ROOT = global, doc = ROOT.document, win = ROOT.window, toString = Object.prototype.toString, objectSignature = "[object Object]", BROWSER = !!doc && !!win && win.self === (doc.defaultView || doc.parentWindow), NODEVERSIONS = BROWSER ? false : function() {
                return __webpack_require__(5).versions || false;
            }(), CONSOLE = {}, CONSOLE_NAMES = [ "log", "info", "warn", "error", "assert" ], EXPORTS = {
                browser: BROWSER,
                nodejs: NODEVERSIONS && !!NODEVERSIONS.node,
                userAgent: BROWSER ? ROOT.navigator.userAgent : NODEVERSIONS ? nodeUserAgent() : "Unknown",
                validSignature: toString.call(null) !== objectSignature || toString.call(void 0) !== objectSignature,
                ajax: ROOT.XMLHttpRequest,
                indexOfSupport: "indexOf" in Array.prototype
            };
            var c, l;
            function nodeUserAgent() {
                var PROCESS = __webpack_require__(5), VERSIONS = NODEVERSIONS, str = [ "Node ", VERSIONS.node, "(", PROCESS.platform, "; V8 ", VERSIONS.v8 || "unknown", "; arch ", PROCESS.arch, ")" ];
                return str.join("");
            }
            function empty() {}
            if (!ROOT.console) {
                for (c = 0, l = CONSOLE_NAMES.length; l--; c++) {
                    CONSOLE[CONSOLE_NAMES[c]] = empty;
                }
            }
            module.exports = EXPORTS;
            ROOT = win = doc = null;
        }).call(exports, function() {
            return this;
        }());
    }, function(module, exports) {
        var process = module.exports = {};
        var cachedSetTimeout;
        var cachedClearTimeout;
        function defaultSetTimout() {
            throw new Error("setTimeout has not been defined");
        }
        function defaultClearTimeout() {
            throw new Error("clearTimeout has not been defined");
        }
        (function() {
            try {
                if (typeof setTimeout === "function") {
                    cachedSetTimeout = setTimeout;
                } else {
                    cachedSetTimeout = defaultSetTimout;
                }
            } catch (e) {
                cachedSetTimeout = defaultSetTimout;
            }
            try {
                if (typeof clearTimeout === "function") {
                    cachedClearTimeout = clearTimeout;
                } else {
                    cachedClearTimeout = defaultClearTimeout;
                }
            } catch (e) {
                cachedClearTimeout = defaultClearTimeout;
            }
        })();
        function runTimeout(fun) {
            if (cachedSetTimeout === setTimeout) {
                return setTimeout(fun, 0);
            }
            if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
                cachedSetTimeout = setTimeout;
                return setTimeout(fun, 0);
            }
            try {
                return cachedSetTimeout(fun, 0);
            } catch (e) {
                try {
                    return cachedSetTimeout.call(null, fun, 0);
                } catch (e) {
                    return cachedSetTimeout.call(this, fun, 0);
                }
            }
        }
        function runClearTimeout(marker) {
            if (cachedClearTimeout === clearTimeout) {
                return clearTimeout(marker);
            }
            if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
                cachedClearTimeout = clearTimeout;
                return clearTimeout(marker);
            }
            try {
                return cachedClearTimeout(marker);
            } catch (e) {
                try {
                    return cachedClearTimeout.call(null, marker);
                } catch (e) {
                    return cachedClearTimeout.call(this, marker);
                }
            }
        }
        var queue = [];
        var draining = false;
        var currentQueue;
        var queueIndex = -1;
        function cleanUpNextTick() {
            if (!draining || !currentQueue) {
                return;
            }
            draining = false;
            if (currentQueue.length) {
                queue = currentQueue.concat(queue);
            } else {
                queueIndex = -1;
            }
            if (queue.length) {
                drainQueue();
            }
        }
        function drainQueue() {
            if (draining) {
                return;
            }
            var timeout = runTimeout(cleanUpNextTick);
            draining = true;
            var len = queue.length;
            while (len) {
                currentQueue = queue;
                queue = [];
                while (++queueIndex < len) {
                    if (currentQueue) {
                        currentQueue[queueIndex].run();
                    }
                }
                queueIndex = -1;
                len = queue.length;
            }
            currentQueue = null;
            draining = false;
            runClearTimeout(timeout);
        }
        process.nextTick = function(fun) {
            var args = new Array(arguments.length - 1);
            if (arguments.length > 1) {
                for (var i = 1; i < arguments.length; i++) {
                    args[i - 1] = arguments[i];
                }
            }
            queue.push(new Item(fun, args));
            if (queue.length === 1 && !draining) {
                runTimeout(drainQueue);
            }
        };
        function Item(fun, array) {
            this.fun = fun;
            this.array = array;
        }
        Item.prototype.run = function() {
            this.fun.apply(null, this.array);
        };
        process.title = "browser";
        process.browser = true;
        process.env = {};
        process.argv = [];
        process.version = "";
        process.versions = {};
        function noop() {}
        process.on = noop;
        process.addListener = noop;
        process.once = noop;
        process.off = noop;
        process.removeListener = noop;
        process.removeAllListeners = noop;
        process.emit = noop;
        process.binding = function(name) {
            throw new Error("process.binding is not supported");
        };
        process.cwd = function() {
            return "/";
        };
        process.chdir = function(dir) {
            throw new Error("process.chdir is not supported");
        };
        process.umask = function() {
            return 0;
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var O = Object.prototype, TYPE = __webpack_require__(7), STRING = __webpack_require__(8), OHasOwn = O.hasOwnProperty, NUMERIC_RE = /^[0-9]*$/;
        function empty() {}
        function assign(target, source, defaults) {
            var onAssign = apply, eachProperty = each;
            if (defaults) {
                eachProperty(defaults, onAssign, target);
            }
            eachProperty(source, onAssign, target);
            return target;
        }
        function apply(value, name) {
            this[name] = value;
        }
        function assignProperties(target, source, access) {
            var context = [ target, source ];
            each(access, applyProperties, context);
            context = context[0] = context[1] = null;
            return target;
        }
        function applyProperties(value, name) {
            var target = this;
            target[0][name] = target[1][value];
            target = null;
        }
        function assignAll(target, source, defaults) {
            var onAssign = apply, eachProperty = each;
            if (defaults) {
                eachProperty(defaults, onAssign, target, false);
            }
            eachProperty(source, onAssign, target);
            return target;
        }
        function each(subject, handler, scope, hasown) {
            var hasOwn = OHasOwn, noChecking = hasown === false;
            var name;
            if (scope === void 0) {
                scope = null;
            }
            for (name in subject) {
                if (noChecking || hasOwn.call(subject, name)) {
                    if (handler.call(scope, subject[name], name, subject) === false) {
                        break;
                    }
                }
            }
            return subject;
        }
        function contains(subject, property) {
            return OHasOwn.call(subject, property);
        }
        function clear(subject) {
            each(subject, applyClear, null, true);
            return subject;
        }
        function applyClear() {
            delete arguments[2][arguments[1]];
        }
        function fillin(target, source, hasown) {
            each(source, applyFillin, target, hasown);
            return target;
        }
        function applyFillin(value, name) {
            var target = this;
            if (!contains(target, name)) {
                target[name] = value;
            }
            target = null;
        }
        function jsonFill(root, path, value, overwrite) {
            var dimensions = STRING.jsonPath(path), type = TYPE, object = type.object, array = type.array, has = contains, apply = assign, numericRe = NUMERIC_RE, parent = root, name = path;
            var numeric, item, c, l, property, temp, isArray;
            if (dimensions) {
                name = dimensions[0];
                dimensions.splice(0, 1);
                for (c = -1, l = dimensions.length; l--; ) {
                    item = dimensions[++c];
                    numeric = numericRe.test(item);
                    if (has(parent, name)) {
                        property = parent[name];
                        isArray = array(property);
                        if (!isArray && !object(property)) {
                            if (numeric) {
                                property = [ property ];
                            } else {
                                temp = property;
                                property = {};
                                property[""] = temp;
                            }
                        } else if (isArray && !numeric) {
                            property = apply({}, property);
                            delete property.length;
                        }
                    } else {
                        property = numeric ? [] : {};
                    }
                    parent = parent[name] = property;
                    if (!item) {
                        if (array(parent)) {
                            item = parent.length;
                        } else if (0 in parent) {
                            item = "0";
                        }
                    }
                    name = item;
                }
            }
            if (overwrite !== true && has(parent, name)) {
                property = parent[name];
                if (array(property)) {
                    parent = property;
                    name = parent.length;
                } else {
                    parent = parent[name] = [ property ];
                    name = 1;
                }
            }
            parent[name] = value;
            parent = value = property = temp = null;
            return root;
        }
        function buildInstance(Class, overrides) {
            empty.prototype = Class.prototype;
            if (TYPE.object(overrides)) {
                return assign(new empty(), overrides);
            }
            return new empty();
        }
        function compare(object1, object2) {
            return compareLookback(object1, object2, []);
        }
        function compareLookback(object1, object2, references) {
            var T = TYPE, isObject = T.object, isArray = T.array, isRegex = T.regex, isDate = T.date, me = compareLookback, depth = references.length;
            var name, len;
            switch (true) {
              case object1 === object2:
                return true;

              case isObject(object1):
                if (!isObject(object2)) {
                    return false;
                }
                if (references.lastIndexOf(object1) !== -1 && references.lastIndexOf(object2) !== -1) {
                    return true;
                }
                references[depth] = object1;
                references[depth + 1] = object2;
                for (name in object1) {
                    if (!(name in object2) || !me(object1[name], object2[name], references)) {
                        return false;
                    }
                }
                for (name in object2) {
                    if (!(name in object1) || !me(object1[name], object2[name], references)) {
                        return false;
                    }
                }
                references.length = depth;
                return true;

              case isArray(object1):
                if (!isArray(object2)) {
                    return false;
                }
                if (references.lastIndexOf(object1) !== -1 && references.lastIndexOf(object2) !== -1) {
                    return true;
                }
                len = object1.length;
                if (len !== object2.length) {
                    return false;
                }
                references[depth] = object1;
                references[depth + 1] = object2;
                for (;len--; ) {
                    if (!me(object1[len], object2[len], references)) {
                        return false;
                    }
                }
                references.length = depth;
                return true;

              case isRegex(object1):
                return isRegex(object2) && object1.source === object2.source;

              case isDate(object1):
                return isDate(object2) && object1.toString() === object2.toString();
            }
            return false;
        }
        function clone(data, deep) {
            var T = TYPE, isNative = T.nativeObject(data);
            deep = deep === true;
            if (isNative || T.array(data)) {
                return deep ? (isNative ? cloneObject : cloneArray)(data, [], []) : isNative ? assignAll({}, data) : data.slice(0);
            }
            if (T.regex(data)) {
                return new RegExp(data.source, data.flags);
            } else if (T.date(data)) {
                return new Date(data.getFullYear(), data.getMonth(), data.getDate(), data.getHours(), data.getMinutes(), data.getSeconds(), data.getMilliseconds());
            }
            return data;
        }
        function cloneObject(data, parents, cloned) {
            var depth = parents.length, T = TYPE, isNativeObject = T.nativeObject, isArray = T.array, ca = cloneArray, co = cloneObject, recreated = {};
            var name, value, index, isNative;
            parents[depth] = data;
            cloned[depth] = recreated;
            for (name in data) {
                value = data[name];
                isNative = isNativeObject(value);
                if (isNative || isArray(value)) {
                    index = parents.lastIndexOf(value);
                    value = index === -1 ? (isNative ? co : ca)(value, parents, cloned) : cloned[index];
                } else {
                    value = clone(value, false);
                }
                recreated[name] = value;
            }
            parents.length = cloned.length = depth;
            return recreated;
        }
        function cloneArray(data, parents, cloned) {
            var depth = parents.length, T = TYPE, isNativeObject = T.nativeObject, isArray = T.array, ca = cloneArray, co = cloneObject, recreated = [], c = 0, l = data.length;
            var value, index, isNative;
            parents[depth] = data;
            cloned[depth] = recreated;
            for (;l--; c++) {
                value = data[c];
                isNative = isNativeObject(value);
                if (isNative || isArray(value)) {
                    index = parents.lastIndexOf(value);
                    value = index === -1 ? (isNative ? co : ca)(value, parents, cloned) : cloned[index];
                } else {
                    value = clone(value, false);
                }
                recreated[c] = value;
            }
            parents.length = cloned.length = depth;
            return recreated;
        }
        module.exports = {
            each: each,
            assign: assign,
            rehash: assignProperties,
            contains: contains,
            instantiate: buildInstance,
            clone: clone,
            compare: compare,
            fillin: fillin,
            urlFill: jsonFill,
            clear: clear
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var DETECTED = __webpack_require__(4), validSignature = DETECTED.validSignature, OBJECT_SIGNATURE = "[object Object]", OBJECT = Object, O = OBJECT.prototype, toString = O.toString, isSignature = validSignature ? objectSignature : ieObjectSignature;
        function objectSignature(subject) {
            return toString.call(subject);
        }
        function ieObjectSignature(subject) {
            if (subject === null) {
                return "[object Null]";
            } else if (subject === void 0) {
                return "[object Undefined]";
            }
            return toString.call(subject);
        }
        function isType(subject, type) {
            return isSignature(subject) === type;
        }
        function isObject(subject) {
            return toString.call(subject) === OBJECT_SIGNATURE;
        }
        function ieIsObject(subject) {
            return subject !== null && subject !== void 0 && toString.call(subject) === OBJECT_SIGNATURE;
        }
        function isNativeObject(subject) {
            var O = OBJECT;
            var constructor, result;
            if (isSignature(subject) === OBJECT_SIGNATURE) {
                constructor = subject.constructor;
                if (O.hasOwnProperty.call(subject, "constructor")) {
                    delete subject.constructor;
                    result = subject.constructor === O;
                    subject.constructor = constructor;
                    return result;
                }
                return constructor === O;
            }
            return false;
        }
        function isString(subject, allowEmpty) {
            return typeof subject === "string" && (allowEmpty === true || subject.length !== 0);
        }
        function isNumber(subject) {
            return typeof subject === "number" && isFinite(subject);
        }
        function isScalar(subject) {
            switch (typeof subject) {
              case "number":
                return isFinite(subject);

              case "boolean":
              case "string":
                return true;
            }
            return false;
        }
        function isFunction(subject) {
            return toString.call(subject) === "[object Function]";
        }
        function isArray(subject) {
            return toString.call(subject) === "[object Array]";
        }
        function isDate(subject) {
            return toString.call(subject) === "[object Date]";
        }
        function isRegExp(subject) {
            return toString.call(subject) === "[object RegExp]";
        }
        module.exports = {
            signature: isSignature,
            object: validSignature ? isObject : ieIsObject,
            nativeObject: isNativeObject,
            string: isString,
            number: isNumber,
            scalar: isScalar,
            array: isArray,
            method: isFunction,
            date: isDate,
            regex: isRegExp,
            type: isType
        };
    }, function(module, exports) {
        "use strict";
        var HALF_BYTE = 128, SIX_BITS = 63, ONE_BYTE = 255, fromCharCode = String.fromCharCode, BASE64_MAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", BASE64_EXCESS_REMOVE_RE = /[^a-zA-Z0-9\+\/]/, CAMEL_RE = /[^a-z]+[a-z]/gi, UNCAMEL_RE = /\-*[A-Z]/g;
        function base64Encode(str) {
            var map = BASE64_MAP, buffer = [], bl = 0, c = -1, excess = false, pad = map.charAt(64);
            var l, total, code, flag, end, chr;
            str = utf16ToUtf8(str);
            l = total = str.length;
            for (;l--; ) {
                code = str.charCodeAt(++c);
                flag = c % 3;
                switch (flag) {
                  case 0:
                    chr = map.charAt((code & 252) >> 2);
                    excess = (code & 3) << 4;
                    break;

                  case 1:
                    chr = map.charAt(excess | (code & 240) >> 4);
                    excess = (code & 15) << 2;
                    break;

                  case 2:
                    chr = map.charAt(excess | (code & 192) >> 6);
                    excess = code & 63;
                }
                buffer[bl++] = chr;
                end = !l;
                if (end || flag === 2) {
                    buffer[bl++] = map.charAt(excess);
                }
                if (!l) {
                    l = bl % 4;
                    for (l = l && 4 - l; l--; ) {
                        buffer[bl++] = pad;
                    }
                    break;
                }
            }
            return buffer.join("");
        }
        function base64Decode(str) {
            var map = BASE64_MAP, oneByte = ONE_BYTE, buffer = [], bl = 0, c = -1, code2str = fromCharCode;
            var l, code, excess, chr, flag;
            str = str.replace(BASE64_EXCESS_REMOVE_RE, "");
            l = str.length;
            for (;l--; ) {
                code = map.indexOf(str.charAt(++c));
                flag = c % 4;
                switch (flag) {
                  case 0:
                    chr = 0;
                    break;

                  case 1:
                    chr = (excess << 2 | code >> 4) & oneByte;
                    break;

                  case 2:
                    chr = (excess << 4 | code >> 2) & oneByte;
                    break;

                  case 3:
                    chr = (excess << 6 | code) & oneByte;
                }
                excess = code;
                if (!l && flag < 3 && chr < 64) {
                    break;
                }
                if (flag) {
                    buffer[bl++] = code2str(chr);
                }
            }
            return utf8ToUtf16(buffer.join(""));
        }
        function utf16ToUtf8(str) {
            var half = HALF_BYTE, sixBits = SIX_BITS, code2char = fromCharCode, utf8 = [], ul = 0, c = -1, l = str.length;
            var code;
            for (;l--; ) {
                code = str.charCodeAt(++c);
                if (code < half) {
                    utf8[ul++] = code2char(code);
                } else if (code < 2048) {
                    utf8[ul++] = code2char(192 | code >> 6);
                    utf8[ul++] = code2char(half | code & sixBits);
                } else if (code < 55296 || code > 57343) {
                    utf8[ul++] = code2char(224 | code >> 12);
                    utf8[ul++] = code2char(half | code >> 6 & sixBits);
                    utf8[ul++] = code2char(half | code & sixBits);
                } else {
                    l--;
                    code = 65536 + ((code & 1023) << 10 | str.charCodeAt(++c) & 1023);
                    utf8[ul++] = code2char(240 | code >> 18);
                    utf8[ul++] = code2char(half | code >> 12 & sixBits);
                    utf8[ul++] = code2char(half | code >> 6 & sixBits);
                    utf8[ul++] = code2char(half | code >> sixBits);
                }
            }
            return utf8.join("");
        }
        function utf8ToUtf16(str) {
            var half = HALF_BYTE, sixBits = SIX_BITS, code2char = fromCharCode, utf16 = [], M = Math, min = M.min, max = M.max, ul = 0, l = str.length, c = -1;
            var code, whatsLeft;
            for (;l--; ) {
                code = str.charCodeAt(++c);
                if (code < half) {
                    utf16[ul++] = code2char(code);
                } else if (code > 191 && code < 224) {
                    utf16[ul++] = code2char((code & 31) << 6 | str.charCodeAt(c + 1) & sixBits);
                    whatsLeft = max(min(l - 1, 1), 0);
                    c += whatsLeft;
                    l -= whatsLeft;
                } else if (code > 223 && code < 240) {
                    utf16[ul++] = code2char((code & 15) << 12 | (str.charCodeAt(c + 1) & sixBits) << 6 | str.charCodeAt(c + 2) & sixBits);
                    whatsLeft = max(min(l - 2, 2), 0);
                    c += whatsLeft;
                    l -= whatsLeft;
                } else {
                    code = ((code & 7) << 18 | (str.charCodeAt(c + 1) & sixBits) << 12 | (str.charCodeAt(c + 2) & sixBits) << 6 | str.charCodeAt(c + 3) & sixBits) - 65536;
                    utf16[ul++] = code2char(code >> 10 | 55296, code & 1023 | 56320);
                    whatsLeft = max(min(l - 3, 3), 0);
                    c += whatsLeft;
                    l -= whatsLeft;
                }
            }
            return utf16.join("");
        }
        function parseJsonPath(path) {
            var dimensions = [], dl = 0, buffer = [], bl = dl, TRUE = true, FALSE = false, started = FALSE, merge = FALSE;
            var c, l, item, last;
            for (c = -1, l = path.length; l--; ) {
                item = path.charAt(++c);
                last = !l;
                if (item === "[") {
                    if (started) {
                        break;
                    }
                    started = TRUE;
                    if (bl) {
                        merge = TRUE;
                    }
                } else if (item === "]") {
                    if (!started) {
                        break;
                    }
                    started = FALSE;
                    merge = TRUE;
                } else {
                    buffer[bl++] = item;
                    if (last) {
                        merge = TRUE;
                    }
                }
                if (merge) {
                    dimensions[dl++] = buffer.join("");
                    buffer.length = bl = 0;
                    merge = FALSE;
                }
                if (last) {
                    if (started || dl < 1) {
                        break;
                    }
                    return dimensions;
                }
            }
            return null;
        }
        function camelize(str) {
            return str.replace(CAMEL_RE, applyCamelize);
        }
        function applyCamelize(all) {
            return all.charAt(all.length - 1).toUpperCase();
        }
        function uncamelize(str) {
            return str.replace(UNCAMEL_RE, applyUncamelize);
        }
        function applyUncamelize(all) {
            return "-" + all.charAt(all.length - 1).toLowerCase();
        }
        module.exports = {
            encode64: base64Encode,
            decode64: base64Decode,
            utf2bin: utf16ToUtf8,
            bin2utf: utf8ToUtf16,
            jsonPath: parseJsonPath,
            camelize: camelize,
            uncamelize: uncamelize
        };
    }, function(module, exports, __webpack_require__) {
        (function(global) {
            "use strict";
            var TYPE = __webpack_require__(7), G = global, NAME_RE = /^(([^\.]+\.)*)((before|after)\:)?([a-zA-Z0-9\_\-\.]+)$/, POSITION_BEFORE = 1, POSITION_AFTER = 2, RUNNERS = {}, NAMESPACES = {}, EXPORTS = {
                register: set,
                run: run,
                middleware: middlewareNamespace,
                setAsync: G.setImmediate,
                clearAsync: G.clearImmediate
            };
            function set(name, handler) {
                var parsed = parseName(name), list = RUNNERS;
                var access, items;
                if (parsed && handler instanceof Function) {
                    name = parsed[1];
                    access = ":" + name;
                    if (!(access in list)) {
                        list[access] = {
                            name: name,
                            before: [],
                            after: []
                        };
                    }
                    items = list[access][getPositionAccess(parsed[0])];
                    items[items.length] = handler;
                }
                return EXPORTS.chain;
            }
            function run(name, args, scope) {
                var runners = get(name);
                var c, l;
                if (runners) {
                    if (typeof scope === "undefined") {
                        scope = null;
                    }
                    if (!(args instanceof Array)) {
                        args = [];
                    }
                    for (c = -1, l = runners.length; l--; ) {
                        runners[++c].apply(scope, args);
                    }
                }
                return EXPORTS.chain;
            }
            function get(name) {
                var list = RUNNERS, parsed = parseName(name);
                var access;
                if (parsed) {
                    access = ":" + parsed[1];
                    if (access in list) {
                        return list[access][getPositionAccess(parsed[0])];
                    }
                }
                return void 0;
            }
            function getPositionAccess(input) {
                return input === POSITION_BEFORE ? "before" : "after";
            }
            function parseName(name) {
                var match = TYPE.string(name) && name.match(NAME_RE);
                var position, namespace;
                if (match) {
                    namespace = match[1];
                    position = match[4] === "before" ? POSITION_BEFORE : POSITION_AFTER;
                    return [ position, (namespace || "") + match[5] ];
                }
                return void 0;
            }
            function middlewareNamespace(name) {
                var list = NAMESPACES;
                var access, register, run;
                if (TYPE.string(name)) {
                    access = name + ".";
                    if (!(access in list)) {
                        run = createRunInNamespace(access);
                        register = createRegisterInNamespace(access);
                        list[access] = register.chain = run.chain = {
                            run: run,
                            register: register
                        };
                    }
                    return list[access];
                }
                return void 0;
            }
            function createRunInNamespace(ns) {
                function nsRun(name, args, scope) {
                    run(ns + name, args, scope);
                    return nsRun.chain;
                }
                return nsRun;
            }
            function createRegisterInNamespace(ns) {
                function nsRegister(name, handler) {
                    set(ns + name, handler);
                    return nsRegister.chain;
                }
                return nsRegister;
            }
            function timeoutAsync(handler) {
                return setTimeout(handler, 1);
            }
            function clearTimeoutAsync(id) {
                return clearTimeout(id);
            }
            if (!(G.setImmediate instanceof Function)) {
                EXPORTS.setAsync = timeoutAsync;
                EXPORTS.clearAsync = clearTimeoutAsync;
            }
            module.exports = EXPORTS.chain = EXPORTS;
        }).call(exports, function() {
            return this;
        }());
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var DETECT = __webpack_require__(4), OBJECT = __webpack_require__(6), A = Array.prototype;
        function indexOf(subject) {
            var array = this, l = array.length, c = -1;
            for (;l--; ) {
                if (subject === array[++c]) {
                    array = null;
                    return c;
                }
            }
            return -1;
        }
        function lastIndexOf(subject) {
            var array = this, l = array.length;
            for (;l--; ) {
                if (subject === array[l]) {
                    array = null;
                    return l;
                }
            }
            return -1;
        }
        function union(array, array2, clone) {
            var subject, l, len, total;
            array = clone !== false ? array : array.slice(0);
            array.push.apply(array, array2);
            total = array.length;
            found: for (l = total; l--; ) {
                subject = array[l];
                for (len = total; len--; ) {
                    if (l !== len && subject === array[len]) {
                        total--;
                        array.splice(l, 1);
                        continue found;
                    }
                }
            }
            return array;
        }
        function intersect(array1, array2, clone) {
            var total1 = array1.length, total2 = array2.length;
            var subject, l1, l2;
            array1 = clone !== false ? array1 : array1.slice(0);
            found: for (l1 = total1; l1--; ) {
                subject = array1[l1];
                foundSame: for (l2 = total2; l2--; ) {
                    if (subject === array2[l2]) {
                        for (l2 = total1; l2--; ) {
                            if (l2 !== l1 && subject === array1[l2]) {
                                break foundSame;
                            }
                        }
                        continue found;
                    }
                }
                array1.splice(l1, 1);
                total1--;
            }
            return array1;
        }
        function difference(array1, array2, clone) {
            var total1 = array1.length, total2 = array2.length;
            var subject, l1, l2;
            array1 = clone !== false ? array1 : array1.slice(0);
            found: for (l1 = total1; l1--; ) {
                subject = array1[l1];
                for (l2 = total2; l2--; ) {
                    if (subject === array2[l2]) {
                        array1.splice(l1, 1);
                        total1--;
                        continue found;
                    }
                }
                for (l2 = total1; l2--; ) {
                    if (l2 !== l1 && subject === array1[l2]) {
                        array1.splice(l1, 1);
                        total1--;
                        continue found;
                    }
                }
            }
            return array1;
        }
        if (!DETECT.indexOfSupport) {
            OBJECT.assign(A, {
                indexOf: indexOf,
                lastIndexOf: lastIndexOf
            });
        }
        module.exports = {
            unionList: union,
            intersectList: intersect,
            differenceList: difference
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var TYPE = __webpack_require__(7), OBJECT = __webpack_require__(6);
        function create() {
            return new Registry();
        }
        function Registry() {
            this.data = {};
        }
        Registry.prototype = {
            constructor: Registry,
            get: function(name) {
                var list = this.data;
                if (OBJECT.contains(list, name)) {
                    return list[name];
                }
                return void 0;
            },
            set: function(name, value) {
                var list = this.data;
                if (TYPE.string(name) || TYPE.number(name)) {
                    list[name] = value;
                }
                return this;
            },
            unset: function(name) {
                var list = this.data;
                if (OBJECT.contains(list, name)) {
                    delete list[name];
                }
                return this;
            },
            exists: function(name) {
                return OBJECT.contains(this.data, name);
            },
            clear: function() {
                OBJECT.clear(this.data);
                return this;
            },
            clone: function() {
                var list = this.data;
                return OBJECT.clone(list, true);
            }
        };
        module.exports = {
            createRegistry: create
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var TYPE = __webpack_require__(7), OBJECT = __webpack_require__(6), NUMERIC_RE = /^([1-9][0-9]*|0)$/;
        function eachPath(path, callback, arg1, arg2, arg3, arg4) {
            var escape = "\\", dot = ".", buffer = [], bl = 0;
            var c, l, chr, apply, last;
            for (c = -1, l = path.length; l--; ) {
                chr = path.charAt(++c);
                apply = false;
                last = !l;
                switch (chr) {
                  case escape:
                    chr = "";
                    if (l) {
                        chr = path.charAt(++c);
                        l--;
                    }
                    break;

                  case dot:
                    chr = "";
                    apply = true;
                    break;
                }
                if (chr) {
                    buffer[bl++] = chr;
                }
                if (last || apply) {
                    if (bl) {
                        if (callback(buffer.join(""), last, arg1, arg2, arg3, arg4) === false) {
                            return;
                        }
                        buffer.length = bl = 0;
                    }
                }
            }
        }
        function isAccessible(subject, item) {
            var type = TYPE;
            switch (true) {
              case type.object(subject):
              case type.array(subject) && (!NUMERIC_RE.test(item) || item !== "length"):
                if (!OBJECT.contains(subject, item)) {
                    return false;
                }
            }
            return true;
        }
        function findCallback(item, last, operation) {
            var subject = operation[1];
            if (!isAccessible(subject, item)) {
                operation[0] = void 0;
                return false;
            }
            operation[last ? 0 : 1] = subject[item];
            return true;
        }
        function find(path, object) {
            var operation = [ void 0, object ];
            eachPath(path, findCallback, operation);
            operation[1] = null;
            return operation[0];
        }
        function clone(path, object, deep) {
            return OBJECT.clone(find(path, object), deep);
        }
        function getItemsCallback(item, last, operation) {
            operation[operation.length] = item;
        }
        function assign(path, subject, value, overwrite) {
            var type = TYPE, has = OBJECT.contains, array = type.array, object = type.object, apply = type.assign, parent = subject, numericRe = NUMERIC_RE;
            var items, c, l, item, name, numeric, property, isArray, temp;
            if (object(parent) || array(parent)) {
                eachPath(path, getItemsCallback, items = []);
                if (items.length) {
                    name = items[0];
                    items.splice(0, 1);
                    for (c = -1, l = items.length; l--; ) {
                        item = items[++c];
                        numeric = numericRe.test(item);
                        if (has(parent, name)) {
                            property = parent[name];
                            isArray = array(property);
                            if (!isArray && !object(property)) {
                                if (numeric) {
                                    property = [ property ];
                                } else {
                                    temp = property;
                                    property = {};
                                    property[""] = temp;
                                }
                            } else if (isArray && !numeric) {
                                property = apply({}, property);
                                delete property.length;
                            }
                        } else {
                            property = numeric ? [] : {};
                        }
                        parent = parent[name] = property;
                        name = item;
                    }
                    if (overwrite !== true && has(parent, name)) {
                        property = parent[name];
                        if (array(property)) {
                            parent = property;
                            name = parent.length;
                        } else {
                            parent = parent[name] = [ property ];
                            name = 1;
                        }
                    }
                    parent[name] = value;
                    parent = value = property = temp = null;
                    return true;
                }
            }
            return false;
        }
        function removeCallback(item, last, operation) {
            var subject = operation[0];
            var isLength;
            if (!isAccessible(subject, item)) {
                return false;
            }
            if (last) {
                if (TYPE.array(subject)) {
                    isLength = item === "length";
                    subject.splice(isLength ? 0 : item.toString(10), isLength ? subject.length : 1);
                } else {
                    delete subject[item];
                }
                operation[1] = true;
            } else {
                operation[0] = subject[item];
            }
        }
        function remove(path, object) {
            var operation = [ object, false ];
            eachPath(path, removeCallback, operation);
            operation[0] = null;
            return operation[1];
        }
        function compare(path, object1, object2) {
            return OBJECT.compare(find(path, object1), object1, object2);
        }
        module.exports = {
            jsonFind: find,
            jsonCompare: compare,
            jsonClone: clone,
            jsonEach: eachPath,
            jsonSet: assign,
            jsonUnset: remove
        };
    }, function(module, exports, __webpack_require__) {
        (function(global) {
            "use strict";
            var TYPE = __webpack_require__(7), OBJECT = __webpack_require__(6), PROCESSOR = __webpack_require__(9), slice = Array.prototype.slice, G = global, INDEX_STATUS = 0, INDEX_DATA = 1, INDEX_PENDING = 2;
            function isPromise(object) {
                var T = TYPE;
                return T.object(object) && T.method(object.then);
            }
            function createPromise(instance) {
                var Class = Promise;
                if (!(instance instanceof Class)) {
                    instance = OBJECT.instantiate(Class);
                }
                instance.__state = [ null, void 0, [], null, null ];
                return instance;
            }
            function resolveValue(data, callback) {
                function resolve(data) {
                    try {
                        callback(true, data);
                    } catch (error) {
                        callback(false, error);
                    }
                }
                if (isPromise(data)) {
                    data.then(resolve, function(error) {
                        callback(false, error);
                    });
                } else {
                    resolve(data);
                }
            }
            function finalizeValue(promise, success, data) {
                var state = promise.__state, list = state[INDEX_PENDING];
                state[INDEX_STATUS] = success;
                state[INDEX_DATA] = data;
                for (;list.length; ) {
                    list[0](success, data);
                    list.splice(0, 1);
                }
            }
            function Promise(tryout) {
                var instance = createPromise(this), finalized = false;
                function onFinalize(success, data) {
                    finalizeValue(instance, success, data);
                }
                function resolve(data) {
                    if (!finalized) {
                        finalized = true;
                        resolveValue(data, onFinalize);
                    }
                }
                function reject(error) {
                    if (!finalized) {
                        finalized = true;
                        onFinalize(false, error);
                    }
                }
                try {
                    tryout(resolve, reject);
                } catch (error) {
                    reject(error);
                }
                return instance;
            }
            function resolve(data) {
                return new Promise(function(resolve) {
                    resolve(data);
                });
            }
            function reject(reason) {
                return new Promise(function() {
                    arguments[1](reason);
                });
            }
            function all(promises) {
                var total;
                promises = slice.call(promises, 0);
                total = promises.length;
                if (!total) {
                    return resolve([]);
                }
                return new Promise(function(resolve, reject) {
                    var list = promises, remaining = total, stopped = false, l = remaining, c = 0, result = [];
                    function process(index, item) {
                        function finalize(success, data) {
                            var found = result;
                            if (stopped) {
                                return;
                            }
                            if (!success) {
                                reject(data);
                                stopped = true;
                                return;
                            }
                            found[index] = data;
                            if (!--remaining) {
                                resolve(found);
                            }
                        }
                        resolveValue(item, finalize);
                    }
                    for (result.length = l; l--; c++) {
                        process(c, list[c]);
                    }
                });
            }
            function race(promises) {
                promises = slice.call(promises, 0);
                return new Promise(function(resolve, reject) {
                    var stopped = false, tryResolve = resolveValue, list = promises, c = -1, l = list.length;
                    function onFulfill(success, data) {
                        if (!stopped) {
                            stopped = true;
                            (success ? resolve : reject)(data);
                        }
                    }
                    for (;l--; ) {
                        tryResolve(list[++c], onFulfill);
                    }
                });
            }
            Promise.prototype = {
                constructor: Promise,
                then: function(onFulfill, onReject) {
                    var me = this, state = me.__state, success = state[INDEX_STATUS], list = state[INDEX_PENDING], instance = createPromise();
                    function run(success, data) {
                        var handle = success ? onFulfill : onReject;
                        if (TYPE.method(handle)) {
                            try {
                                data = handle(data);
                                resolveValue(data, function(success, data) {
                                    finalizeValue(instance, success, data);
                                });
                                return;
                            } catch (error) {
                                data = error;
                                success = false;
                            }
                        }
                        finalizeValue(instance, success, data);
                    }
                    if (success === null) {
                        list[list.length] = run;
                    } else {
                        PROCESSOR.setAsync(function() {
                            run(success, state[INDEX_DATA]);
                        });
                    }
                    return instance;
                },
                catch: function(onReject) {
                    return this.then(null, onReject);
                }
            };
            OBJECT.assign(Promise, {
                all: all,
                race: race,
                reject: reject,
                resolve: resolve
            });
            if (!TYPE.method(G.Promise)) {
                G.Promise = Promise;
            }
            module.exports = Promise;
            G = null;
        }).call(exports, function() {
            return this;
        }());
    }, function(module, exports, __webpack_require__) {
        (function(global) {
            "use strict";
            var DOM = __webpack_require__(15), ENV = DOM.env, G = global, XHR = G.XMLHttpRequest, support_xhr = !!XHR, support_xhrx = false, support_xhrmime = false, support_xhrtime = false, support_xhrbin = false, support_xhrprogress = false, support_xdr = !!G.XDomainRequest;
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
        module.exports = __WEBPACK_EXTERNAL_MODULE_15__;
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
        var LIBCORE = __webpack_require__(2), TYPES = __webpack_require__(18), TRANSFORMERS = LIBCORE.createRegistry(), REQUEST_PREFIX = "request-", RESPONSE_PREFIX = "response-", EXPORTS = {
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
        item = __webpack_require__(19);
        register("application/json", false, item).register("text/x-json", false, item);
        item = __webpack_require__(21);
        register("application/json", true, item).register("text/x-json", true, item);
        register("application/x-www-form-urlencoded", false, __webpack_require__(22)).register("multipart/form-data", false, __webpack_require__(23));
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
        var LIBCORE = __webpack_require__(2), HELP = __webpack_require__(20);
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
            var LIBDOM = __webpack_require__(15), LIBCORE = __webpack_require__(2), TYPE_OBJECT = 1, TYPE_ARRAY = 2;
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
        var HELP = __webpack_require__(20);
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
        var HELP = __webpack_require__(20), EOL = "\r\n", BOUNDARY_LENGTH = 48;
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
        var LIBCORE = __webpack_require__(2), DRIVER = __webpack_require__(16), OPERATION = __webpack_require__(25), HELP = __webpack_require__(20), DEFAULTS = LIBCORE.createRegistry(), METHODS = [ "get", "post", "put", "patch", "delete", "options" ], ALLOWED_PAYLOAD = [ "post", "put", "patch" ], EXPORTS = {
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
                requestObject.item = item;
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
            requestObject.addHeaders(config.headers);
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
        var LIBCORE = __webpack_require__(2), LIBDOM = __webpack_require__(15), HEADER = __webpack_require__(26), TRANSFORMER = __webpack_require__(17), CLEANING = false, CLEAN_INTERVAL = 1e3, TTL = 1e4, RUNNING = false, OPERATIONS = [], URL_QUERY_STRING_RE = /^([^\?\#]+)(\?[^\?\#]*)?(\#.*)?$/;
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
            var LIBCORE = __webpack_require__(2), BASE = __webpack_require__(28), MIDDLEWARE = LIBCORE.middleware("libdom-http.driver.xhr"), STATE_UNSENT = 0, STATE_OPENED = 1, STATE_HEADERS_RECEIVED = 2, STATE_LOADING = 3, STATE_DONE = 4, BASE_PROTOTYPE = BASE.prototype;
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
            var LIBCORE = __webpack_require__(2), LIBDOM = __webpack_require__(15), DETECT = __webpack_require__(14), MIDDLEWARE = LIBCORE.middleware("libdom-http.driver.xhr"), register = MIDDLEWARE.register, BEFORE_REQUEST = "before:request", XHR = __webpack_require__(27), PROTOTYPE = XHR.prototype, BINDS = PROTOTYPE.bindMethods, BIND_LENGTH = BINDS.length, PROGRESS = DETECT.xhrbytes, features = 0;
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
            var LIBCORE = __webpack_require__(2), HELP = __webpack_require__(20);
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
            var LIBCORE = __webpack_require__(2), LIBDOM = __webpack_require__(15), HELP = __webpack_require__(20), BASE = __webpack_require__(28), BASE_PROTOTYPE = BASE.prototype, RESPONSE_TRIM = /(^<pre>|<\/pre>$)/gi, FILE_UPLOAD_GEN = 0;
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
                    request.deferredSubmit = setTimeout(me.onFormDeferredSubmit, 10);
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

