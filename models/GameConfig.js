 /**
  * Emerging Citizens
  * 
  * GameConfig Model
  * @module models
  * @class GameConfig
  * @author Johnny Richardson
  * 
  * For field docs: http://keystonejs.com/docs/database/
  *
  * ==========
  */
 var keystone = require('keystone');
 var Types = keystone.Field.Types;

 /**
  * GameConfig Model
  * ==========
  */

 var GameConfig = new keystone.List('GameConfig', {
     label: 'Games Config',
     track: true,
     candelete: true,
     cancreate: true
 });

 GameConfig.add({

    name: { type: String }, 
    rounds: { type: Number, label: 'Round Cap'}
     
});

 GameConfig.schema.pre('save', function(next) {

     this.name = this.name.toUpperCase();

     next();

 });
 /**
  * Registration
  */

 GameConfig.defaultColumns = 'gameType';
 GameConfig.register();