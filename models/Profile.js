/**
 * (Site name here) 
 * 
 * Profile page Model
 * @module Profile
 * @class Profile
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Profile model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var Profile = new keystone.List('Profile', 
	{
		label: 'Profiles',
		singular: 'Profile',
		track: true,
		autokey: { path: 'key', from: 'name', unique: true },
	});

/**
 * Model Fields
 * @main Profile
 */
Profile.add({

	name: { type: String, label: 'Profile Name', hidden: true },
	cover: { type: Types.CloudinaryImage, label: 'Cover Photo' },
	image: { type: Types.CloudinaryImage, label: 'Icon' },
	bio: { type: Types.Markdown, label: 'About Bio'},
	alienMessage: { type: Types.Markdown, label: 'Message from the Aliens about understanding of this human' },
	level: { type: Number, label: 'The level this profile might appear on' },
	createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }
}, 'Follower Bucket 1', {
	trait1: { 
		type: Types.Relationship,
	 	label: 'Trait for follower bucket 1',
	 	ref: 'Trait', 
	 	many: false, 
	 	note: 'Honestly do you really need more than three'
	},
	opposite1: { 
		type: Types.Relationship,
	 	label: 'Trait for follower bucket 1',
	 	ref: 'Trait', 
	 	many: false, 
	 	note: 'Honestly do you really need more than three'
	},
	ratio1: { type: String, label: 'Ratio', note: 'Should be in 30:70 format so that the numbers add up to 100'}

}, 'Follower Bucket 2', {
	trait2: { 
		type: Types.Relationship,
	 	label: 'Trait for follower bucket 1',
	 	ref: 'Trait', 
	 	many: false, 
	 	note: 'Honestly do you really need more than three'
	},
	opposite2: { 
		type: Types.Relationship,
	 	label: 'Trait for follower bucket 1',
	 	ref: 'Trait', 
	 	many: false, 
	 	note: 'Honestly do you really need more than three'
	},
	ratio2: { type: String, label: 'Ratio', note: 'Should be in 30:70 format so that the numbers add up to 100'}

}, 'Follower Bucket 3', {
	trait3: { 
		type: Types.Relationship,
	 	label: 'Trait for follower bucket 1',
	 	ref: 'Trait', 
	 	many: false, 
	 	note: 'Honestly do you really need more than three'
	},
	opposite3: { 
		type: Types.Relationship,
	 	label: 'Trait for follower bucket 1',
	 	ref: 'Trait', 
	 	many: false, 
	 	note: 'Honestly do you really need more than three'
	},
	ratio3: { type: String, label: 'Ratio', note: 'Should be in 30:70 format so that the numbers add up to 100'}

});

Profile.schema.statics.removeResourceRef = function(resourceId, callback) {

    Profile.model.update({
            $or: [{
                'trait1': resourceId, 
                'trait2': resourceId,
                'trait3': resourceId,
                'opposite1': resourceId,
                'opposite2': resourceId,
                'opposite3': resourceId
            }]
        },

        {
            $pull: {
                'trait1': resourceId, 
                'trait2': resourceId,
                'trait3': resourceId,
                'opposite1': resourceId,
                'opposite2': resourceId,
                'opposite3': resourceId
            }
        },

        {
            multi: true
        },

        function(err, result) {

            callback(err, result);

            if (err)
                console.error(err);
        }
    );

};

/**
 * Model Registration
 */
Profile.defaultSort = '-createdAt';
Profile.defaultColumns = 'name, updatedAt';
Profile.register();
