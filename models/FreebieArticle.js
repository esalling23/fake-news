/**
 * (Site name here) 
 * 
 * FreebieArticle page Model
 * @module FreebieArticle
 * @class FreebieArticle
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * FreebieArticle model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var FreebieArticle = new keystone.List('FreebieArticle', 
	{
		label: 'Freebie Articles',
		singular: 'Freebie Article',
		track: true,
		autokey: { path: 'key', from: 'name', unique: true },
	});

/**
 * Model Fields
 * @main FreebieArticle
 */
FreebieArticle.add({

	name: { type: String, label: 'Freebie Article Name', required: true, initial: true },
	user: { type: String, label: 'Username', note: 'This could be a fake username, a real individual\'s name, or a company/brand/group', required: true, initial: true },
	thumbnail: { type: Types.CloudinaryImage, label: 'Thumbnail Image' },
	comments: { type: Types.TextArray, label:'Potential Comments'},
	createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }
}, 'Audience', {

	neutrals: { 
		type: Types.Relationship, 
		label: 'Neutrals' ,
		ref: 'Trait', 
		many: true
	}, 
	lovers: { 
		type: Types.Relationship, 
		label: 'Lovers', 
		ref: 'Trait', 
		many: true
	}, 
	haters: { 
		type: Types.Relationship, 
		label: 'Haters', 
		ref: 'Trait', 
		many: true
	}

});

/**
 * Model Registration
 */
FreebieArticle.defaultSort = '-createdAt';
FreebieArticle.defaultColumns = 'name, updatedAt';
FreebieArticle.register();
