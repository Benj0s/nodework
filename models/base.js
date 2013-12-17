/**
 * Default model common across all controllers 
 */

'use strict';

var config = require('../application/config');

exports.getDetails = function() {
    return config.details;
};
