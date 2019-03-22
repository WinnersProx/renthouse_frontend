require.config({
    baseUrl: "js",
    
    // alias libraries paths
    paths: {
        'DashboardController': 'scripts/controllers/DashboardController',
        'angular': 'scripts/angular',
        'ui-router': 'scripts/ui-router/angular-ui-router',
        'jquery': 'scripts/jquery.min',
        'LoginController': 'scripts/controllers/LoginController',
        'SignupController' : 'scripts/controllers/SignupController',
        'LogoutController' : 'scripts/controllers/LogoutController',
        'ProfileController' : 'scripts/controllers/ProfileController',
        'ProductsController' : 'scripts/controllers/ProductsController',

        // services start by here
        'UsersService'    : 'scripts/services/UsersService',
        'AuthService' : 'scripts/services/AuthInterceptor',
        'ProductsService'    : 'scripts/services/ProductsService',
        // Directives
        'MainDirectives' : 'scripts/directives/MainDirectives',
        // bootstrapping app
        'bootstrap': 'scripts/bootstrap',
        'bootsrap_bundle': 'scripts/bootstrap.bundle',
        'app': 'scripts/app'
    },
  
    shim: {
        'app': ['angular', 'ui-router'],
        'bootstrap' : ['jquery']
    },
  
    // kick start application
    deps: ['app','AuthService', 'MainDirectives']
  
});

