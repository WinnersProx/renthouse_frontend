'use strict';
define(['app', 'UsersService'], function (app) {
    var injector = angular.injector(['UsersService', 'ng']);
	var injectParams = ['$scope', '$window','$location', '$state'];
	var LogoutController =  function ($scope,$window, $location, $state) {
        $scope.title = "RentHouse-Logout";
        $scope.$localStorage = $window.localStorage;
        var $User = injector.get('Users');
        // when the controller is initialized 
        if($scope.$localStorage.__token){
            $scope.$localStorage.removeItem('__token');
            $scope.$localStorage.removeItem('authUser');
            $state.go('login');
        }
    };
    LogoutController.$inject = injectParams;
    app.register.controller('LogoutController', LogoutController);
});