var _ =           require('underscore')
    , path =      require('path')
    , DataBase = require('../modules/db/db.coffee')
    , basicAuth = require('../controllers/bAuth.coffee')

var routes = [

    // All other get requests should be handled by AngularJS's client-side routing system
    {
        path: '/*',
        httpMethod: 'OPTIONS',
        middleware: [function(req, res) {
            console.log("options");
            res.send(204);
        }]
    },

    // Local Auth
    {
        path: '/login',
        httpMethod: 'POST',
        middleware: []
    },
    {
        path: '/logout',
        httpMethod: 'POST',
        middleware: []
    },

    //Customers resource
    {
        path: '/customers',
        httpMethod: 'GET',
        middleware: [DataBase.getList]
    },
    {
        path: '/customers/:id',
        httpMethod: 'GET',
        middleware: [DataBase.getDetailsId]
    },
    {
        path: '/customers/:id',
        httpMethod: 'PUT',
        middleware: [DataBase.updateCustomer]
    },

    //Upload files
    {
        path: '/db/list',
        httpMethod: 'GET',
        middleware: [basicAuth.basicAuth,DataBase.getList]
    },
    {
        path: '/db/list/:id',
        httpMethod: 'GET',
        middleware: [basicAuth.basicAuth, DataBase.getDetailsId]
    },
    {
        path: '/db/upload',
        httpMethod: 'GET',
        middleware: [basicAuth.basicAuth, DataBase.getForm]
    },
    {
        path: '/db/upload',
        httpMethod: 'POST',
        middleware: [basicAuth.basicAuth, DataBase.getFile]
    },
    {
        path: '/db/stat',
        httpMethod: 'GET',
        middleware: [basicAuth.basicAuth, DataBase.getStatPage]
    },
    {
        path: '/db/stat',
        httpMethod: 'POST',
        middleware: [basicAuth.basicAuth, DataBase.getStat]
    },
    {
        path: '/db/update',
        httpMethod: 'GET',
        middleware: [basicAuth.basicAuth, DataBase.getListUpdate]
    },
    {
        path: '/db/update/:id',
        httpMethod: 'PUT',
        middleware: [basicAuth.basicAuth, DataBase.confirmUpdate]
    },
    {
        path: '/db/update/:id',
        httpMethod: 'DELETE',
        middleware: [basicAuth.basicAuth, DataBase.cancelUpdate]
    },
    {
        path: '/db/customerDB/:id',
        httpMethod: 'GET',
        middleware: [basicAuth.basicAuth, DataBase.getCustomerDB]
    },
    {
        path: '/db/customerDBU/:id',
        httpMethod: 'GET',
        middleware: [basicAuth.basicAuth, DataBase.getCustomerDBU]
    },
    {
        path: '/db/validation',
        httpMethod: 'GET',
        middleware: [DataBase.getValidation]
    }
];

module.exports = function(app) {

    _.each(routes, function(route) {
        var args = _.flatten([route.path, route.middleware]);

        switch(route.httpMethod.toUpperCase()) {
            case 'GET':
                app.get.apply(app, args);
                break;
            case 'POST':
                app.post.apply(app, args);
                break;
            case 'PUT':
                app.put.apply(app, args);
                break;
            case 'DELETE':
                app.delete.apply(app, args);
                break;
            case 'OPTIONS':
                app.options.apply(app, args);
                break;
            default:
                throw new Error('Invalid HTTP method specified for route ' + route.path);
                break;
        }
    });
}

function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) return next();
    else                      return res.send(401);
}