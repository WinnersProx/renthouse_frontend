'use strict';
// The interceptor to make sure that the system filters before rendering the routed pages
define(['app'], function (app) {
    var service = angular.module('AuthService', []);
    app.factory('AuthInterceptor', ['$rootScope', '$q','$window','$location','$timeout','$injector', '$state', function ($rootScope, $q, $window, $location, $timeout,$injector, $state) {
        var base_url = 'localhost/rent_project/users';
        var count = 0;
        var $localStorage = $window.localStorage;
        var allowedPages = ['login','signup'];
        $rootScope.authUser = JSON.parse($window.localStorage.getItem('authUser'));
        return {
        // optional method
            request: function(config) {
              var headers = config.headers || {};
              config.headers.__token = $localStorage.getItem('__token');
              config.headers.Authorization = 'Bearer ' + config.headers.__token;
              // hence we start by one in order to remove the slash presented in the url
              if(config.headers.__token){
                if(allowedPages.indexOf($location.$$path.substring($location.$$path.length, 1)) != -1){
                   $timeout(function () {  
                      $state.go('dashboard');
                   });
                }
              }
              else{
                if(allowedPages.indexOf($location.$$path.substring($location.$$path.length, 1)) === -1){
                  $timeout(function () {  
                    $state.go('login');
                  });
                }
              }
              
              // otherwise there's nothing else to do
              return config;
            },
            // optional method
            requestError: function(rejection) {
              // do something on error
              if (canRecover(rejection)) {
                return responseOrNewPromise;
              }
              return $q.reject(rejection);
            },



            // optional method
            response: function(response) {
              // do something on success
              response.config.headers.Authorization = 'Bearer ' + $localStorage.getItem('__token');
              if(response.status === 403 || response.status === 401){
                // this one is not logged in
                $timeout(function () {  
                    $state.go('login');
                });
              }
              else{
                
              }
              return response;
            },

            // optional method
           responseError: function(rejection) {
              // do something on error
              if (canRecover(rejection)) {
                return responseOrNewPromise
              }
              $timeout(function () {  
                $state.go('login');
              });
              return $q.reject(rejection);
           }, 
           logoutUser : function(){

           }
        };
    }]);
   
    return service;
});

