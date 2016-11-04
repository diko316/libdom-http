'use strict';

var PATH = require('path'),
    webpack = require("webpack"),
    DEFINITION = require("./package.json"),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    es3ifyPlugin = require('es3ify-webpack-plugin'),
    
    libName = DEFINITION.name,
    buildDirectory = PATH.resolve(__dirname),
    sourcePath = PATH.join(buildDirectory, 'src'),
    hasOwn = Object.prototype.hasOwnProperty,
    entry = {},
    DISABLE_HOT_IE = true,
    //DISABLE_HOT_IE = false,
    plugins = [
            new webpack.DefinePlugin({
                LIB_NAME: JSON.stringify(libName),
                LIB_VERSION: JSON.stringify(DEFINITION.version)
            }),
            new webpack.NoErrorsPlugin(),
            new ExtractTextPlugin(libName + '.css')
        ];

var name;

entry[libName] = [PATH.join(sourcePath, 'index.js')];



switch (process.env.BUILD_MODE) {
case "production":
    console.log("** build production");
    plugins.splice(0, 0,
            new webpack.optimize.UglifyJsPlugin({
                compress: false,
                beautify: true,
                mangle: false,
                comments: false,
                sourceMap: false
            }));
    break;

case "compressed":
    console.log("** build compressed-production");
    
    // replace entry name
    entry[libName + '.min'] = entry[libName];
    delete entry[libName];
    
    // replace with minified plugin
    plugins[1] = new ExtractTextPlugin(libName + '.min.css');
    plugins.splice(0, 0,
                new webpack.optimize.UglifyJsPlugin({
                    
                }));
    break;

default:
    console.log("** build test");
    entry.test = [PATH.join(sourcePath, 'test.js')];
    
    if (DISABLE_HOT_IE) {
        plugins.splice(0, 0,
            new es3ifyPlugin(),
            new webpack.optimize.OccurenceOrderPlugin());
    }
    else {
        for (name in entry) {
            if (hasOwn.call(entry, name)) {
                entry[name].splice(0, 0,
                    'webpack-hot-middleware/client?reload=true&overlay=false');
            }
        }
        plugins.splice(0, 0,
            new es3ifyPlugin(),
            //new webpack.optimize.OccurenceOrderPlugin());
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.HotModuleReplacementPlugin());
    }
}


       
module.exports = {

    entry: entry,

    output: {
        path: PATH.join(buildDirectory, 'test', 'assets'),
        publicPath: '/assets/',
        filename: '[name].js',
        library: libName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },

    devTool: 'eval',

    plugins: plugins,

    resolve: {
        modulesDirectories: [
            'bower_components',
            'node_modules'
        ]
    },

    module: {
        noParse: /\.min\.js/,
        loaders: [{
            test: /\.js$/,
            loader: "eslint-loader?{useEslintrc:false}",
            include: sourcePath,
            exclude: /node_modules|bower_components/
        },
        {
            test: /\.json$/,
            loader: 'json-loader'
        },
        {
            test: /all\.less$/,
            include: sourcePath,
            exclude: /node_modules|bower_components/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
        },
        {
            test: /\.(jpg|jpeg|gif|png)$/,
            include: sourcePath,
            loader:'url-loader?limit=1024&name=images/[name].[ext]'
            
        },
        {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap")
        },
        {
            test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
            loader: "url-loader?limit=10000&mimetype=application/font-woff&name=fonts/[name].[ext]"
        },
        {
            test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
            loader: "url-loader?limit=10000&mimetype=application/font-woff&name=fonts/[name].[ext]"
        },
        {
            test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
            loader: "url-loader?limit=10000&mimetype=application/octet-stream&name=fonts/[name].[ext]"
        },
        {
            test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
            loader: "file-loader?limit=10000&name=fonts/[name].[ext]"
        },
        {
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            loader: "url-loader?limit=10000&mimetype=image/svg+xml&name=fonts/[name].[ext]"
        },
        {
            test:   /\.html/,
            loader: 'html-loader'
        }]
    }

};


