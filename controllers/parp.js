'use strict';

var template = require('nodework').template,
    globalModel = require('../models/global'),
	parpModel = require('../models/parp'),
	logger = require('nodework').logger,
	config = require('nodework').config;

exports.build = function(callback) {
    var modelData = {};
    
    modelData.siteDetails = globalModel.getDetails();
    modelData.parp = parpModel.getParp();   
    modelData.parpList = parpModel.getParpList();
    
	template.getContents(modelData, 'parp', config.defaultLayout, function(data) {
		callback(data);
	});	
};