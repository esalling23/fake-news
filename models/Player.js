var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Player Model
 * ==========
 */

var Player = new keystone.List('Player', {
	label: 'Player',
	singular: 'Players',
	track: true, 
	map: { name: 'username' }
	// autokey: { path: 'key', from: 'name', unique: true }
});

Player.add({
	username: { type: String, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true }
}, 'Player Data', {
	badges: {
		type: Types.Relationship, 
		ref: 'Profile',
		label: 'Profile Badges (Completed Profiles)',
		many: true, 
		noedit: true
	}
});




/**
 * Registration
 */

Player.defaultColumns = 'name';
Player.register();
