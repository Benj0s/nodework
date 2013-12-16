/**
 * Takes the pathname and routes to the appropriate controller
 * @module router
 */

'use strict';

var logger = require('./logger'),
    path = require('path'),
    fs = require('fs'),
    config = require('./config'),
    fileNotFound,
    sendResponse;
    
	
/**
 * Sends a response to the requester
 * 
 * @param {Object} response Node response object
 * @param {Object} request Node request object
 * @param {String} send A string to be sent back to the requester
 * @param {Integer} responseCode Optional response code 
 */
sendResponse = function(response, request) {
    var ext = path.extname(path.basename(request.url)),
        mime = 'text/html';
    
    if(config.extensions[ext]){
         mime = config.extensions[ext];
    }
    response.writeHead(response.statusCode, {"Content-Type": mime});
    response.write(response.content);
    response.end();
};


/**
 * Function for deivering the default file not found response
 * @param {Object} request Node request object
 * @param {Object} response Node reponse object
 */
fileNotFound = function(request, response) {
    var controller = require('../controllers/404notfound');
        
    controller.build(function(content) {
        logger.info('Sending response to browser');
        response.statusCode = 404;
        response.content = content;
        sendResponse(response, request);
    });
};

	
/**
 * Takes the url path and route to the appropriate controller
 * 
 * @method route
 * @param {String} pathAction The path from the url
 * @param {Object} request Node request object
 * @param {Object} response Node reponse object
 */
exports.route = function(request, response) {
    var controller;
        
    if(request.pathAction === 'public') {
        // if public path action directly read the file using the request url
        logger.info('Getting static content file: ' + path.basename(request.url));     
        fs.readFile('.' + request.url, function (error, data) {
            if(error) {
                logger.debug(error);
                // if error getting file send 404
                fileNotFound(request, response);
            } else {
                response.statusCode = 200;
                // send readFile data as response
                response.content = data;
                sendResponse(response, request);
            }            
        });
    } else {
        // dynamic content so request and build using controller
        try {
            // check to see if the controller exists
            require.resolve('../controllers/' + request.pathAction);
            controller = require('../controllers/' + request.pathAction);   
            logger.info('Routing path: ' + request.pathAction + ' with parameters: ' + request.params);    
        } catch(e) {
            // request 404 if not found            
            fileNotFound(request, response);
            logger.info('Routing path: ' + request.pathAction + ' was not found');
        }
    	if(typeof controller === 'object') {
    	    // if the controller for the path exists then call it	    		
    		controller.build(function(content) {
                logger.info('Sending response to browser');
                response.statusCode = 200;
                response.content = content;
                sendResponse(response, request);
            });
    	}
	}

};
