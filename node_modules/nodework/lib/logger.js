/**
 * Decides on how and when logs should be displayed
 * @module logger
 **/

'use strict';

var	config = require('./config'),
	levels = { info: 0,
				error: 1,
				warn: 2,
				debug: 3 };

/**
 * Logs a information level log entry
 * 
 * @method info 
 * @param {String} message Text to be logged
 */
exports.info = function(message) {	
	console.log('[' + new Date().toUTCString() + '] [INFO] >> ' + message);
};

/**
 * Logs a error level log entry
 * 
 * @method error 
 * @param {String} message Text to be logged
 */
exports.error = function(message) {
	if(levels[config.logLevel] >= levels.error) {
		console.log('[' + new Date().toUTCString() + '] [ERROR] >> ' + message);
	}
};

/**
 * Logs a warning level log entry
 * 
 * @method warn 
 * @param {String} message Text to be logged
 */
exports.warn = function(message) {
	if(levels[config.logLevel] >= levels.warn) {
		console.log('[' + new Date().toUTCString() + '] [WARN] >> ' + message);
	}
};

/**
 * Logs a debug level log entry
 * 
 * @method debug 
 * @param {String} message Text to be logged
 */
exports.debug = function(message) {
	if(levels[config.logLevel] >= levels.debug) {
		console.log('[' + new Date().toUTCString() + '] [DEBUG] >> ' + message);
	}
};