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
	image: { type: Types.CloudinaryImage, label: 'Profile Image' },
	bio: { type: Types.Markdown, label: 'Profile About Bio'},
	alienMessage: { type: Types.Markdown, label: 'Initial message from the Aliens about understanding of this human' },
	alienGood: { type: Types.TextArray, label: 'Alien esponses to players doing well', note: 'Should be in increasingly dramatic tone, up to 3 messages'},
	alienBad: { type: Types.TextArray, label: 'Alien esponses to players doing poorly', note: 'Should be in increasingly dramatic tone, up to 3 messages'},
	commentsGood: { type: Types.TextArray, label: 'Follower responses to players doing well', note: 'Should be in increasingly dramatic tone, up to 3 messages'},
	commentsBad: { type: Types.TextArray, label: 'Follower responses to players doing poorly', note: 'Should be in increasingly dramatic tone, up to 3 messages'},
	level: { type: Number, label: 'The level this profile might appear on' },
	createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }
}, 'Follower Bucket 1', {
	trait1: { 
		type: Types.Relationship,
	 	label: 'Trait for follower bucket 1',
	 	note: 'This one will be static - it will ALWAYS show up',
	 	ref: 'Trait', 
	 	many: false
	},
	opposite1: { 
		type: Types.Relationship,
	 	label: 'Trait for follower bucket 1',
	 	ref: 'Trait', 
	 	many: false
	},
	neutral1: { type: Boolean, label: 'Neutral?' },
	ratio1: { type: String, label: 'Ratio', note: 'Should be in 40:20 format, adding up to 100 or less. If less, leftover is nuetral parties.'}

}, 'Follower Bucket 2', {
	trait2: { 
		type: Types.Relationship,
	 	label: 'Trait for follower bucket 2',
	 	note: 'This one will be randomized - it MIGHT show up',
	 	ref: 'Trait', 
	 	many: false
	},
	opposite2: { 
		type: Types.Relationship,
	 	label: 'Trait for follower bucket 2',
	 	ref: 'Trait', 
	 	many: false
	},
	neutral2: { type: Boolean, label: 'Neutral?' },
	ratio2: { type: String, label: 'Ratio', note: 'Should be in 40:20 format, adding up to 100 or less. If less, leftover is nuetral parties.'}

}, 'Follower Bucket 3', {
	trait3: { 
		type: Types.Relationship,
	 	label: 'Trait for follower bucket 3',
	 	note: 'This one will be randomized - it MIGHT show up',
	 	ref: 'Trait', 
	 	many: false
	},
	opposite3: { 
		type: Types.Relationship,
	 	label: 'Trait for follower bucket 3',
	 	ref: 'Trait', 
	 	many: false
	},
	neutral3: { type: Boolean, label: 'Neutral?' },
	ratio3: { type: String, label: 'Ratio', note: 'Should be in 40:20 format, adding up to 100 or less. If less, leftover is nuetral parties.'}

}, 'Follower Bucket 4', {
	trait4: { 
		type: Types.Relationship,
	 	label: 'Trait for follower bucket 4',
	 	note: 'This one will be randomized - it MIGHT show up',
	 	ref: 'Trait', 
	 	many: false
	},
	opposite4: { 
		type: Types.Relationship,
	 	label: 'Trait for follower bucket 4',
	 	ref: 'Trait', 
	 	many: false
	},
	neutral4: { type: Boolean, label: 'Neutral?' },
	ratio4: { type: String, label: 'Ratio', note: 'Should be in 40:20 format, adding up to 100 or less. If less, leftover is nuetral parties.'}

}, 'Follower Bucket 5', {
	trait5: { 
		type: Types.Relationship,
	 	label: 'Trait for follower bucket 5',
	 	note: 'This one will be randomized - it MIGHT show up',
	 	ref: 'Trait', 
	 	many: false
	},
	opposite5: { 
		type: Types.Relationship,
	 	label: 'Trait for follower bucket 5',
	 	ref: 'Trait', 
	 	many: false
	},
	neutral5: { type: Boolean, label: 'Neutral?' },
	ratio5: { type: String, label: 'Ratio', note: 'Should be in 40:20 format, adding up to 100 or less. If less, leftover is nuetral parties.'}

});

Profile.schema.statics.removeResourceRef = function(resourceId, callback) {

    Profile.model.update({
            $or: [{
                'trait1': resourceId, 
                'trait2': resourceId,
                'trait3': resourceId,
                'trait4': resourceId,
                'trait5': resourceId,
                'opposite1': resourceId,
                'opposite2': resourceId,
                'opposite3': resourceId,
                'opposite4': resourceId,
                'opposite5': resourceId
            }]
        },

        {
            $pull: {
                'trait1': resourceId, 
                'trait2': resourceId,
                'trait3': resourceId,
                'trait4': resourceId,
                'trait5': resourceId,
                'opposite1': resourceId,
                'opposite2': resourceId,
                'opposite3': resourceId,
                'opposite4': resourceId,
                'opposite5': resourceId
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
