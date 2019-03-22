define(['app'], function(app){
    app.directive("fileReader", [function () {
        return {
            scope: {
                fileread: "="
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                        scope.$apply(function () {
                            scope.fileread = loadEvent.target.result;
                        });
                    }
                    reader.readAsDataURL(changeEvent.target.files[0]);
                });
            }
        }
    }])
    .directive("fileInput", ['$parse', function ($parse) {
        return {
            restrict   : 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileInput);
                element.bind("change", function (changeEvent) {
                    var imgCollection = [];
                    if(element[0].files.length <= 4){
                        scope.$apply(function () {
                            $.each(element[0].files, function(el,file){
                                imgCollection.push(file);
                            })
                            scope.Product.product_images = imgCollection// console.log(scope.Product.product_images);
                        });
                        // console.log(element[0]);
                    }
                    else{
                        alert("Sorry you're not allowed to post more than 4 pictures");
                    }
                });
            }
        }
    }]);
})
