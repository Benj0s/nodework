/**
 * Used to build a dynamic html page to a specific template
 * 
 * @module template 
 */

'use strict';

var fs = require('fs'),
    helper = require('./helper'),
	logger = require('./logger'),
	getSection;

/**
 * Default template simply gets the header, specified page content and the footer
 * 
 * @param {Object} model All model data needed to build the page
 * @param {Object} page The page that we want to build
 * @param {Object} callback Returns the built html for the page via callback
 */
exports.getContents = function(model, page, callback) {
	var content = '';
	getSection('header', function(data) {
		content += data;
		getSection(page, function(data) {
			content += data;
			getSection('footer', function(data) {
				content += data;
				logger.debug('Content for:' + page + '\n' + content);
				callback(helper.templateHelper(model, content));
			});
		});
	});		
};

/**
 * Retrieves an individual page section from the views
 * 
 * Returns the section via a callback
 */
getSection = exports.getSection = function(section, callback) {
	fs.readFile('./views/'+ section + '.html', function (error, data) {
		if(error) {
			logger.debug(error);
			throw error;
		}
		callback(data);
	});
};

