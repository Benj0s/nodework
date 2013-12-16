/**
 * Application global configs
 * 
 * @module config
**/

'use strict';

// set a log level - 'info', 'error', 'warn', 'debug'
exports.logLevel = 'error';

// list of valid file extensions to set mime type
exports.extensions = {
    '.html' : 'text/html',
    '.css' : 'text/css',
    '.js' : 'application/javascript',
    '.png' : 'image/png',
    '.gif' : 'image/gif',
    '.jpg' : 'image/jpeg',
    '.jpeg' : 'image/jpeg'
};