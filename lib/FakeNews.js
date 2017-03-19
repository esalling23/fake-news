'use strict';


class FakeNews {

		constructor() {

      var Templates,
      keystone,
      Article,

      gameSocket,
      playerData,

      readers,
      articles,

      action_history = {};

	  }

	  Initialize(session) {

	  	console.log("initialize");

      // Init template loader with current game type - Credit to JR
      var TemplateLoader = require('./TemplateLoader');
      this.Templates = new TemplateLoader();

      this.keystone = require('keystone');

      this.playerData = {};

      this.Article = this.keystone.list('Article').model;

      var queryArticles = this.Article.find({}).populate('thumbnails headlines comments');

      // Get data about this session's deck
      queryArticles.exec((err, articles) => {

          this.articles = articles;

      });
      
    }

    LoadComments(article) {

      let path = 'partials/commenting';
      let data = this.playerData;

      this.Templates.Load(path, data, (html) => {

          this.gameSocket.emit("game:comments", { html:html, data: data });

      });

    }

    Comments(article, callback) {

      // Set article attention level
      if (article.points > 12) {
        article.attention = 'high';
      } else if (article.points > 6) {
        article.attention = 'medium';
      } else {
        article.attention = 'low';
      }

      var queryComments = this.Article.find({id: article.id}).populate('comments');

      // Get data about this session's deck
      queryComments.exec((err, commentData) => {

          this.comments = commentData.comments;

      });
      
      article.comments = this.comments;

      this.LoadComments(article);

    }

    Readers(article, audience) {

      console.log(audience);

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

    	console.log(article, " calculating space");

      this.playerData.article = article;

      this.Comments(article);

    }


    Share(space, audience) {

      console.log("this is the audience: ", audience);

    	console.log(space, ' sharing space');

    	this.Readers(space, audience);

    	this.readers += 1;

    }


    NewArticle() {

      let currentArticle = _.sample(shuffle(this.articles), 1);

      // console.log()
    }

	  StartGame(socket) {

      this.gameSocket = socket;

      this.NewArticle();

	  }

}

module.exports = FakeNews;