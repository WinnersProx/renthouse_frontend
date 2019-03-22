'use strict';
define(['app', 'UsersService'], function (app) {
    var injector = angular.injector(['UsersService', 'ng']);
	var injectParams = ['$scope', '$window','$location', '$state','$rootScope'];
	var LoginController =  function ($scope,$window, $location, $state,$rootScope) {
        $scope.isLoading = false;
        $rootScope.title = "RentHouse-Login";
        $scope.$localStorage = $window.localStorage;
        $scope.message = "Sign In";
        var $User = injector.get('Users');
        $scope.signin = function signin(){
            $scope.isLoading = true;
            var $auth = $User.login($scope.User).then(function($response) {
                if($response.status === 200 && $response.xhrStatus === "complete"){
                    if($scope.$localStorage.getItem('__token') === null){
                        // set the token and the user session stored in the local storage or session storage
                        $scope.$localStorage.setItem('__token', $response.data.__token);
                        $scope.$localStorage.setItem('authUser', JSON.stringify($response.data.authUser));
                        $rootScope.authUser = JSON.parse($scope.$localStorage.getItem('authUser'));
                        $state.go('dashboard');
                        $scope.isLoading = false;
                    }
                    else{
                        $window.alert("You are just logged in logout first");
                        $location.path('/dashboard');
                       
                    }
                }
            }, 
            function($reason){
                $state.go('login');
                $window.alert("You entered bad credentials");
            });
           
        }
    };
    LoginController.$inject = injectParams;
    app.register.controller('LoginController', LoginController);
});