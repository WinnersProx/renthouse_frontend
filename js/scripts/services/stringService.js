ModuleApp.factory("$stringService", function(){
    return {
        processName : function($name){
            if(!$name)
			return $name;
            var output = "";
            for (let i = 0; i < $name.length; i++) {
                if(i > 0 && $name[i] === $name[i].toUpperCase())
                    output +=  " ";
                output += $name[i];
            }
            return output;
        }
    }
})