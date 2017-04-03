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

	name: { type: String, label: 'Headline', required: true, initial: true },
	newspaper: { type: String, label: 'Newspaper', required: true, initial: true },
	thumbnail: { type: Types.CloudinaryImage, label: 'Thumbnail Image' },
	status: { type: Types.Select, label: 'Article Stance', options: 'Neutral, Positive, Negative' },
	twisted: { type: Number, hidden: true, default: 0 },
	createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }

});

/**
 * Model Registration
 */
Article.defaultSort = '-createdAt';
Article.defaultColumns = 'name, updatedAt';
Article.register();
