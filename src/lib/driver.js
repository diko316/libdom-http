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
    return EXPORTS;
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

//function request(type, config) {
//    var operation = new OPERATION(),
//        Driver = DRIVERS.get(type),
//        driver = new Driver();
//    var promise;
//    // setup
//    driver.request = operation;
//    driver.url = config.url;
//    driver.method = config.method;
//    driver.config = config;
//    
//    operation.addHeaders(config.headers);
//    
//    operation.data = config.params || config.data || config.body;
//    
//    // workflow
//    promise = Promise.resolve(operation).
//            then(driver.setup).
//            then(driver.transport).
//            then(function (data) {
//                var response = new RESPONSE(operation);
//                driver.response = response;
//                response.request = driver.request;
//                response = null;
//                return data;
//            }).
//            then(driver.process).
//            then(driver.success)
//            ["catch"](driver.error);
//            
//    driver.api = promise;
//    
//    return promise;
//}





module.exports = EXPORTS;