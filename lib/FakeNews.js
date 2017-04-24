'use strict';

class FakeNews {

	constructor() {

		this.Templates,
		this.keystone,
		this.Profiles,
		this.Events,
		this.roundCap = 12,

		this.badges = [],
		this.articlePool = [],
		this.profilePool = [],

		this.currentProfile,
		this.currentBuckets = [],
		this.articles,
		this.shared,
		this.followers,

		this.gameSocket,
		this.playerData,

		this.readers,
		this.gameEvents,
		this.shared,
		this.round,

		this.action_history = {};

	  }

	  Initialize(session) {

		console.log("initialize");

		// Init template loader with current game type - Credit to JR
		var TemplateLoader = require('./TemplateLoader');
		this.Templates = new TemplateLoader();

		this.keystone = require('keystone');

		this.Profiles = this.keystone.list('Profile').model;
		this.Articles = this.keystone.list('Article').model;

		// Grab the profiles
		this.Profiles.findOne({})
		.populate('trait1 trait2 trait3 opposite1 opposite2 opposite3')
		.exec((err, result) => {
			this.currentProfile = result;

			// Grab the articles
			this.Articles.find({})
			.populate('haters', 'key name')
			.populate('lovers', 'key name')
			.exec((err, result) => {

				this.articlePool = result;					

			});
		});
		
	 }

	 StartGame(socket, initial) {

	 	// Wow, this player is starting a game! There should be something done about that
		this.round = 0;
		this.gameSocket = socket;

		this.playerData = {};
	 	this.currentBuckets = [];

	 	console.log(this.currentProfile);

	 	// Find profile traits and translate them into follower buckets
		let bucket = {
			'trait': this.currentProfile.trait1,
			'opposite': this.currentProfile.opposite1,
			'ratio': this.currentProfile.ratio1
		}
		this.currentBuckets.push(bucket);
		bucket = {
			'trait': this.currentProfile.trait2,
			'opposite': this.currentProfile.opposite2,
			'ratio': this.currentProfile.ratio2
		}
		this.currentBuckets.push(bucket);
		bucket = {
			'trait': this.currentProfile.trait3,
			'opposite': this.currentProfile.opposite3,
			'ratio': this.currentProfile.ratio3
		}
		this.currentBuckets.push(bucket);

		// Grab a bucket or buckets depending on level
		this.currentBuckets = _.sample(_.shuffle(this.currentBuckets), this.currentProfile.level);
		

		let path = 'partials/game/profile';
		let data = {
		    currentProfile: this.currentProfile,
		    followers: this.currentBuckets
		};

		this.Templates.Load(path, data, (html) => {
			 // Send the new profile and events 
			 this.gameSocket.emit('game:newProfile', { html: html, data: data });

		});

		

	 }

	NewFeed(socket) {

	 	this.followers = 10000 * this.currentProfile.level;

	 	// Set the articles
		let path = 'partials/game/feed';
		let data = {
			currentProfile: this.currentProfile,
		    articles: _.sample(_.shuffle(this.articlePool), this.currentProfile.level * 10),
		    followerCount: this.followers
		};		

		this.Templates.Load(path, data, (html) => {

			// Send the new feed
			this.gameSocket.emit('game:newFeed', { html: html, data: data });

		});

	}

	CheckPost(socket, data) {

	 	console.log(data, " backend data")

		var currentArticle = _.where(this.articlePool, { key: data.post })[0];
		// set this article to shared
		currentArticle.shared = true;

		// Compare the profile buckets with this article's lovers
		_.each(currentArticle.lovers, (lover) => {
			_.each(this.currentBuckets, (bucket) => {
				// Get reaction
				if (bucket.trait.key == lover.key){
					this.CheckFollowers();
					this.gameSocket.emit('game:update', { 
						article: currentArticle.key, 
						reaction: 'likes', 
						followers: this.followers 
					});
					return;
				} else if (bucket.opposite.key == lover.key) {
					this.CheckFollowers();
					this.gameSocket.emit('game:update', { 
						article: currentArticle.key, 
						reaction: 'angry', 
						followers: this.followers 
					});
					return;
				} else {
					this.CheckFollowers();
					this.gameSocket.emit('game:update', { 
						article: currentArticle.key, 
						reaction: 'mixed', 
						followers: this.followers 
					});
					return;
				}

			});
		});

		// Compare the profile buckets with this article's haters
		_.each(currentArticle.haters, (hater) => {
			_.each(this.currentBuckets, (bucket) => {

				// Get reaction
				if (bucket.trait.key == hater.key) {
					console.log('like');
					this.CheckFollowers();
					this.gameSocket.emit('game:update', { 
						article: currentArticle.key, 
						reaction: 'likes', 
						followers: this.followers 
					});
					return;
				} else if (bucket.opposite.key == hater.key) {
					console.log('hate');
					this.CheckFollowers();
					this.gameSocket.emit('game:update', { 
						article: currentArticle.key, 
						reaction: 'angry', 
						followers: this.followers 
					});
					return;
				} else {
					console.log('neutral');
					this.CheckFollowers();
					this.gameSocket.emit('game:update', { 
						article: currentArticle.key, 
						reaction: 'mixed', 
						followers: this.followers 
					});
					return;
				}

			});
		});
		

	}

	// Check followers when article is shared
	CheckFollowers() {

	 	if (this.followers <= 5000 * this.currentProfile.level)
	 		FailProfile();
	 	else if (this.followers <= 8000 * this.currentProfile.level) {
	 		// send some comment notifications their way
	 		this.gameSocket.emit('game:update', { reaction: 'comment' });

	 	}

	}

	// Give players followers for popping reaction bubbles
	PostReaction(socket, reaction){

		if (reaction == 'likes')
		  this.followers += 100;
		else if (reaction == 'angry')
		  this.followers += 50;

		this.gameSocket.emit('game:update', { followers: this.followers });


	}

	

	 ProfileScore(socket) {

	 	this.gameSocket = socket;

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


	 FailProfile(socket) {

	 	this.gameSocket = socket;

	 	// Clear round

	 	// Send player back to badges screen

	 	// Send data
		this.gameSocket.emit('game:base', { state: 'fail', badges: this.badges });

	 }

	 CompleteProfile(socket) {

	 	this.gameSocket = socket;

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