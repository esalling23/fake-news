/**
 * (Site name here) 
 * 
 * Headline page Model
 * @module Headline
 * @class Headline
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Headline model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var Headline = new keystone.List('Headline', 
	{
		label: 'Headlines',
		singular: 'Headline',
		track: true,
		autokey: { path: 'headline_key', from: 'name', unique: true }, 
		map: { name: 'headlineText' }
	});

/**
 * Model Fields
 * @main Headline
 */
Headline.add({

	name: { type: String, label: 'Name', hidden: true },
	headlineText: { type: Types.Text, label: 'Headline Text', required: true, initial: true },
	createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }
}, 'Stats', {
	status: { type: Types.Select, label: 'Status', options: 'Meaty, Vegan, Nuetral'},
	bias: { type: Types.Select, label: 'bias', options: 'High, Low, Medium'}, 
	truth: { type: Types.Select, label: 'truth', options: 'Fact, Fiction, Alternative Fact'}, 
	hookLvl: { type: Types.Select, label: 'Hook Level', options: '1, 2, 3'}
});

/**
 * Model Registration
 */
Headline.defaultSort = '-createdAt';
Headline.defaultColumns = 'name, updatedAt';
Headline.register();
