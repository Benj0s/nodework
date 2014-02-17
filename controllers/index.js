/**
 * Index controller
 * 
 */

'use strict';

var fs = require('fs'),
    globalModel = require('../models/global'),
	template = require('nodework').template,
	logger = require('nodework').logger,
	config = require('nodework').config;

/**
 * Builds the index html
 * 
 * @param {Object} callback
 */
exports.build = function(callback) {
    var modelData = {};
    
    modelData.siteDetails = globalModel.getDetails();
	template.getContents(modelData, 'index', config.defaultLayout, function(data) {
		callback(data);
	});	
};