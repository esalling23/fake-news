/**
 * (Site name here)
 * Developed by Engagement Lab, 2016
 * ==============
 * Index page view controller.
 *
 * Help: http://keystonejs.com/docs/getting-started/#routesviews-firstview
 *
 * @class Index
 * @author 
 *
 * ==========
 */
var keystone = require('keystone'),
    Index = keystone.list('Index'),
    Category = keystone.list('Category'),
    _ = require('underscore');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;

    // Init locals
    locals.section = 'index';

    view.on('init', function(next) {

        var queryIndex = Index.model.findOne({}, {}, {
            sort: {
                'createdAt': -1
            }
        });
        queryIndex.exec(function(err, resultIndex) {
            if (err) throw err;

            locals.index = resultIndex;

            var queryCategory = Category.model.find({}, {}, {
                sort: {
                    'createdAt': -1
                }
            });

            queryCategory.exec(function(err, resultCats) {
                if (err) throw err;

                locals.categories = resultCats;
                
                next();

            });

        });
    });

    // Render the view
    view.render('index');

};
