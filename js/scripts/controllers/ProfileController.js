'use strict';
define(['app', 'UsersService', 'ProductsService'], function (app) {
    var injector = angular.injector(['UsersService','ProductsService', 'ng']);
	var injectParams = ['$scope', '$window','$location', '$state','$rootScope', '$q'];
    var ProfileController =  function ($scope,$window, $location, $state,$rootScope,$q) {
        $scope.$localStorage = $window.localStorage;
        $scope.title = "RentHouse-Profile";
        //$rootScope.products = {};
        var $User = injector.get('Users');
        var $Products = injector.get('Products');
        $scope.authUser = JSON.parse($scope.$localStorage.authUser);
        $scope.avatar = "./images/default_avatar.png";
        // if(!$scope.$localStorage.authUser.avatar){
        //     $scope.avatar = "./images/default_avatar.png";
        // }
        $scope.products = null;

        $scope.initialize = function(){
            loadUserProducts();
            console.log("initialized");
            
        }
        var loadUserProducts = function(){
            $Products.getUserProducts($scope.$localStorage.authUser.id)
            .then(function($response){
                if($response.status === 200 && $response.xhrStatus === "complete"){
                    var loadP = setInterval(function() {
                        if($scope.products === null){
                            $scope.$apply(function(){
                                $scope.products = $response.data.products;
                            });
                            console.log("Setting up");
                        }
                        else{
                            console.log("Just set");
                            clearInterval(loadP);
                        }
                    }, 1000);
               }
                
            }, function($reason) {
                $scope.products = $reason.data;
            });
        }
        $scope.initialize();
        // console.log($scope.products);
        


        
    };
    ProfileController.$inject = injectParams;
    app.register.controller('ProfileController', ProfileController);
});