'use strict';

var DOM = require("libdom"),
    ENV = DOM.env,
    G = global,
    XHR = G.XMLHttpRequest,
    support_xhr = !!XHR,
    support_xhrx = false,
    support_xhrmime = false,
    support_xhrtime = false,
    support_xhrbin = false,
    support_xhrprogress = false,
    support_xdr = !!G.XDomainRequest;


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