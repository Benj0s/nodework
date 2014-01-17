'use strict';

var template = require('nodework').template,
    baseModel = require('../models/base'),
	parpModel = require('../models/parp'),
	logger = require('nodework').logger;

exports.build = function(callback) {
    var modelData = {};
    
    modelData.siteDetails = baseModel.getDetails();
    modelData.parp = parpModel.getParp();   
    modelData.parpList = parpModel.getParpList();
    
	template.getContents(modelData, 'parp', function(data) {
		callback(data);
	});	
};