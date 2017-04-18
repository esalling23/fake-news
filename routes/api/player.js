var keystone = require('keystone');
var Player = keystone.list('Player');
var _ = require('underscore');

// Create a player profile
exports.create = function(req, res) {

    // Check if this user already has a profile
    console.log(req.query.name + " checking, checking")
    var query = Player.model.findOne({ username:req.query.name });
    query.exec(function (err, profile) {
        console.log("this is hwere we are");

        // Does this email already exist?
        if (profile) {
            console.log ("username in use - did you mean to sign in?");
            return;
        } else {
            console.log(" next step ")
            
            new Player.model({
                username: req.query.name,
                password: req.query.password
            }).save(function(err, newprofile) {

                if (err)
                    console.log(err);
                else {

                    res.send('/profile/' + newprofile.id);
                    console.log('success')
                }

            });

            

        }

    });

};


// Locate a Player profile
exports.get = function(req, res) {

	var locals = res.locals;
	var query = Player.model.findOne({username:req.query.name});	

	console.log(req.query)

	query.exec(function (err, player) {

		console.log(player, " is the player")

	    if (err || !player) return res.json({ msg: "we have not found your profile" });

	    var data = player.id;

	    player._.password.compare(req.query.password, function(err, result){

			if (result) {

				console.log("login successful");

		  		res.send('/profile/' + data);
			    
			  } else {

			  	console.log("wrong password");

			  	return res.json({
			        success: false,
			        msg: 'Sorry, wrong password'
			    });
			  	
			  }
	    });
	});
};