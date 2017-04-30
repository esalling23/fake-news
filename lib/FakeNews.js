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
		this.reactions,
		this.shared,
		this.points,

		this.gameSocket,
		this.playerData,

		this.gameEvents,
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
		.populate('trait1 trait2 trait3 trait4 trait5 opposite1 opposite2 opposite3 opposite4 opposite5')
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

	 	let bucketPool = [];

	 	console.log(this.currentProfile);

	 	// Find profile traits and translate them into follower buckets
		let bucket = {
			'trait': this.currentProfile.trait1,
			'opposite': this.currentProfile.opposite1,
			'neutral': this.currentProfile.neutral1,
			'ratio': this.currentProfile.ratio1
		}
		bucketPool.push(bucket);
		// trait bucket #2
		bucket = {
			'trait': this.currentProfile.trait2,
			'opposite': this.currentProfile.opposite2,
			'neutral': this.currentProfile.neutral2,
			'ratio': this.currentProfile.ratio2
		}
		bucketPool.push(bucket);
		// trait bucket #3
		bucket = {
			'trait': this.currentProfile.trait3,
			'opposite': this.currentProfile.opposite3,
			'neutral': this.currentProfile.neutral3,
			'ratio': this.currentProfile.ratio3
		}
		bucketPool.push(bucket);
		// trait bucket #4
		bucket = {
			'trait': this.currentProfile.trait4,
			'opposite': this.currentProfile.opposite4,
			'neutral': this.currentProfile.neutral4,
			'ratio': this.currentProfile.ratio4
		}
		bucketPool.push(bucket);
		// trait bucket #5
		bucket = {
			'trait': this.currentProfile.trait5,
			'opposite': this.currentProfile.opposite5,
			'neutral': this.currentProfile.neutral5,
			'ratio': this.currentProfile.ratio5
		}
		bucketPool.push(bucket);

	 	this.points = 10000 * this.currentProfile.level;

		// Grab a bucket or buckets depending on level
		if (this.currentProfile.level == 1) {
			this.currentBuckets = _.initial(bucketPool, 3);
			this.currentBuckets.push( _.shuffle( _.rest(bucketPool, 2) )[0] )
		} else {
			this.currentBuckets = _.initial(bucketPool, 3);
			this.currentBuckets.push( _.shuffle( _.rest(bucketPool, 2) ) )
		}
		
		console.log(this.currentBuckets, " buckets....")
		let path = 'partials/game/profile';
		let data = {
		    currentProfile: this.currentProfile,
		    buckets: this.currentBuckets,
		    pointCount: this.points
		};

		this.Templates.Load(path, data, (html) => {
			 // Send the new profile and events 
			 this.gameSocket.emit('game:newProfile', { html: html, data: data });

		});

	 }

	NewFeed(socket) {

		this.playerData.incorrect = 0, 
		this.playerData.correct = 0;

		this.shareData = {
			'bad': [],
			'good': [],
			'neutral': []
		};
		var feed = [];

		_.each(this.currentBuckets, (bucket) => {
			// find some articles that relate to this!
			_.each(this.articlePool, function(article){
				console.log(article.lovers, bucket.trait.key);
				if ( _.contains(feed, article) == false ) {
					if (_.where(article.lovers, { 'key': bucket.trait.key }).length > 0 )
						feed.push(article); 
					else if (_.where(article.haters, { 'key': bucket.trait.key }).length > 0 )
						feed.push(article);
				}
			});

			console.log(feed, " feed");
			
		});

		console.log(feed.length)

	 	// Set the articles
		let path = 'partials/game/feed';
		let data = {
			currentProfile: this.currentProfile,
		    articles: _.shuffle(feed),
		    followerCount: this.points
		};		

		this.Templates.Load(path, data, (html) => {

			// Send the new feed
			this.gameSocket.emit('game:newFeed', { html: html, data: data });

		});

	}

	CheckPost(socket, data) {
		// reset reactions
		this.reactions = [];

	 	console.log(data, " backend data")

		var currentArticle = _.where(this.articlePool, { key: data.post })[0];

		currentArticle.shared = data.shared;

		let likes = [];
		let hates = [];
		
		_.each(this.currentBuckets, (bucket) => {
			// add the reactions!
			var reaction = this.CheckBucket(bucket, currentArticle.lovers, currentArticle.haters, data.shared);
			// console.log(reaction.length)
			if (reaction.length > 0)
				this.reactions.push(reaction);
		});
	
		let originalpoints = this.currentProfile.level * 10000;

		this.Checkpoints();
		this.gameSocket.emit('game:update', { 
			article: currentArticle.key, 
			reactions: this.reactions, 
			points: this.points
		});

	}

	CheckBucket(bucket, lovers, haters, shared) {

		// Compare the profile buckets with this article's lovers/haters
		console.log(bucket, shared);

		let lover = _.where(lovers, {'key':bucket.trait.key});
		let hater = _.where(haters, {'key':bucket.trait.key});

		// console.log(lover, hater)

		if (lover.length > 0) {
			console.log(bucket.trait.name + ' loves this');
			if (shared == true) {
				this.points += this.points * ( parseInt( bucket.ratio.split(':')[0] )/1000 );
				this.gameSocket.emit('game:update', { points: this.points });
				return 'likes';
			} else {
				this.points -= this.points * ( parseInt( bucket.ratio.split(':')[0] )/1000 );
				this.gameSocket.emit('game:update', { points: this.points });
				return 'wrong';
			}
		} else if (hater.length > 0) {
			console.log(bucket.trait.name + ' hates this');
			if (shared == true) {
				this.points += this.points * ( parseInt( bucket.ratio.split(':')[1] )/1000 );
				this.gameSocket.emit('game:update', { points: this.points });
				return 'angry';
			} else {
				this.points += this.points * ( parseInt( bucket.ratio.split(':')[0] )/1000 );
				this.gameSocket.emit('game:update', { points: this.points });
				return 'right';
			}

		} else {
			console.log(bucket.trait.name + ' doesn\'t care about this');
			let ratio = 100 - ( parseInt( bucket.ratio.split(':')[0] ) + parseInt( bucket.ratio.split(':')[1] ) );
			this.points += this.points * (ratio/1000);
			this.gameSocket.emit('game:update', { points: this.points });
			return '';
		}
		
	}

	// Check points when article is shared
	Checkpoints() {

	 	if (this.points <= 5000 * this.currentProfile.level)
	 		FailProfile();
	 	else if (this.points <= 8000 * this.currentProfile.level) {
	 		// send some comment notifications their way
	 		this.gameSocket.emit('game:update', { reaction: 'comment' });

	 	}

	}

	// Give players points for popping reaction bubbles
	PostReaction(socket, reaction){

		if (reaction == 'likes')
		  this.points += 50;
		else if (reaction == 'angry')
		  this.points -= 20;
		else if (reaction == 'angry-react') 
		  this.points += 20;

		this.gameSocket.emit('game:update', { points: this.points });

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

	

	 ProfileScore(socket) {

	 	this.gameSocket = socket;

	 	let shared = _.where(this.articlePool, { 'shared': true });

	 	let fake = _.where(shared, { 'fake': true });

		// Check if the player did well or not -- tell them!!
		if(this.points >= 5000 * this.currentProfile.level)
			this.CompleteProfile();
		else
			this.FailProfile();

		// Load end screen
		let path = 'partials/game/round';
		let data = {
		  currentProfile: this.currentProfile, 
		  articles: shared.length, 
		  fake: fake.length,
		  points: this.points
		};

		this.Templates.Load(path, data, (html) => {
			 // Send the new event and goal 
			 this.gameSocket.emit('profile:score', { html: html, data: data });

		});

	 }


	 

	 // For basic add/sub do not include reaction
	 // For reactions, num equals the ratio
	 
	 

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