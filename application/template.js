'use strict';

var fs = require('fs'),
    helper = require('./helper'),
	logger = require('./logger'),
	getSection;

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

getSection = exports.getSection = function(section, callback) {
	fs.readFile('./views/'+ section + '.html', function (error, data) {
		if(error) {
			logger.debug(error);
			throw error;
		}
		callback(data);
	});
};

