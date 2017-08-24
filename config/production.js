'use strict';

function augment(config, definition) {
    if (process.env.BUILD_MODE === "unit-test") {
        delete config.externals;
    }
}

module.exports = augment;

