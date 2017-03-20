/**
 * (Site name here) 
 * 
 * Article page Model
 * @module Article
 * @class Article
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;
var Thumbnail = require('./Thumbnail');
var Headline = require('./Headline');



/**
 * Article model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var Article = new keystone.List('Article', 
	{
		label: 'Articles',
		singular: 'Article',
		track: true,
		autokey: { path: 'key', from: 'name', unique: true },
	});

/**
 * Model Fields
 * @main Article
 */
Article.add({

	name: { type: String, label: 'Event', required: true, initial: true },
	thumbnails: { 
		type: Types.Relationship, 
		label: 'Thumbnail Images', 
		ref: 'Thumbnail', 
		many: true
	},
	headlines: { 
		type: Types.Relationship, 
		label: 'Headlines', 
		ref: 'Headline', 
		many: true
	},
	comments: {
		type: Types.Relationship, 
		label: 'Comments', 
		ref: 'Comment', 
		many: true
	},
	createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }

});

/**
 * Model Registration
 */
Article.defaultSort = '-createdAt';
Article.defaultColumns = 'name, updatedAt';
Article.register();
