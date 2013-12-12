'use strict';

var fs = require('fs'),
	template = require('../application/template'),
	logger = require('../application/logger');

exports.build = function(callback) {
    var modelData = {};
	template.getContents(modelData, 'index', function(data) {
		callback(data);
	});	
};