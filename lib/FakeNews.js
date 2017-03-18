'use strict';


class FakeNews {

		constructor() {

      // super();

      // let randomstring = require('randomstring');

      
      // ID to indentify "real" hashtag
      // // this.realId = randomstring.generate(),
      var currentPlayerIndex = 0,

      readers,

      action_history = {};

	  }

	  Initialize(callback) {

	  	console.log("initialize");
      
      // readers = 0;  

      // action_history = {};
      
    }

    Readers(article, audience) {

    	article.points = 0;

    	if (audience === 'vegans') {
    		if (article.thumbnail.status = 'Meaty') {
    			article.points -= 3;
    		} else if (article.thumbnail.status = 'Vegans') {
    			article.points += 3;
    		} else {
    			article.points += 1;
    		}
        if (article.headling.status = 'Meaty') {
          article.points -= 3;
        } else if (article.headline.status = 'Vegans') {
          article.points += 3;
        } else {
          article.points += 1;
        }

    	} else if (audience === 'meaty') {
    		if (article.thumbnail.status = 'Meaty') {
    			article.points += 3;
    		} else if (article.thumbnail.status = 'Vegans') {
    			article.points -= 3;
    		} else {
    			article.points += 1;
    		}
        if (article.headline.status = 'Meaty') {
          article.points += 3;
        } else if (article.headline.status = 'Vegans') {
          article.points -= 3;
        } else {
          article.points += 1;
        }
    	}

      article.points += parseInt(article.thumbnail.eyeCatch);

      article.points += parseInt(article.headline.hookLvl);

    	// if (article.thumbnail.)

    	console.log(article, " calculating space");


    }


    Share(space, audience) {

    	// console.log(space, ' sharing space');

    	this.Readers(space, audience);

    	this.readers += 1;

    }


	 // StartGame(socket) {
	 // 	console.log("game starting");
	 // }

}

module.exports = FakeNews;