define([],
    function () {

    	var template = function (spec) {

    		var obj = {};

    		obj.name = spec.name;
    		obj.id = spec.id;

    		return obj;
    	};

    	return template;
    }
);