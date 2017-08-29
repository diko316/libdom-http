'use strict';

import {
            string,
            method,
            createRegistry
        } from "libcore";
        
import { get as getModule } from "./chain.js";


var DRIVERS = createRegistry(),
    DEFAULT = null,
    exported = {
        register: register,
        exists: exists,
        use: use,
        get: get
    };
    
/**
 * driver management
 */
export
    function register(name, Class) {
            
        if (string(name) && method(Class)) {
            DRIVERS.set(name, Class);
            Class.prototype.type = name;
            
            if (!DEFAULT) {
                DEFAULT = name;
            }
        }
        
        return getModule();
    }
export
    function exists(name) {
        return DRIVERS.exists(name);
    }

export
    function use(name) {
        if (arguments.length > 0 && exists(name)) {
            DEFAULT = name;
        }
        return DEFAULT;
    }

/**
 * driver process
 */
export
    function get(type) {
        return DRIVERS.get(type);
    }

export default exported;