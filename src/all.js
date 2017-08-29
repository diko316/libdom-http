'use strict';

import { env } from "libcore";

import DETECT from "./lib/detect.js";

import DRIVER,
        {
            register as driverRegister,
            use
        } from "./lib/driver.js";

import TRANSFORMER,
        {
            register as transformRegister,
            transform
        } from "./lib/transform.js";


import xhrDriver from "./lib/driver/xhr.js";
import xhrDriver2 from "./lib/driver/xhr2.js";

import formUploadDriver from './lib/driver/form-upload.js';

import transformTextResponseDriver
            from "./lib/transform/response-text-plain.js";
            
import transformFormDataRequestDriver
            from "./lib/transform/request-html5-form-data.js";


if (!global.libdom) {
    throw new Error("libdom package is not found! unable to load http module");
}



if (DETECT.xhr) {
    driverRegister('xhr', xhrDriver);
    
    driverRegister('xhr2', xhrDriver2);
}

// file upload drivers
if (env && env.browser) {
    driverRegister('form-upload',
        DETECT.xhr && DETECT.file && DETECT.blob ?
            // form data
            xhrDriver2 :
            
            // old school iframe
            formUploadDriver);
}

// Transform Drivers
transformRegister('text/plain',
    true,
    transformTextResponseDriver);


if (DETECT.formdata) {
    
    // use html5 form data request
    transformRegister('multipart/form-data',
        false,
        transformFormDataRequestDriver);
}



        
        
export {
            use,
            driverRegister as driver,
            
            transform,
            transformRegister as transformer
        };
        
export {
            request,
            defaults
        } from "./lib/request.js";


export {
            parse as parseHeader,
            each as eachHeader
        } from "./lib/header.js";
