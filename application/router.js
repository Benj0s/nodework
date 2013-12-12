/**
 * Takes the pathname and routes to the appropriate controller
 * @module router
 */

'use strict';

var logger = require('./logger');
	
/**
 * Sends a response to the requester
 * 
 * @param {Object} response Node response object
 * @param {Object} request Node request object
 * @param {String} send A string to be sent back to the requester
 * @param {Integer} responseCode Optional response code 
 */
function sendResponse(response, request, send, responseCode) {
    var code = 200;
    if(responseCode) {
        // change the response code if one has been supplied
        code = responseCode;
    }
    response.writeHead(code, {"Content-Type": "text/html"});
    response.write(send);
    response.end();
}

	
/**
 * Takes the url path and route to the appropriate controller
 * 
 * @method route
 * @param {String} path The path from the url
 * @param {Object} request Node request object
 * @param {Object} response Node reponse object
 */
exports.route = function(path, params, request, response) {
    var responseCode = 200,
        controller;
    try {
        // chech to see if the controller exists
        require.resolve('../controllers/'+path);
        controller = require('../controllers/'+path);   
        logger.info('Routing path: ' + path + ' with parameters: ' + params);    
    } catch(e) {
        // select the 404 controller if not found
        controller = require('../controllers/404notfound');
        responseCode = 404;
        logger.info('Routing path: ' + path + ' was not found');
    }
	if(typeof controller === 'object') {
	    // if the controller for the path exists then call it		
		controller.build(function(content) {
            logger.info('Sending response to browser');
            sendResponse(response, request, content, responseCode);
        });
	}

};
