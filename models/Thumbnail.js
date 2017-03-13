/**
 * (Site name here) 
 * 
 * Thumbnail page Model
 * @module Thumbnail
 * @class Thumbnail
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Thumbnail model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var Thumbnail = new keystone.List('Thumbnail', 
	{
		label: 'Thumbnails',
		singular: 'Thumbnail',
		track: true,
		autokey: { path: 'thumbnail_key', from: 'name', unique: true },
	});

/**
 * Model Fields
 * @main Thumbnail
 */
Thumbnail.add({

	name: { type: String, label: 'Name', required: true, initial: true },
	image: { type: Types.CloudinaryImage, label: 'Image' },
	createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }
}, 'stats', {
	status: { type: Types.Select, label: 'Status', options: 'Meaty, Vegan, Nuetral'}, 
	bias: { type: Types.Select, label: 'bias', options: 'In Favor, Against'}, 
	catch: { type: Types.Select, label: 'Eye-Catching Level', options: '1, 2, 3' }
});

/**
 * Model Registration
 */
Thumbnail.defaultSort = '-createdAt';
Thumbnail.defaultColumns = 'name, updatedAt';
Thumbnail.register();
