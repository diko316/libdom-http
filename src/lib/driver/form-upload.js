"use strict";

var LIBCORE = require("libcore"),
    LIBDOM = require("libdom"),
    HELP = require("../transform/helper.js"),
    BASE = require("./base.js"),
    BASE_PROTOTYPE = BASE.prototype,
    RESPONSE_TRIM = /(^<pre>|<\/pre>$)/ig,
    FILE_UPLOAD_GEN = 0;

function createForm(method, url, contentType, blankDocument) {
    var doc = global.document,
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
                ' method="', method.toUpperCase(),'"',
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
    
    LIBDOM.on(iframe, 'load', frameFirstOnloadEvent);
    
    doc.body.appendChild(div);
    
    doc = div = iframe = null;
    return id;
}

function frameFirstOnloadEvent(event) {
    var DOM = LIBDOM,
        target = event.target,
        form = target.parentNode;
        
    DOM.un(target, 'load', frameFirstOnloadEvent);
    
    form.setAttribute('data-readystate', 'ready');
    
    DOM.dispatch(form, 'libdom-http-ready', {});
    
    DOM = target = form = null;
}

function getForm(id) {
    return global.document.getElementById(id);
}

function createField(operation, name, value, type, fieldType) {
    var CORE = LIBCORE,
        impostors = operation.impostors,
        fragment = operation.fragment,
        isField = type === "field",
        isFile = isField && fieldType === "file",
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
            LIBDOM.replace(value, input);
        }
        input = value;
        operation.files = true;
        
    }
    else if (!isFile) {
        
        if (isField) {
            value = value.value;
        }
        
        if (value === 'number') {
            value = isFinite(value) ? value.toString(10) : '';
        }
        else if (!CORE.string(value)) {
            value = HELP.jsonify(value);
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
        
    BASE.apply(me, arguments);

}


FormUpload.prototype = LIBCORE.instantiate(BASE, {
    constructor: FormUpload,
    
    blankDocument: 'about:blank',
    defaultType: 'application/json',
    
    bindMethods: BASE_PROTOTYPE.bindMethods.concat([
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
            DOM = LIBDOM,
            request = me.request,
            form = request.form;

        // unset event if it was set
        DOM.un(form, 'libdom-http-ready', me.onFormReady);
        
        form.enctype = form.encoding = request.contentType;
        
        request.deferredSubmit = setTimeout(me.onFormDeferredSubmit, 10);
        
        form = null;
        
        
    },
    
    onFormDeferredSubmit: function () {
        var me = this,
            request = me.request,
            form = request && request.form;
        
        if (form) {
            LIBDOM.on(request.iframe, 'load', me.onRespond);
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
        
        LIBDOM.un(iframe, 'load', me.onRespond);
        
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
            CORE = LIBCORE,
            impostors = [],
            id = createForm(request.method,
                            request.getUrl(),
                            request.contentType,
                            me.blankDocument),
            form = getForm(id),
            operation = {
                impostors: impostors,
                fragment: global.document.createDocumentFragment(),
                files: false,
                driver: me,
                request: request
            },
            currentResponseType = request.responseType;
            
        // recreate request
        HELP.each(request.data, createField, operation);
        
        // add fields
        form.appendChild(operation.fragment);
        request.form = form;
        request.iframe = form.firstChild;
        request.impostors = operation.impostors;
        request.fileUpload = operation.files;
        
        // use application.json as default response type
        if (!CORE.string(currentResponseType)) {
            request.responseType = me.defaultType;
        }
        
        // cleanup operation
        CORE.clear(operation);
        
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
            LIBDOM.on(form, 'libdom-http-ready', this.onFormReady);
        }
        
    },
    
    onSuccess: function (request) {
        var me = this,
            response = me.response,
            responseBody = request.formResponse;
        
        if (LIBCORE.string(responseBody)) {
            response.body = responseBody;
        }
    },
    
    onCleanup: function (request) {
        var impostors = request.impostors,
            form = request.form;
        
        // return impostors
        if (LIBCORE.array(impostors)) {
            revertImpostors(impostors);
        }
        
        if (form) {
            LIBDOM.remove(form.parentNode || form);
        }
        
        request.transportPromise = 
            request.resolve =
            request.reject = 
            request.form = form = null;
    }

    
});

module.exports = FormUpload;