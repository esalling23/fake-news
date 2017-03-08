'use strict';


class FakeNews {

		constructor() {

      // super();

      let randomstring = require('randomstring');

      this._current_tweet,
      this.randomizedHashtags,
      this._real_hashtag,
      
      // ID to indentify "real" hashtag
      this.realId = randomstring.generate(),
      this.currentPlayerIndex = 0,

      this.allHashtags = {},
      this._all_tweets;

	  }

	  Initialize(callback) {
	  	console.log("initialize")
        
        // Invoke common method
        // super.Initialize(gameSession, require('keystone'), require('app-root-path'), () => {
            
        //     var Article = this.keystone.list('Article').model;

        //     // Populate content buckets for this session
        //     Article.find({}, (err, result) => {

        //         // Randomize tweets
        //         var tweets = result;

        //         console.log(tweets);
                
        //         // Save tweet IDs to the model's 'tweets' key and then cache all tweet data for this session
        //         this._game_session.tweets = tweets;
        //         this._all_tweets = tweets;
                
        //     }).populate("category");
        // });
    
    }


	 StartGame(socket) {
	 	console.log("game starting");
	 }

}

module.exports = FakeNews;