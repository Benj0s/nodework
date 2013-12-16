/**
 * Helper module 
 * 
 * @module config
 **/

'use strict';

var logger = require('./logger'),
    // TODO move templateSettings into the config and build templateMatcher dynamically?
    templateSettings = {
        evaluate:    /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g
    },
    templateMatcher = new RegExp([(templateSettings.interpolate).source, (templateSettings.evaluate).source].join('|') + '|$', 'g'),
    escapes = {
        "'":      "'",
        '\\':     '\\',
        '\r':     'r',
        '\n':     'n',
        '\t':     't',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    },
    escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

/**
 * Helper to render dynamic html templates 
 *  
 * @param {Object} modelData All model data needed for the view
 * @param {String} viewData The raw version of the view
 */
exports.templateHelper = function(modelData, viewData) {
    var html = "p+='",
        index = 0,
        render;
    // using the template matcher replace anything matching the templateSettings expressions
    viewData.replace(templateMatcher, function(match, interpolate, evaluate, offset) {
        // take the next section of viewData, replace escapes to make safe and concat result on to html
        html += viewData.slice(index, offset).replace(escaper, function(match) { 
            return '\\' + escapes[match]; 
        });
        // inject javascript into html using replace rules depending on the match
        if(evaluate) {
             html += "';\n" + evaluate + "\np+='";
        }
        if(interpolate) {
            html += "'+\n((t=(" + interpolate + "))==null?'':t)+\n'";
        }
        // update index so next slice moves to the next section
        index = offset + match.length;
        return match;
    });
    
    // rebuild dynamic html string containing javascript ready to be rendered
    html = "var t,p='',joiner=Array.prototype.join," +
        "print=function(){p+=joiner.call(arguments,'');};\n" +
        html + "';\nreturn p;\n";

    try {
        // check for syntax errors when rendering the html
        render = new Function('obj', html);
        // execute the javascript within html to generate final static html string
        html = render.call(modelData);
    } catch(e) {
        // if syntax error exists then return the error instead of the html
        html = e.stack;
    }                      

    return html;
    
};
