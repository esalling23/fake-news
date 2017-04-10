/**
 * (Site name here) 
 * 
 * Profile page Model
 * @module Profile
 * @class Profile
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Profile model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var Profile = new keystone.List('Profile', 
	{
		label: 'Profiles',
		singular: 'Profile',
		track: true,
		autokey: { path: 'key', from: 'name', unique: true },
	});

/**
 * Model Fields
 * @main Profile
 */
Profile.add({

	name: { type: String, label: 'Profile Name', hidden: true },
	// username: { type: Types.TextArray, label: 'List of Possible Usernames' },
	cover: { type: Types.CloudinaryImage, label: 'Cover Photo' },
	image: { type: Types.CloudinaryImage, label: 'Icon' },
	bio: { type: Types.Markdown, label: 'About Bio'},
	traits: { 
		type: Types.Relationship,
	 	label: 'Traits that determine followers',
	 	ref: 'Trait', 
	 	many: true
	},
	alienMessage: { type: Types.Markdown, label: 'Message from the Aliens about understanding of this human' },
	level: { type: Number, label: 'The level this profile might appear on', note: 'Every level includes three profiles chosen at random using this number to categorize'},
	createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }

});

/**
 * Model Registration
 */
Profile.defaultSort = '-createdAt';
Profile.defaultColumns = 'name, updatedAt';
Profile.register();
