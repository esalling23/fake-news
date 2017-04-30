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

	name: { type: String, label: 'Trait Name', note: 'Make sure it sounds good: \'I am a ___\''},
	createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }

});


Trait.schema.pre('remove', function(next) {

  // Remove resource from all that referenced it 
    keystone.list('Profile').model.removeResourceRef(this._id, function(err, removedCount) {

        if(err)
            console.error(err);
    
        if(removedCount > 0)
            console.log("Removed " +  removedCount + " references to '"+ this._id + "'");
        
        next();

    });

    keystone.list('Article').model.removeResourceRef(this._id, function(err, removedCount) {

        if(err)
            console.error(err);
    
        if(removedCount > 0)
            console.log("Removed " +  removedCount + " references to '"+ this._id + "'");
        
        next();

    });



});
/**
 * Model Registration
 */
Trait.defaultSort = '-createdAt';
Trait.defaultColumns = 'name, updatedAt';
Trait.register();
