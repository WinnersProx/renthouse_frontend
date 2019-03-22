'use strict';
define(['app', 'ProductsService'], function (app) {
    var injector = angular.injector(['ProductsService', 'ng']);
	var injectParams = ['$scope', '$window','$location', '$state','$rootScope'];
	var ProductsController =  function ($scope,$window, $location, $state,$rootScope) {
        $scope.$localStorage = $window.localStorage;
        $scope.title = "RentHouse-Products";
        var $Products = injector.get('Products');
        $scope.authUser = JSON.parse($scope.$localStorage.authUser);
        $scope.Product = {};
        $scope.isLoading = false;
        $scope.addPicture = function($e){
            console.log($e);
            console.log("changed");
        }
        $scope.addProduct = function (){
            $scope.isLoading = true;
            if($scope.Product != undefined && $scope.Product != null){
                 // $scope.Product.picture_images = {};    
                $Products.add($scope.Product).then(function($response){
                    $scope.Products = null;
                    alert($response.data.message);
                    $scope.isLoading = false;
                    $state.go("profile");
                    
                    
                }, function($reason){
                    alert($reason.data.message);
                    $state.go("add_product");
                })
            }
            
        }
    };
    ProductsController.$inject = injectParams;
    app.register.controller('ProductsController', ProductsController);
});