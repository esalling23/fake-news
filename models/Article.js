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

	name: { type: String, label: 'Name', required: true, initial: true },

	// facts: { type: }
	createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }

});

/**
 * Model Registration
 */
Article.defaultSort = '-createdAt';
Article.defaultColumns = 'name, updatedAt';
Article.register();
