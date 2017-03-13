/**
 * (Site name here) 
 * 
 * Comment page Model
 * @module Comment
 * @class Comment
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Comment model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var Comment = new keystone.List('Comment', 
	{
		label: 'Comments',
		singular: 'Comment',
		track: true,
		autokey: { path: 'key', from: 'name', unique: true },
	});

/**
 * Model Fields
 * @main Comment
 */
Comment.add({

	name: { type: String, label: 'Comment Name', required: true, initial: true },
	username: { type: Types.TextArray, label: 'List of Possible Usernames' },
	image: { type: Types.CloudinaryImage, label: 'Icon' },
	comment: { type: Types.Markdown, label: 'Comment Text' },
	createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }

});

/**
 * Model Registration
 */
Comment.defaultSort = '-createdAt';
Comment.defaultColumns = 'name, updatedAt';
Comment.register();
