angular.module('factories').factory("AuthService", function(){
    return {
        $isLoggedIn : true,
        $user       : [],
        $error      : "",
        initiate    : function(){
            if(!this.$isLoggedIn){
                $this.$error = "Please login first";
            }
        }

    }
})