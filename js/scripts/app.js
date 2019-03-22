'use strict';
define(function(){
	var app = angular.module("MainModule", ['ui.router', "AuthService"]);
	app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$provide','$httpProvider',function($stateProvider, $urlRouterProvider,$controllerProvider, $provide, $httpProvider) 
	{	
		$httpProvider.interceptors.push('AuthInterceptor');
		app.authUser = JSON.parse(window.localStorage.getItem('authUser'));// most global variable
		app.register = {
			controller: $controllerProvider.register,
			factory: $provide.factory
		};
		
		function resolveController(names) {
			return {
				load: ['$q', '$rootScope', function ($q, $rootScope) {
					var defer = $q.defer();
					require(names, function () {
						defer.resolve();
						$rootScope.$apply();
					});
					return defer.promise;
				}]
			}
		}
		
		$stateProvider.
		state('root', {
			url : '/',
			templateUrl : './views/dashboard.html',
			controller  : 'DashboardController',
			resolve: resolveController(["DashboardController"])
		})
		.state('dashboard', {
			url : '/dashboard',
			templateUrl : './views/dashboard.html',
			controller  : 'DashboardController',
			resolve: resolveController(["DashboardController"])
		})
		.state('add_product', {
			url : '/add_product',
			templateUrl : './views/add_product.html',
			controller  : 'ProductsController',
			resolve     : resolveController(['UsersService','ProductsService','ProductsController'])
		})
		.state('profile', {
			url : '/profile',
			templateUrl : './views/profile.html',
			controller  : 'ProfileController',
			resolve: resolveController(["UsersService", "ProfileController"])
		})
		.state('login', {
			url : '/login',
			templateUrl : './views/login.html',
			controller  : 'LoginController',
			resolve: resolveController(['UsersService','LoginController'])
		})
		.state('signup', {
			url : '/signup',
			templateUrl : './views/signup.html',
			controller  : 'SignupController',
			resolve     : resolveController(['UsersService','SignupController'])
		})
		.state('logout', {
			url : '/logout',
			controller  : 'LogoutController',
			resolve     : resolveController(['UsersService','LogoutController'])
		});

		$urlRouterProvider.otherwise("/dashboard");
	}]);
	angular.element(document).ready(function () {
		angular.bootstrap(document, ['MainModule']);
	});
	return app;
});



