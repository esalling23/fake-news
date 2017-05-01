/**
 * (Site name here) 
 * 
 * Article page Model
 * @module Article
 * @class Article
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;



/**
 * Article model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var Article = new keystone.List('Article', 
	{
		label: 'Articles',
		singular: 'Article',
		track: true,
		autokey: { path: 'key', from: 'name', unique: true },
	});

/**
 * Model Fields
 * @main Article
 */
Article.add({

	name: { type: String, label: 'Headline', required: true, initial: true },
	user: { type: String, label: 'Username', note: 'This could be a fake username, a real individual\'s name, or a company/brand/group'},
	thumbnail: { type: Types.CloudinaryImage, label: 'User Thumbnail Image' },
	cover: { type: Types.CloudinaryImage, label: 'Post Cover Photo'},
	comments: { type: Types.TextArray, label:'Potential Comments' },
	fake: { type: Boolean, label: 'Fake News?'},
	debunked : { type: Types.TextArray, label: 'Debunked messages', dependsOn: {'fake': true}},
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
	},
	createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }

});

Article.schema.statics.removeResourceRef = function(resourceId, callback) {

    Article.model.update({
            $or: [{
                'lovers': resourceId, 
                'haters': resourceId
            }]
        },

        {
            $pull: {
                'haters': resourceId,
                'lovers': resourceId
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
Article.defaultSort = '-createdAt';
Article.defaultColumns = 'name, updatedAt';
Article.register();
