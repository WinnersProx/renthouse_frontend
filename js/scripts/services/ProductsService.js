'use strict';
define(['app'], function (app) {

    var service = angular.module("ProductsService", []);
    var base_url = "http://localhost/renthouse_api/products/";
    var successCallBack = function($response){
        d.resolve($response.data)
        return $response.data;
    };
    var errorCallBack = function($reason){
        return $reason.data;
    };
    
    service.factory('Products', ['$window', '$http', '$q','$log', function ($window, $http, $q, $log, request) {
        var localStorage = $window.localStorage;
        return {
            add : function ($datas) {
                var d = $q.defer();
                // we know that the image must be there so we use form data
                if($datas.length != 0){
                    var form = new FormData();
                    for(var key in $datas){
                        if($datas[key] === $datas.product_images && $datas.product_images != undefined){
                            $.each($datas.product_images, function(index, value){
                                form.append("product_images[]", value);
                            });
                        }
                        else{
                            // append additional information to the formdata
                            form.append(key, $datas[key]);
                        }
                        
                    }
                    $.ajax({
                        url : base_url + 'add_product.json',
                        type : "POST",
                        data : form,
                        processData : false,
                        contentType : false,
                        headers : {
                           Authorization : 'Bearer ' + localStorage.getItem('__token')
                        },
                        success : function($response){
                            d.resolve($response);
                            console.log($response)
                        },
                        error : function($reason){
                            d.reject($reason);
                            console.log($reason);
                        }
                    });
                }
                return d.promise;

            } ,
            getUserProducts : function($userId) {
                var d = $q.defer();
                $http.get(base_url + 'get_user_products.json', {
                    url : base_url + 'get_user_products.json',
                    method : 'GET',
                    headers : { Authorization : 'Bearer ' + localStorage.getItem('__token') }
                }).then(
                function($response){
                    d.resolve($response);
                }, function($reason){
                    d.reject($reason);
                });
                return d.promise;
            },
            getProducts : function($userId) {
                var d = $q.defer();
                $http.get(base_url + 'get_products.json', {
                    url : base_url + 'get_products.json',
                    method : 'GET',
                    headers : { Authorization : 'Bearer ' + localStorage.getItem('__token') }
                }).then(
                function($response){
                    d.resolve($response);
                }, function($reason){
                    d.reject($reason);
                });
                return d.promise;
            },
            edit : function($credentials){
                var d = $q.defer();
                $http.post(base_url + 'login.json', $credentials).then(
                function($response){
                    d.resolve($response);
                }
                , function($reason){
                    d.reject($reason);
                });
                return d.promise;
            },
            requestTransaction : function($productId){
                var d = $q.defer();
                $http.post('http://localhost/renthouse_api/transactions/new_transaction.json', {r_product : $productId}, {
                    headers : { Authorization : 'Bearer ' + localStorage.getItem('__token') }
                })
                .then(function($response){
                    d.resolve($response);
                }, 
                function($reason){
                    d.reject($reason);
                });
                return d.promise;
            }   
            
        }
    }]);
   
    return service;
});
