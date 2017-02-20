/**
 * (Site name here) 
 * 
 * Category page Model
 * @module Category
 * @class Category
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Category model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var Category = new keystone.List('Category', 
	{
		label: 'Categories',
		singular: 'Category',
		track: true,
		autokey: { path: 'key', from: 'name', unique: true },
	});

/**
 * Model Fields
 * @main Category
 */
Category.add({

	name: { type: String, label: 'Name', required: true, initial: true },
	author: { type: String, label: 'Author', initial: true, required: true },

	subHeading: { type: String, label: 'Sub-Heading', required: true, initial: true },
	fields: { type: String, label: 'Fields/Discipline', initial: true, required: true },
	dataType: { type: String, label: 'Type of Data', initial: true, required: true },
	related: { type: String, label: 'Related Types', initial: true, required: true },

	intro: { type: Types.Markdown, label: 'Intro Conent', required: true, initial: true, toolbarOptions: { hiddenButtons: 'H1,H2,H3,H4,Code,Image,Quote' } },
	content: { type: Types.Markdown, label: 'Page Conent', required: true, initial: true, height: 250, toolbarOptions: { hiddenButtons: 'H3,H4,Code' }},

	image: { type: Types.CloudinaryImage, label: 'Category Image', folder: 'uncertainty-dictionary', autoCleanup: true },
	color: { type: Types.Color, label: 'Theme Color', note: 'Color of text in category listing & header color.' },
	
	createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }

});

/**
 * Model Registration
 */
Category.defaultSort = '-createdAt';
Category.defaultColumns = 'name, updatedAt';
Category.register();
