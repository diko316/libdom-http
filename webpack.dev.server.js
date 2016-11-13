var PATH = require('path'),
    ROOT_PATH = PATH.resolve(__dirname),
    HTTP_PATH = PATH.join(ROOT_PATH, 'test'),
    express = require('express'),
    webpack = require("webpack"),
    bodyParser = require("body-parser"),
    MULTIPARTY = require("multiparty"),
    webpackDevMiddleware = require("webpack-dev-middleware"),
    webpackHotMiddleware = require("webpack-hot-middleware"),
    app = express(),
    
    config = require("./webpack.config.js"),
    port = process.env.DEV_HOST_PORT,
    MULTIPART_RE = /^multipart\/form\-data/i,
    IE_VERSION_RE = /msie ([0-9]+\.[0-9]+)/i,
    defaultPort = 3000;
    
var compiler;

function respond(req, res, data) {
    var output = [],
        ol = 0,
        useragent = req.get('User-Agent'),
        ieVersion = 0;
    var match;
    
    output[ol++] = JSON.stringify({
                                requestType: req.get('Content-type'),
                                accept: req.get("Accept"),
                                data: data
                            });
    
    if (typeof useragent === "string") {
        match = useragent.match(IE_VERSION_RE);
        if (match) {
            ieVersion = parseInt(match[1], 10) || 0;
        }
    }
    
    if (ieVersion && ieVersion < 10) {
        res.type("text/plain");
    }
    else {
        res.type("application/json");
    }
    
    res.send(output.join("\r\n"));
}


compiler = webpack(config);



app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    noInfo: true
}));

app.use(webpackHotMiddleware(compiler));

app.use(express.static(HTTP_PATH));

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.post(/^\/.*/,
    function (req, res) {
        var form;
        
        // create data from multipart
        if (MULTIPART_RE.test(req.get('Content-type'))) {
            form = new MULTIPARTY.Form();
            form.parse(req, function (error, fields) {
                var data = {};
                var name, value;
                if (fields) {
                    for (name in fields) {
                        if (fields.hasOwnProperty(name)) {
                            value = fields[name];
                            if (value instanceof Array) {
                                data[name] = value[0];
                            }
                        }
                    }
                }
                respond(req, res, data);
            });
        }
        else {
            respond(req, res, req.body);
        }
        
    });


if (typeof port !== 'number' || !isFinite(port)) {
    port = defaultPort;
}

app.listen(port,
    function () {
        console.log('** Dev Server Running, listening to port ' + port + '.');
    });

//app.use(function (req, res, next) {
//        
//        if (req.url.substring(0, 4) === '/poc') {
//            next();
//            return;
//        }
//        
//        // use proxy
//        backendProxy.proxy.web(req, res, backendProxy.config);
//        
//    });
//
//
//
//app.listen(backendProxy.port,
//    function () {
//        console.log('** listening at port ', backendProxy.port);
//    });