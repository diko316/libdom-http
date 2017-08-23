'use strict';

var main = require("./index.js");

global.main = main;

module.exports = main;

require("./demo/driver.js");
