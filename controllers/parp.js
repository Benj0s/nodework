'use strict';

var template = require('../application/template'),
    baseModel = require('../models/base'),
	parpModel = require('../models/parp'),
	logger = require('../application/logger');

exports.build = function(callback) {
    var modelData = {};
    
    modelData.base = baseModel.getBase();
    modelData.parp = parpModel.getParp();   
    modelData.parpList = parpModel.getParpList();
    
	template.getContents(modelData, 'parp', function(data) {
		callback(data);
	});	
};