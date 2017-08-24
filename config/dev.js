'use strict';

var webpack = require("webpack");

function augment(config, definition) {
    var hot = 'webpack-hot-middleware/client?reload=true&overlay=false';
    
    config.devtool = "eval-source-map";
    delete config.externals;
    
    config.entry.demo = [
                hot,
                './src/demo.js'];
    
    console.log("running hot module replacement");
    config.plugins = [new webpack.HotModuleReplacementPlugin()];
    
    config.entry[definition.name].
        splice(0,0, hot);
}


module.exports = augment;