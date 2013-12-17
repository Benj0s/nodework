/**
 * Takes the pathname and routes to the appropriate controller
 * @module router
 */

'use strict';

var logger = require('./logger'),
    path = require('path'),
    fs = require('fs'),
    config = require('./config'),
    isController,
    fileNotFound,
    sendResponse;
    
	
/**
 * Sends a response to the requester
 * 
 * @param {Object} response Node response object
 * @param {Object} request Node request object
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
 * Callback function to do async check to see if controller exists
 * 
 * @param {String} pathAction The controller that's been requested
 * @param {Object} callback Returns the controller object or false   
 */
isController = function(pathAction, callback) {
    var controller;
    try {
        controller = require('../controllers/' + pathAction);
    } catch(e) {
        controller = false;
        logger.error(e);
    }
    callback(controller);
};
	
/**
 * Takes the url path and route to the appropriate controller
 * 
 * @method route
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
        isController(request.pathAction, function(controller) {
            if(typeof controller === 'object') {
                // controller has returned as an object from isController
                logger.info('Routing path: ' + request.pathAction + ' with parameters: ' + request.params);
                // build the page for this controller
                controller.build(function(content) {
                    logger.info('Sending response to browser');
                    response.statusCode = 200;
                    response.content = content;
                    sendResponse(response, request);
                });
            } else {
                // controller returned as false so send 404
                fileNotFound(request, response);
                logger.info('Routing path: ' + request.pathAction + ' was not found');
            }
        });
	}

};
