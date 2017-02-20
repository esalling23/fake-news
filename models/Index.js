/**
 * (Site name here) 
 * 
 * Index page Model
 * @module index
 * @class index
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * index model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var Index = new keystone.List('Index', 
	{
		label: 'Index Page',
		singular: 'Index Page',
		track: true,
		nodelete: true
	});

/**
 * Model Fields
 * @main Index
 */
Index.add({
	name: { type: String, default: "Index Page", hidden: true, required: true, initial: true },
	intro: { type: Types.Markdown, label: "Intro Text",  initial: true, required: true },
	// description: { type: Types.Textarea, label: "Description",  initial: true, required: true },
	
	createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }
});

/**
 * Model Registration
 */
Index.defaultSort = '-createdAt';
Index.defaultColumns = 'name, updatedAt';
Index.register();
