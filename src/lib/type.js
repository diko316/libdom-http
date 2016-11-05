'use strict';

var LIBCORE = require("libcore"),
    MIME_TYPE_RE =
        /^([a-z0-9\-\_]+)\/([a-z\-\_0-9]+)(([ \s\t]*\;([^\;]+))*)$/,
    MIME_TYPE_PARAMS_RE =
        /^[ \t\s]*([a-z0-9\-\_]+)\=(\"([^\"]+)\"|[a-z0-9\-\_]+)[ \t\s]*$/,
    QUOTED_RE = /^\"[^\"]+\"/,
    EXPORTS = {
        parse: parseType
    };

function parseType(type) {
    var mtypeRe = MIME_TYPE_RE,
        paramRe = MIME_TYPE_PARAMS_RE,
        quotedRe = QUOTED_RE,
        CORE = LIBCORE,
        paramGlue = "; ",
        parameterObject = null;
        
    var match, subtype, parameters, name, value, l, defaultType;
    
    if (CORE.string(type) && mtypeRe.test(type)) {
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

module.exports = EXPORTS;
