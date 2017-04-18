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

		badges = [],
		profilePool = [],
		roundProfiles,

		currentProfile,
		currentEvents,
		articles,
		freebies,

		gameSocket,
		playerData,
		identityGrip,

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

	 FailProfile() {

	 	// Restart the round

	 	// Send player back to badges screen

	 	// Send data
		this.gameSocket.emit('game:base', { state: 'fail', badges: this.badges });

	 }

	 CompleteProfile() {

	 	// Add profile to badges
	 	this.badges.push(this.currentProfile);

	 	delete _.where(this.profilePool, { key: this.currentProfile.key });

	 	this.gameSocket.emit('game:base', { state: 'won', badges: this.badges });


	 }

	 PostReaction(socket, reaction){

		if (reaction == 'likes')
		  this.identityGrip += 0.25;
		else if (reaction == 'angry')
		  this.identityGrip += 0.25;

		this.gameSocket.emit('game:update', { identityGrip: this.identityGrip });


	 }

	 CheckIdentity() {

	 	if (this.identityGrip == 0)
	 		FailProfile();
	 	else if (this.identityGrip <= 3){
	 		// send some comment notifications their way
	 		this.gameSocket.emit('game:update', { reaction: 'comment' });

	 	}

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

	 CheckPost(socket, data) {

	 	console.log(data, " backend data")

		let currentArticle = _.where(this.articles, {key: data.post})[0];
		let articleEvent = _.where(this.eventPool, {key: data.event})[0];
		// add this to the shared articles this round
		this.shared.push(currentArticle);

		console.log('article stance: ' + currentArticle.status, 'event status: ' + articleEvent.status);

		// Check if the article is neutral, neg, or pos
		if (currentArticle.status == articleEvent.status) {

		  this.identityGrip += 2;
		  console.log(this.identityGrip);
		  this.CheckIdentity();
		  this.gameSocket.emit('game:update', { article: currentArticle.key, reaction: 'likes', identityGrip: this.identityGrip });

		} else {
		  
		  if (currentArticle.status == 'haters' && articleEvent.status == 'lovers'){
			 // Super loss
			 this.identityGrip -= 2;
			 this.CheckIdentity();
			 console.log(this.identityGrip);
			 this.gameSocket.emit('game:update', { article: currentArticle.key, reaction: 'angry', identityGrip: this.identityGrip });

		  } else if (currentArticle.status == 'lovers' && articleEvent.status == 'haters'){

			 // Super loss
			 this.identityGrip -= 2;
			 this.CheckIdentity();
			 console.log(this.identityGrip);
			 this.gameSocket.emit('game:update', { article: currentArticle.key, reaction: 'angry', identityGrip: this.identityGrip});

		  } else if (articleEvent.status == 'neutrals'){

			 // Super loss
			 this.identityGrip -= 1;
			 this.CheckIdentity();
			 console.log(this.identityGrip);
			 this.gameSocket.emit('game:update', { article: currentArticle.key, reaction: 'angry', identityGrip: this.identityGrip });

		  } else {

			 // Neutral loss
			 console.log("neutral ", this.identityGrip);
			 this.identityGrip += 1;
			 this.CheckIdentity();
			 this.gameSocket.emit('game:update', { article: currentArticle, reaction: 'neutral', identityGrip: this.identityGrip });


		  }

		}



	 }

	 ProfileScore(socket) {

		// Check if the player did well or not -- tell them!!
		if(this.identityGrip >= 8)
			this.CompleteProfile();
		else
			this.FailProfile();

		// Load end screen
		let path = 'partials/game/round';
		let data = {
		  currentProfile: this.currentProfile, 
		  articles: this.shared, 
		  identityGrip: this.identityGrip
		};

		this.Templates.Load(path, data, (html) => {
			 // Send the new event and goal 
			 this.gameSocket.emit('profile:score', { html: html, data: data });

		});

	 }

	 NewFeed() {

		this.currentEvents = _.sample(shuffle(this.eventPool), this.round);

		_.each(this.currentEvents, (event, index) => {

			// Add in some freebies for this event
			_.each(this.freebies, (article) => {
				event.articles.push(article);
			});

			// Add the event articles to the list of freebies
			_.each(event.articles, (article) => {
				this.articles.push(article);
			});

			_.each(this.currentProfile.traits, (trait) => {
				_.each(event.neutrals, (neutral, ind) => {
					if (neutral.key == trait.key) {
						event.status = 'neutrals';
						console.log(event, " here's an event with a status");
						return;
					}
				});

				_.each(event.lovers, (lover, ind) => {
					if (lover.key == trait.key) {
						event.status = 'lovers';
						console.log(event, " here's an event with a status");
						return;
					}
				});

				_.each(event.haters, (hater, ind) => {
					if (hater.key == trait.key) {
						event.status = 'haters';
						console.log(event, " here's an event with a status");
						return;
					}
				});
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

	 StartRound() {

		// Advance round
		this.round++;

		if (this.round == 1){

		  console.log("Round: ", this.round);
		  this.badges = [];
		  this.shared = [];
		  // // Send the rules event
		  this.gameSocket.emit('game:rules', { msg: 'Rules!' });

		} else {

	  	    this.shared = [];

		    this.NewProfile();

		}

	 }

	 PlayerData() {

		// let path = 'partials/end';
		// let data = {
		//     identityGrip: this.identityGrip
		// };

		// this.Templates.Load(path, data, (html) => {
		// 	 // Send the new event and goal 
		// 	this.gameSocket.emit('game:end', { html: html, data: data });

		// });

	 }

	 StartGame(socket, initial) {

	 	// Wow, we have a new player! There should be something done about that

		this.round = 0;
		// 
		this.gameSocket = socket;

		this.profilePool = [];
		this.eventPool = [];

		this.articles = [];

		this.Profiles = this.keystone.list('Profile').model;
		this.Articles = this.keystone.list('Article').model;

		// Grab the profiles
		this.Profiles.find({})
		.populate('traits', 'key name max min opposite')
		.exec((err, result) => {
			this.profilePool = result;

			// Grab the articles
			this.Articles.find({})
			.populate('haters', 'key name opposite')
			.populate('lovers', 'key name opposite')
			.populate('neutrals', 'key name opposite')
			.exec((err, result) => {

				this.articlePool = result;
				
				this.gameSocket.emit('game:base', { state: 'new', badges: this.badges });					

			});
		});

	 }

}

module.exports = FakeNews;