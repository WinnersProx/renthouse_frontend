'use strict';
define(['app', 'ProductsService'], function (app) {
    var injectParams = ['$scope', '$rootScope', '$state'];
    var injector = angular.injector(['ProductsService', 'ng']);
	var DashboardController =  function ($scope, $rootScope, $state) {
        $rootScope.title = "RentHouse-Dashboard";
        angular.element('title').innerText = "Dashboard";
        $scope.message = "You are welcome sir This is the root page!";
        var $Products = injector.get('Products');
        $scope.log = function($this){
            console.log($rootScope);
        }
        $scope.products = null;
        var initialize = function(){
            $Products.getProducts().then(function($response){
                console.log($response);
                if($response.status === 200 && $response.xhrStatus === "complete"){
                    $scope.$apply(function(){
                        $scope.products = $response.data;
                    });
                }
                else{
                    alert("An  error occured");
                }
                
            },
            function($reason){
                alert($reason.data);
            });
            // after initializing
            
            
        }
        initialize();
        
        var animateLanding = function(){
            var texts = [
                "sell a product",
                "or",
                "make its allowance"
            ];
            var length = 0;
            angular.element('.app-roles').text(texts[0]);
            var sequences = setInterval(function(){
                length += 1;
                var ctextl = 0;
                // angular.element('.app-roles').text(texts[length]);
                if(length < texts.length){
                    var textbuilder = texts[length].charAt(0);
                        setInterval(function(){
                            ctextl += 1;
                            if(ctextl < texts[length].length){
                                textbuilder += texts[length].charAt(ctextl);
                                angular.element('.app-roles').text(textbuilder);
                            }
                            
                        },1000);
                }
                else{
                    length = 0;
                }
            }, 25000);
        }
        animateLanding();

        $scope.logInfos = function(pr){
            console.log(pr);
        }
        $scope.requestProduct = function($productId){
            $Products.requestTransaction($productId)
            .then(function($response){
                // transaction added successfully
                alert($response.data.message);
                $state.go('dashboard');
            },
            function($reason){
                $window.alert($reason.data.message + " : " + $reason.satus);
            });
        }
        console.log($scope.products);
        DashboardController.$inject = injectParams;
    };
    DashboardController.$inject = injectParams;
    app.register.controller('DashboardController', DashboardController);
	
});