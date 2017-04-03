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

      readers,
      currentEvent,
      healines,

      action_history = {};

	  }

	  Initialize(session) {

	  	console.log("initialize");

      // Init template loader with current game type - Credit to JR
      var TemplateLoader = require('./TemplateLoader');
      this.Templates = new TemplateLoader();

      this.keystone = require('keystone');

      this.playerData = {};
      
    }

    CommentUpdate(socket, comment) {

      console.log(comment, " is this updating comment")

      let articleModel = this.keystone.list('Article').model;

      var queryArticles = articleModel.findOne({ key: comment });

      // Update this article's twisted score
      queryArticles.exec((err, article) => {

          console.log(article, " is an article");

          let score = article.twisted;
          console.log(score, " is the curent socre")

          article.twisted = score + 1;
          article.save();

          console.log(article, " is the edited article");

          this.gameSocket.emit("comment:update", { msg: 'You updated that article!' });

      });

    }

    CheckComments(socket, comment) {

      console.log(comment, " is this landed comment")

      let articleModel = this.keystone.list('Article').model;

      var queryArticles = articleModel.findOne({ key: comment });

      // Find the landed articles score
      queryArticles.exec((err, article) => {

          let score = article.twisted;
          console.log(score, " is the curent socre")

          this.gameSocket.emit("score:update", { score: score });

      });

    }

    EventScore(socket) {

      this.gameSocket.emit("event:score")

    }

    NewEvent(socket) {

      this.currentEvent = this.keystone.list('CurrentEvent').model;

      var queryEvents = this.currentEvent.find({}).populate('articles');

      // Get data about this game's currentEvent
      queryEvents.exec((err, currentEvents) => {

          this.currentEvent = _.sample(shuffle(currentEvents), 1);

          this.articles = this.currentEvent[0].articles;

          this.playerData.activeEvent = { 
            id: this.currentEvent[0].id, 
            name: this.currentEvent[0].name 
          };

          let path = 'partials/event';
          let data = {
            currentEvent: this.currentEvent[0], 
            articles: this.articles
          };

          this.Templates.Load(path, data, (html) => {

              this.gameSocket.emit('game:newEvent', { html: html, data: data });

          });          
      });

    }

	  StartGame(socket) {

      this.gameSocket = socket;

	  }

}

module.exports = FakeNews;