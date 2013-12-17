/**
 * Index controller
 * 
 */

'use strict';

var fs = require('fs'),
    baseModel = require('../models/base'),
	template = require('../application/template'),
	logger = require('../application/logger');

/**
 * Builds the index html
 * 
 * @param {Object} callback
 */
exports.build = function(callback) {
    var modelData = {};
    
    modelData.siteDetails = baseModel.getDetails();
	template.getContents(modelData, 'index', function(data) {
		callback(data);
	});	
};