/**
 * (Site name here) 
 * 
 * CurrentEvent page Model
 * @module CurrentEvent
 * @class CurrentEvent
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * CurrentEvent model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var CurrentEvent = new keystone.List('CurrentEvent', 
	{
		label: 'Current Events',
		singular: 'Current Event',
		track: true,
		autokey: { path: 'key', from: 'name', unique: true },
	});

/**
 * Model Fields
 * @main CurrentEvent
 */
CurrentEvent.add({

	name: { type: String, label: 'Current Event Name', required: true, initial: true },
	text: { type: Types.Markdown, label: 'Short Description', required: true, initial: true },
	thumbnail: { 
		type: Types.CloudinaryImage, 
		label: 'Thumbnail Image'
	},
	articles: { 
		type: Types.Relationship, 
		label: 'Articles', 
		ref: 'Article', 
		many: true
	},
	createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }

}, 'Goals', {

	neutral: { type: Types.Markdown, label: 'Neutral Goal Text' }, 
	posSide: { type: Types.Markdown, label: 'Positive Goal Text' }, 
	negSide: { type: Types.Markdown, label: 'Negative Goal Text' }

});

/**
 * Model Registration
 */
CurrentEvent.defaultSort = '-createdAt';
CurrentEvent.defaultColumns = 'name, updatedAt';
CurrentEvent.register();
