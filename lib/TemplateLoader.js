'use strict';

/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * Template loader.
 *
 * @class lib
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */

var fs = require('fs');
var handlebars = require('keystone').get('handlebars');
var rootDir = require('app-root-path');

class TemplateLoader {

    constructor() {
        
    }

    Load(filePath, data, callback) {

        if(!data) 
            data = {};

        logger.info('TemplateLoader', 'Loading ' + rootDir + '/templates/' + filePath + '.hbs');

        handlebars
        .render(rootDir + '/templates/' + filePath + '.hbs', data)
        .then(function(res) {
          
            callback(res);

        })
        .catch(function(err) {

            console.error("TemplateLoader ERROR:", {
                                                    error: err, 
                                                    file: rootDir + '/templates/' + filePath + '.hbs'
                                                   });

        });

    }


}

module.exports = TemplateLoader;