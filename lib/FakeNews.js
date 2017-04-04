'use strict';

var coreModule = require('learning-games-core'),
    shuffle = coreModule.ShuffleUtil;

class FakeNews {

		constructor() {

      var Templates,
      keystone,
      currentEvent,

      gameSocket,
      playerData,
      followers,

      readers,
      gameEvents,
      roundEvent,
      roundGoal,
      articles,
      shared,
      round,

      action_history = {};

	  }

	  Initialize(session) {

	  	console.log("initialize");

      // Init template loader with current game type - Credit to JR
      var TemplateLoader = require('./TemplateLoader');
      this.Templates = new TemplateLoader();

      this.keystone = require('keystone');

      // this.playerData = {
      //   
      // };


      
    }

    GameEnd() {

      let path = 'partials/end';
      let data = { 
        followers: this.followers
      };

      this.Templates.Load(path, data, (html) => {

          // Send the new event and goal 
          this.gameSocket.emit('game:end', { html: html, data: data });

      });

    }

    CommentReaction(socket, reaction){

      if (reaction == 'likes')
        this.followers += 500;
      else if (reaction == 'angry')
        this.followers += 500;

    }

    

    // CommentUpdate(socket, comment) {

     

    //   // let articleModel = this.keystone.list('Article').model;

    //   // var queryArticles = articleModel.findOne({ key: comment });

    //   // // Update this article's twisted score
    //   // queryArticles.exec((err, article) => {

    //   //     let score = article.twisted;

    //   //     article.twisted = score + 1;
    //   //     article.save();

    //   //     this.gameSocket.emit("comment:update", { msg: 'You updated that article!' });

    //   // });

    // }

    CheckComment(socket, comment) {

      let article = _.where(this.articles, {key: comment})[0];
      // add this to the shared articles this round
      this.shared.push(article);

      console.log("checking");

      // Check if the comment is neutral, neg, or pos
      if (article.status == this.roundGoal.stance) {

        this.followers += 3000;
        console.log(this.followers);
        this.gameSocket.emit('game:update', { article: comment, reaction: 'likes' });

      } else {
        
        if (article.status == 'Negative' && this.roundGoal.stance == 'Positive'){

          // Super loss
          this.followers -= 3000;

          console.log(this.followers);
          this.gameSocket.emit('game:update', { article: comment, reaction: 'angry' });

        } else if (article.status == 'Positive' && this.roundGoal.stance == 'Negative'){

          // Super loss
          this.followers -= 3000;
          console.log(this.followers);
          this.gameSocket.emit('game:update', { article: comment, reaction: 'angry' });

        }  else if (this.roundGoal.stance == 'Neutral'){

          // Super loss
          this.followers -= 3000;
          console.log(this.followers);
          this.gameSocket.emit('game:update', { article: comment, reaction: 'angry' });

        } else {

          // Neutral loss
          console.log("neutral");
          this.followers += 1000;

        }

      }

    }

    EventScore(socket) {

      // Check if the player did well or not -- tell them!!


      // Send data
      let path = 'partials/round';
      let data = {
        currentEvent: this.roundEvent.name, 
        goal: this.roundGoal,
        articles: this.shared, 
        followers: this.followers
      };

      this.Templates.Load(path, data, (html) => {

          // Send the new event and goal 
          this.gameSocket.emit('event:score', { html: html, data: data });

      });

    }

    NewEvent() {

      // If there is only one event left...
      if (Array.isArray(this.gameEvents)) {

        // Grab this round's event
        this.roundEvent = this.gameEvents[0];
        // Remove that event - NO REPEATS!!
        this.gameEvents = this.gameEvents.shift();

      } else {

        console.log('why look at that we are on the last round');

        this.roundEvent = this.gameEvents;

      }


      this.articles = shuffle(this.roundEvent.articles);

      let eventGoals = [
        { Neutral: this.roundEvent.neutral }, 
        { Positive: this.roundEvent.posSide },
        { Negative: this.roundEvent.negSide },  
      ];

      let goal = _.sample(shuffle(eventGoals), 1)[0];

      // Get the key
      let eventStance = Object.keys(goal)[0];
      // Get the text
      let stanceText = goal[eventStance].html

      this.roundGoal.stance = eventStance;
      this.roundGoal.text = stanceText;

      let path = 'partials/event';
      let data = {
        currentEvent: this.roundEvent, 
        goal: this.roundGoal,
        articles: this.articles
      };

      this.Templates.Load(path, data, (html) => {

          // Send the new event and goal 
          this.gameSocket.emit('game:newEvent', { html: html, data: data });

      });

    }

    AdvanceRound(initial) {

      // Advance round
      this.round++;

      if (initial == true){

        // console.log(" first round, shouwing  the rules");

        // // Send the rules event
        // this.gameSocket.emit('game:rules', { msg: 'Rules!' });

      } else {

        if (this.round == 3){
          this.GameEnd();
        } else {

          // reset?
          this.shared = [];
          this.roundGoal = {};
          this.roundEvent = {};

          this.NewEvent();
          
          console.log("Round: ", this.round);

        }

      }

    }

    GameEnd() {

      this.gameSocket.emit("game:over", { msg: 'Game Over!' });

    }

    StartGame(socket) {

      this.gameSocket = socket;

      this.currentEvent = this.keystone.list('CurrentEvent').model;

      var queryEvents = this.currentEvent.find({}).populate('articles');

      // Get data about this game's currentEvent
      queryEvents.exec((err, currentEvents) => {

          // Grab one event for each round (12) 
          this.gameEvents = _.sample(shuffle(currentEvents), 2);

          this.round = 0;

          this.followers = 200000;

          this.roundGoal = {};

          this.roundEvent = {};

          this.shared = [];

          this.AdvanceRound(true);
        
      });

    }

}

module.exports = FakeNews;