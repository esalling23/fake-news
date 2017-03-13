/**
 * Emerging Citizens
 * 
 * GameSession Model
 * @module models
 * @class GameSession
 * @author Johnny Richardson
 * 
 * ==========
 */
"use strict";

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * GameSession Model
 * ==========
 */
var GameSession = new keystone.List('GameSession', {
		editable: false,
		cancreate: false,
		// hidden: true,
    track: true
});
/**
 * Model Fields
 * @main GameSession
 */
GameSession.add({

  accessCode: { type: String, required: true, initial: true, hidden: true }
  // dateCreated: { type: Date, noedit: true }

});

// Store all hashtag submissions/votes (not visible in admin UI)
// GameSession.schema.add({ game: Object });


// GameSession.schema.pre('save', function(next) {
  
//   this.dateCreated = new Date();

//   next();

// });

/**
 * Registration
 */
GameSession.register();
exports = module.exports = GameSession;
