'use strict';

var HEADER = require("../header.js");

function convert(data) {
    return [null, HEADER.parse(data)];
}

module.exports = convert;
