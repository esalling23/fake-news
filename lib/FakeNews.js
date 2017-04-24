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
		articlePool,
		profilePool = [],
		roundProfiles,

		currentProfile,
		currentBuckets,
		articles,
		shared,
		followers,

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
		.exec((err, result) => {
			this.profilePool = result;

			// Grab the articles
			this.Articles.find({})
			.populate('haters', 'key name opposite')
			.populate('lovers', 'key name opposite')
			.populate('neutrals', 'key name opposite')
			.exec((err, result) => {

				this.articlePool = result;
				
				this.gameSocket.emit('game:base', { state: 'new', data: this.profilePool });

				let path = 'partials/game/levels';
				let data = {
				    profile: this.profilePool
				};

				this.Templates.Load(path, data, (html) => {
					 // Send the new profile and events 
					 this.gameSocket.emit('game:levels', { html: html, data: data });

				});					

			});
		});

	 }

	 StartRound(socket, profile) {

	 	let followers = {};
	 	this.playerData = {};

		// We are going to start a new profile now!
		this.identityGrip = 5;

		// Find the profile
		this.Profiles.findOne({'key':profile})
		.populate('trait1 trait2 trait3 opposite1 opposite2 opposite3')
		.exec((err, result) => {
			console.log(result);
			this.currentProfile = result;
			// Find profile traits and translate them into follower buckets
			this.currentBuckets = [];
			let bucket = {
				'trait': result.trait1,
				'opposite': result.opposite1,
				'ratio': result.ratio1
			}
			this.currentBuckets.push(bucket);
			bucket = {
				'trait': result.trait2,
				'opposite': result.opposite2,
				'ratio': result.ratio2
			}
			this.currentBuckets.push(bucket);
			bucket = {
				'trait': result.trait3,
				'opposite': result.opposite3,
				'ratio': result.ratio3
			}
			this.currentBuckets.push(bucket);

			console.log(this.currentBuckets, " the current buckets")

			// Grab a bucket or buckets depending on level
			this.currentBuckets = _.sample(_.shuffle(this.currentBuckets), this.currentProfile.level);
			
			console.log(followers, " the shuffled, sampled buckets");

			let path = 'partials/game/profile';
			let data = {
			    currentProfile: this.currentProfile,
			    followers: this.currentBuckets
			};

			this.Templates.Load(path, data, (html) => {
				 // Send the new profile and events 
				 this.gameSocket.emit('game:newProfile', { html: html, data: data });

			});
			
		});

		
	 }

	 NewFeed() {

	 	this.followers = 10000 * this.currentProfile.level;

	 	// Set the articles
	 	this.articlePool = _.sample(_.shuffle(this.articlePool), this.currentProfile.level * 10);
	 	console.log(this.articlePool.length)

		let path = 'partials/game/feed';
		let data = {
			currentProfile: this.currentProfile,
		    articles: this.articlePool
		};		

		this.Templates.Load(path, data, (html) => {

			this.playerData.articles = this.articlePool;
			console.log(this.playerData);
			 // Send the new event and goal 
			 this.gameSocket.emit('game:newFeed', { html: html, data: data });

		});

	 }

	CheckPost(socket, data) {

	 	console.log(data, " backend data")	

	 	// resent these stupid annoying variables 
	 	this.articlePool = data.articles;
	 	this.currentProfile = data.profile;

		let currentArticle = _.where(this.articlePool, { key: data.post });
		// set this article to shared
		currentArticle.shared = true;

		console.log(currentArticle);

		// Compare the profile buckets with this article's lovers
		_.each(currentArticle.lovers, (lover) => {
			console.log(lover)
			_.each(this.currentBuckets, (bucket) => {

				// Get reaction
				if (bucket.trait.key == lover.key)
					console.log('like');
				else if (bucket.opposite.key == lover.key)
					console.log('hate');
				else
					console.log('neutral');

			});
		});

		// Compare the profile buckets with this article's haters
		_.each(currentArticle.haters, (hater) => {
			console.log(hater)
			_.each(this.currentBuckets, (bucket) => {

				// Get reaction
				if (bucket.trait.key == hater.key) {
					console.log('like');
				} else if (bucket.opposite.key == hater.key) {
					console.log('hate');
				} else {
					console.log('neutral');
				}

			});
		});
		

	}


	 PostReaction(socket, reaction){

		if (reaction == 'likes')
		  this.followers += 100;
		else if (reaction == 'angry')
		  this.followers -= 100;

		this.gameSocket.emit('game:update', { followers: this.followers });


	 }

	CheckFollowers() {

	 	if (this.followers <= 5000 * this.currentProfile.level)
	 		FailProfile();
	 	else if (this.followers <= 8000 * this.currentProfile.level) {
	 		// send some comment notifications their way
	 		this.gameSocket.emit('game:update', { reaction: 'comment' });

	 	}

	 }

	 ProfileScore(socket) {

	 	let shared = _.where(this.articlePool, { 'shared': true });

	 	let fake = _.where(shared, { 'fake': true });

		// Check if the player did well or not -- tell them!!
		if(this.followers >= 5000 * this.currentProfile.level)
			this.CompleteProfile();
		else
			this.FailProfile();

		// Load end screen
		let path = 'partials/game/round';
		let data = {
		  currentProfile: this.currentProfile, 
		  articles: shared.length, 
		  fake: fake.length,
		  followers: this.followers
		};

		this.Templates.Load(path, data, (html) => {
			 // Send the new event and goal 
			 this.gameSocket.emit('profile:score', { html: html, data: data });

		});

	 }


	 FailProfile() {

	 	// Clear round

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

	 

}

module.exports = FakeNews;