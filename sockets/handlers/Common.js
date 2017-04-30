/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * Common game socket handler.
 *
 * @class sockets/handlers
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */

var Common = function (nsp, socket) {
    var currentSpace = nsp,
        currentSocket = socket, 
        appRoot = require('app-root-path')
        Session = require(appRoot + '/lib/SessionManager');

    // Expose handler methods for events
    this.handler = {

        'game:tutorial': function(package) {

            Session.Get(package.gameId).
            StartTutorial(currentSpace);
            
        },

        'game:start': function(package) {

            Session.Get(package.gameId).
            StartGame(currentSpace);

        },

        'game:newRound': function(package) {

            Session.Get(package.gameId).
            StartRound(currentSpace, package.profile);

        },

        'game:newProfile': function(package) {

            Session.Get(package).
            NewProfile(currentSpace);

        },

        'game:newFeed': function(package) {

            Session.Get(package).
            NewFeed(currentSpace);

        },

        'feed:reaction': function(package) {

            Session.Get(package.gameId).
            PostReaction(currentSpace, package.reaction);

        },

        // 'feed:skip': function(package) {

        //     Session.Get(package.gameId).
        //     CheckPost(currentSpace, package.data);

        // },

        'feed:skip': function(package) {

            Session.Get(package.gameId).
            CheckPost(currentSpace, package.data);

        },

        'feed:share': function(package) {

            Session.Get(package.gameId).
            CheckPost(currentSpace, package.data);

        },

        'feed:end': function(package) {

            Session.Get(package.gameId).
            ProfileScore(currentSpace);

        }
    
    };
}

module.exports = Common;