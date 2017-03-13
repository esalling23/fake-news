'use strict';


class FakeNews {

		constructor() {

      // super();

      // let randomstring = require('randomstring');

      this._current_tweet,
      this.randomizedHashtags,
      this._real_hashtag,
      
      // ID to indentify "real" hashtag
      // this.realId = randomstring.generate(),
      this.currentPlayerIndex = 0,

      this.readers,

      this.action_history = {};

	  }

	  Initialize(callback) {
	  	console.log("initialize")
      
      this.readers = 0;  

      this.action_history = {};
      
    }

    Readers(article, audience) {

    	let this.article_points = 0;

    	if (audience === 'vegans') {
    		if (article.thumbnail.status = 'Meaty') {
    			this.article_points -= 3;
    		} else if (article.thumbnail.status = 'Vegans') {
    			this.article_points += 3;
    		} else {
    			this.article_points += 1;
    		}
    	} else if (audience === 'meaty') {
    		if (article.thumbnail.status = 'Meaty') {
    			this.article_points += 3;
    		} else if (article.thumbnail.status = 'Vegans') {
    			this.article_points -= 3;
    		} else {
    			this.article_points += 1;
    		}
    	}

    	if (article.thumbnail.)

    	console.log(article, " calculating space");


    }


    Share(space, audience) {

    	console.log(space, ' sharing space');

    	this.Readers(space, audience);

    	this.readers += 1;
    }


	 StartGame(socket) {
	 	console.log("game starting");
	 }

}

module.exports = FakeNews;