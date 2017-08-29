'use strict';

import {
            number,
            string
        } from "libcore";

function convert(data) {
    
    if (number(data)) {
        data = data.toString(10);
    }
    
    return ['Content-type: text/plain',
            string(data) ?
                data : ''];
}


export default convert;