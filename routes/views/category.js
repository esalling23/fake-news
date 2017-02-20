/**
 * (Site name here)
 * Developed by Engagement Lab, 2016
 * ==============
 * Category page view controller.
 *
 * Help: http://keystonejs.com/docs/getting-started/#routesviews-firstview
 *
 * @class Category
 * @author 
 *
 * ==========
 */
var keystone = require('keystone'),
    Category = keystone.list('Category'),
    _ = require('underscore');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;

    // Init locals
    locals.section = 'category';

    view.on('init', function(next) {

        var queryIndex = Category.model.findOne({ key: req.params.category_id }, {}, {});
        queryIndex.exec(function(err, resultCat) {
            if (err) throw err;

            if(resultCat === null)
                return res.notfound('Cannot find category', 'Sorry, but it looks like the category you were looking for does not exist!');

            locals.category = resultCat;

            next();

        });
    });

    // Render the view
    view.render('category');

};
