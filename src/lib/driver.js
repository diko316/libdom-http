'use strict';

var LIBCORE = require("libcore"),
    DRIVERS = LIBCORE.createRegistry(),
    DEFAULT = null,
    EXPORTS = {
        register: register,
        exists: exists,
        use: use,
        get: get
    };
    
/**
 * driver management
 */
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

/**
 * driver process
 */
function get(type) {
    return DRIVERS.get(type);
}



module.exports = EXPORTS.chain = EXPORTS;