/**
 * (Site name here) 
 * 
 * Event page Model
 * @module Event
 * @class Event
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Event model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var Event = new keystone.List('Event', 
	{
		label: 'Events',
		singular: 'Event',
		track: true,
		autokey: { path: 'key', from: 'name', unique: true },
	});

/**
 * Model Fields
 * @main Event
 */
Event.add({

	name: { type: String, label: 'Event Name', required: true, initial: true },
	thumbnail: { 
		type: Types.CloudinaryImage, 
		label: 'Thumbnail Image'
	},
	headlines: { 
		type: Types.TextArray, 
		label: 'Headlines'
	},
	comments: {
		type: Types.TextArray, 
		label: 'Comments'
	},
	createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }

});

/**
 * Model Registration
 */
Event.defaultSort = '-createdAt';
Event.defaultColumns = 'name, updatedAt';
Event.register();
