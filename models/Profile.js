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
	// username: { type: Types.TextArray, label: 'List of Possible Usernames' },
	cover: { type: Types.CloudinaryImage, label: 'Cover Photo' },
	image: { type: Types.CloudinaryImage, label: 'Icon' },
	bio: { type: Types.Markdown, label: 'About Bio'},
	traits: { 
		type: Types.Relationship,
	 	label: 'Traits that determine followers',
	 	ref: 'Trait', 
	 	many: true
	},
	alienMessage: { type: Types.Markdown, label: 'Message from the Aliens about understanding of this human' },
	level: { type: Number, label: 'The level this profile might appear on' },
	createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }

});

Profile.schema.statics.removeResourceRef = function(resourceId, callback) {

    Profile.model.update({
            $or: [{
                'traits': resourceId
            }]
        },

        {
            $pull: {
                'traits': resourceId
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
