'use strict';
define(['app'], function (app) {

    var service = angular.module("UsersService", []);
    var base_url = "http://localhost/renthouse_api/users/";
    var successCallBack = function($response, d){
        d.resolve($response.data)
        return $response.data;
    };
    var errorCallBack = function($reason){
        return $reason.data;
    };
    
    service.factory('Users', ['$http', '$q','$log',  function ($http, $q, $log) {
        // var localStorage = $window.localStorage;
        return {
            signup : function ($datas) {
                var d = $q.defer();
                $http.post(base_url + 'signup.json', $datas)
                .then(function($response){
                    d.resolve($response.data);
                }, function($reason){
                    d.reject($reason.data)
                });
                return d.promise;
            } ,
            login : function($credentials){
                var d = $q.defer();
                $http.post(base_url + 'login.json', $credentials).then(
                function($response){
                    d.resolve($response);
                }
                , function($reason){
                    d.reject($reason);
                });
                return d.promise;
            }   
            
        }
    }]);
   
    return service;
});
