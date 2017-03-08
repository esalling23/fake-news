'use strict';

/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * Game manager.
 *
 * @class lib
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */

var GameManager = function() {
	
	let Game;
	
	let NewsLib = require('./FakeNews');
	Game = new NewsLib();

	Game.Initialize();

	return Game;

};

module.exports = GameManager;