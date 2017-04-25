var keystone = require('keystone');
var Player = keystone.list('Player');
var _ = require('underscore');

// Update the player profile to save their game data
exports.update = function(req, res) {

    var profile = req.query.profile, 
        score = req.query.score;

    Player.model.findOne({ '_id': req.query.id }).exec(function(err, player) {
        if (err) throw err;

        player.badges.push({
        	'profile': profile,
        	'score': score
    	});

        player.save();

        // Send player back to base
        res.send('/profile/' + player._id);

    });

};
