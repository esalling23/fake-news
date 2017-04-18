/**
 * (Site name here) 
 * 
 * Trait page Model
 * @module Trait
 * @class Trait
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Trait model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var Trait = new keystone.List('Trait', 
	{
		label: 'Traits',
		singular: 'Trait',
		track: true,
		autokey: { path: 'key', from: 'name', unique: true },
	});

/**
 * Model Fields
 * @main Trait
 */
Trait.add({

	name: { type: String, label: 'Trait Name', hidden: true },
	max: { type: Number, label: 'Trait Percentage Max'},
	min: { type: Number, label: 'Trait Percentage Min'},
	opposite: { type: String, label: 'Trait Opposite', note: 'Should match another trait to work properly'},
	createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }

});

/**
 * Model Registration
 */
Trait.defaultSort = '-createdAt';
Trait.defaultColumns = 'name, updatedAt';
Trait.register();
