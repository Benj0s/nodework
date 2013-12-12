/**
 * Constructor style module to setup and start the app
 * @module nodework
 **/

'use strict';

var http = require('http'),
    cluster = require('cluster'),
    domain = require('domain'),
	url = require('url'),
	logger = require('./logger'),
	server;
	
/**
 * Starts the server
 * 
 * @method start 
 * @param {Function} route Routing function to route the url request
 */
exports.start = function(route) {
	function onRequest(request, response) {
		// split the pathname and remove any empty elements
		var path = url.parse(request.url).pathname.split('/').filter(function(e){return e;})[0],
            params = url.parse(request.url).pathname.split('/').filter(function(e){return e;}),
            currentDomain = domain.create();
        params.splice(0,1);
        // add on error event to gracefully manage uncaught exceptions        
        currentDomain.on('error', function(error) {
            logger.error(error.stack);
            try {
                // allow other others using the cluster to finish by running exit after 30 seconds
                var killtimer = setTimeout(function() {
                    process.exit(1);
                }, 30000);
                killtimer.unref();
                // close the server to prevent any new requests on the cluster
                server.close();
                cluster.worker.disconnect();
                // send internal server error
                response.statusCode = 500;
                response.setHeader('content-type', 'text/plain');
                response.end('Oops, there was a problem!\n');
            } catch (e) {
                logger.error('Error sending 500! ' + e.stack);
            }
        });
        currentDomain.add(response);
        currentDomain.add(request);  
        // if no pathname the set to default page 'index'
		if(!path) {			
			path = ['index'];
		}
		// send request and path to be routed
		currentDomain.run(function() {
		    route(path, params, request, response);
		});		
	}
	
	if(cluster.isMaster) {
	    // fork the cluster 
	    cluster.fork();
	    cluster.fork();
	    // add disconnect event handler to log when the cluster stops
	    cluster.on('disconnect', function(worker) {
	       logger.error('Cluster disconnect'); 
	    });
	} else {
        server = http.createServer(onRequest).listen(8888);
        logger.info('Started NodeWork');
	}
	
};
