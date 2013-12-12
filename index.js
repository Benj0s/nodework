/**
 * Bootstrap file to initiate the server instance
 * Run using: node index.js
 **/

'use strict';

var	router = require('./application/router'),
	nodework = require('./application/nodework'),
	logger = require('./application/logger');

logger.info('Starting NodeWork');
nodework.start(router.route);