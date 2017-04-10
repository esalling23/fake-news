'use strict';

var coreModule = require('learning-games-core'),
	 shuffle = coreModule.ShuffleUtil;

class FakeNews {

		constructor() {

		var Templates,
		keystone,
		Profiles,
		Events,
		roundCap = 12,

		badges,
		profilePool = [],
		roundProfiles,

		currentProfile,
		currentEvents,
		articles,

		gameSocket,
		playerData,
		identityGrip,
		followers,

		readers,
		gameEvents,
		roundEvent,
		roundGoal,
		events,
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

	 SharedReaction(socket, reaction){

		if (reaction == 'likes')
		  this.followers += 500;
		else if (reaction == 'angry')
		  this.followers += 500;

	 }

	 

	 // CommentUpdate(socket, article) {

	  

	 //   // let articleModel = this.keystone.list('Article').model;

	 //   // var queryArticles = articleModel.findOne({ key: article });

	 //   // // Update this article's twisted score
	 //   // queryArticles.exec((err, article) => {

	 //   //     let score = article.twisted;

	 //   //     article.twisted = score + 1;
	 //   //     article.save();

	 //   //     this.gameSocket.emit("article:update", { msg: 'You updated that article!' });

	 //   // });

	 // }

	 CheckPost(socket, article) {

	 	console.log(this.articles);
		let currentArticle = _.where(this.articles, {key: article})[0];
		// add this to the shared articles this round
		this.shared.push(currentArticle);
		console.log(this.shared, " are the ones that are shared")

		console.log("checking");

		// Check if the article is neutral, neg, or pos
		if (currentArticle.status == this.roundGoal.stance) {

		  this.followers += 3000;
		  console.log(this.followers);
		  this.gameSocket.emit('game:update', { article: currentArticle, reaction: 'likes', followers: this.followers });

		} else {
		  
		  if (currentArticle.status == 'Negative' && this.roundGoal.stance == 'Positive'){
			 // Super loss
			 this.followers -= 3000;

			 console.log(this.followers);
			 this.gameSocket.emit('game:update', { article: currentArticle, reaction: 'angry', followers: this.followers });

		  } else if (currentArticle.status == 'Positive' && this.roundGoal.stance == 'Negative'){

			 // Super loss
			 this.followers -= 3000;
			 console.log(this.followers);
			 this.gameSocket.emit('game:update', { article: currentArticle, reaction: 'angry' });

		  }  else if (this.roundGoal.stance == 'Neutral'){

			 // Super loss
			 this.followers -= 3000;
			 console.log(this.followers);
			 this.gameSocket.emit('game:update', { article: currentArticle, reaction: 'angry', followers: this.followers });

		  } else {

			 // Neutral loss
			 console.log("neutral");
			 this.followers += 1000;
			 this.gameSocket.emit('game:update', { article: currentArticle, reaction: 'neutral', followers: this.followers });


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

	 NewFeed() {

		this.currentEvents = _.sample(shuffle(this.eventPool), 3);

		_.each(this.currentEvents, (event, index) => {
			// Add the event's articles to the list
			this.articles.push(event.articles[0]);

			// Check nuetrals
			_.each(event.neutrals, (neutral, ind) => {
				console.log(neutral, this.currentProfile.traits);
				if (_.contains(this.currentProfile.traits, { 'key': neutral.key })) {
					event.status = 'neutral';
					console.log(event, " here's an event with a status");
					return;
				}
			});
			// Check haters
			_.each(event.haters, (hater, ind) => {
				console.log(hater, this.currentProfile.traits);
				if (_.contains(this.currentProfile.traits, { 'key': hater.key })) {
					event.status = 'hate';
					console.log(event, " here's an event with a status");
					return;
				}
			});
			// Chekc lovers
			_.each(event.lovers, (lover, ind) => {
				console.log(lover, this.currentProfile.traits);
				if (_.contains(this.currentProfile.traits, { 'key': lover.key })) {
					event.status = 'love';
					console.log(event, " here's an event with a status");
					return;
				}
			});
		});

		let path = 'partials/game/feed';
		let data = {
			currentProfile: this.currentProfile,
		   currentEvents: this.currentEvents
		};

		this.Templates.Load(path, data, (html) => {
			 // Send the new event and goal 
			 this.gameSocket.emit('game:newFeed', { html: html, data: data });

		});

	 }

	 NewProfile() {

	 	this.events = [];

		this.identityGrip = 5;

		this.currentProfile = shuffle(_.where(this.profilePool, {level: this.round}))[0];

		let path = 'partials/game/profile';
		let data = {
		  currentProfile: this.currentProfile
		};

		this.Templates.Load(path, data, (html) => {
			 // Send the new profile and events 
			 this.gameSocket.emit('game:newProfile', { html: html, data: data });

		});
		
	 }

	 AdvanceRound(initial, data) {

		// Advance round
		this.round++;

		if (initial == true){

		  console.log("Round: ", this.round);
		  this.badges = {};
		  this.profilePool = data;
		  this.shared = [];
		  // // Send the rules event
		  // this.gameSocket.emit('game:rules', { msg: 'Rules!' });

		} else {

		  if (this.round == 3){
			 console.log("Round: ", this.round);

			 this.GameEnd();
		  } else {

		  	this.shared = [];

			 this.NewProfile();

		  }

		}

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

	 StartGame(socket) {

		this.round = 0;

		this.gameSocket = socket;

		this.profilePool = [];
		this.eventPool = [];

		this.articles = [];

		this.Profiles = this.keystone.list('Profile').model;
		this.Events = this.keystone.list('CurrentEvent').model;

		this.Profiles.find({}).populate('traits').exec((err, result) => {
			this.profilePool = result;
		});
		this.Events.find({}).populate('articles neutrals lovers haters').exec((err, result) => {
			this.eventPool = result;
		});

		this.AdvanceRound(true);

	 }

}

module.exports = FakeNews;