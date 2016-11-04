'use strict';

var main = require("./index.js");

global.main = main;

module.exports = main;

require("./test/driver.js");
