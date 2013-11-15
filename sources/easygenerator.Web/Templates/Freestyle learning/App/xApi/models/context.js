define([], function() {
    var context = function(spec) {
        if (typeof spec == typeof undefined) throw 'You should provide a specification to create Context';
        
        var obj = {};
        
        if (_.isObject(spec.contextActivities)) {
            obj.contextActivities = spec.contextActivities;
        }

        return obj;
    };

    return context;
});