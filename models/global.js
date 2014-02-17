/**
 * Default model common across all controllers 
 */

'use strict';

var config = require('nodework').config;

exports.getDetails = function() {
    return config.details;
};
