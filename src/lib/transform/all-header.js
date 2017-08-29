'use strict';

import { parse } from "../header.js";

function convert(data) {
    return [null, parse(data)];
}

export default convert;

