'use strict';
define(['app','UsersService'], function (app) {
    var injectParams = ['$scope', '$http', '$log', '$state'];
    var injector = angular.injector(['UsersService', 'ng']);
    
	var SignupController =  function ($scope, $log, $state) {
        $scope.title = "RentHouse-Admin";
        angular.element('title').innerText = "Dashboard";
        $scope.message = "Sign Up";
        $scope.loading = false;
        // try to signup considering that user fulfill the conditions using UsersService
        var Users = injector.get('Users');

        // Callbacks for all of the performed requests
        var successCallBack = function($response){
            $state.go("/dashboard");
            $scope.loading = false;
        }
        var errorCallBack = function($reason){
            console.info('Error : ' + $reason);
            $scope.loading = false;
        }
        // Callbacks for all of the performed requests
        $scope.newUser = function(){
            var datas = this.User;
            $scope.loading = true;
            console.log(datas);
            if(datas.password_confirm == datas.password){
                delete datas.password_confirm;
                Users.signup(datas).then(successCallBack, errorCallBack);
                //flush the object
                $scope.loading = false;
                // console.log(newUser);
            }
        }
        $scope.initialize = function(){
            console.log("Initiated");
        }
        // Injects all the dependencies
        SignupController.$inject = injectParams;
    };
    SignupController.$inject = injectParams;
    app.register.controller('SignupController', SignupController);
	
});