/**
 * (Site name here) 
 * 
 * EventArticle page Model
 * @module EventArticle
 * @class EventArticle
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;



/**
 * EventArticle model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var EventArticle = new keystone.List('EventArticle', 
	{
		label: 'EventArticles',
		singular: 'EventArticle',
		track: true,
		autokey: { path: 'key', from: 'name', unique: true },
	});

/**
 * Model Fields
 * @main EventArticle
 */
EventArticle.add({

	name: { type: String, label: 'Headline', required: true, initial: true },
	user: { type: String, label: 'Username', note: 'This could be a fake username, a real individual\'s name, or a company/brand/group', required: true, initial: true },
	thumbnail: { type: Types.CloudinaryImage, label: 'Thumbnail Image' },
	comments: { type: Types.TextArray, label:'Potential Comments' },
	status: { type: Types.Select, label: 'Event Article Stance', options: 'nuetrals, lovers, haters' },
	createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }

});

/**
 * Model Registration
 */
EventArticle.defaultSort = '-createdAt';
EventArticle.defaultColumns = 'name, updatedAt';
EventArticle.register();
