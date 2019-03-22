// 'use strict';
define(['app'], function (app) {
	var injectParams = ['$scope'];
	app.register.controller('AdminController', ['$scope', function ($scope) {
		$scope.title = "RentHouse-Admin";
		var AuthCheck = AuthService.initiate();
		if(!AuthService.$isLoggedIn)
			window.location.href = "/index.html";
		AdminController.$inject = injectParams;
    }]);
	
});
