var _ = require('underscore');
var hbs = require('handlebars');
var randomNum = require('random-number');

module.exports = function() {

    var _helpers = {};

    /**
     * Local HBS Helpers
     * ===================
     */
     // run a function
    _helpers.splitRatio = function(ratio, first) {

        if (first)
        	return ratio.split(':')[0];
        else 
        	return ratio.split(':')[1];
        
    };


   

    return _helpers;


};