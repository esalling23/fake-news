'use strict';

var coreModule = require('learning-games-core'),
    shuffle = coreModule.ShuffleUtil;

class FakeNews {

		constructor() {

      var Templates,
      keystone,
      Article,

      gameSocket,
      playerData,

      readers,
      articles,
      comments,

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

    PostScore(points, socket) {

      this.gameSocket.emit('post:score', {points: points});

    }

    CommentUpdate(socket) {

      this.gameSocket.emit("comment:update")

    }

    LoadComments(article) {

      article.comments = _.shuffle(article.comments);

      let path = 'partials/commenting';
      let data = article;

      this.Templates.Load(path, data, (html) => {

          this.gameSocket.emit("game:comments", { html: html, data: data });

      });

    }

    Comments(article) {

      // Set article attention level
      if (article.points > 12) {
        article.attention = 'high';
      } else if (article.points > 6) {
        article.attention = 'medium';
      } else {
        article.attention = 'low';
      }

      console.log(this.comments, " are all the comments");

      article.comments = [];

      _.each(this.comments, function(comment){

        // console.log(comment, " is a comment");

        _.each(comment.comments, function(item){

          let commentVersion = {
            username: _.shuffle(comment.username)[0], 
            text: item, 
            status: comment.status,
            image: comment.image
          }

          console.log(commentVersion, " is a new comment");

          article.comments.push(commentVersion);

        });
          
        
      });

      console.log(article.comments, " are all the comments");

      this.LoadComments(article);

    }

    Readers(article, audience) {

    	article.points = 0;

      article.audience = audience;

    	if (article.audience === 'vegans') {
    		if (article.thumbnail.status = 'Meaty') {
    			article.points -= 3;
    		} else if (article.thumbnail.status = 'Vegans') {
    			article.points += 3;
    		} else {
    			article.points += 1;
    		}
        if (article.headline.status = 'Meaty') {
          article.points -= 3;
        } else if (article.headline.status = 'Vegans') {
          article.points += 3;
        } else {
          article.points += 1;
        }

    	} else if (article.audience === 'meaties') {
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

      article.points += parseInt(article.thumbnail.catch);

      article.points += parseInt(article.headline.hook);

      this.playerData.article = article;

      this.Comments(article);

    }


    Share(space, audience) {

      console.log("this is the audience: ", audience);

    	this.Readers(space, audience);

    	this.readers += 1;

    }


    NewArticle(socket) {

      this.Article = this.keystone.list('Article').model;

      var queryArticles = this.Article.find({}).populate('thumbnails headlines comments');

      // Get data about this game's article
      queryArticles.exec((err, articles) => {

          this.articles = articles;
          let currentArticle = _.sample(shuffle(articles), 1);

          this.comments = currentArticle[0].comments;

          this.playerData.activeEvent = { id: currentArticle[0].id, event: currentArticle[0].name };

          let path = 'partials/create';
          let data = currentArticle;

          this.Templates.Load(path, data, (html) => {

              this.gameSocket.emit('game:create', { html: html, data: data });

          });          
      });

    }

	  StartGame(socket) {

      this.gameSocket = socket;

	  }

}

module.exports = FakeNews;