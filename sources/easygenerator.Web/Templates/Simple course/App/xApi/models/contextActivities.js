define([], function() {
    var contextActivities = function(spec) {
        if (typeof spec == typeof undefined) throw 'You should provide a specification to create contextActivities';

        var obj = {};

        if (typeof spec.parent != typeof undefined) {
            obj.parent = spec.parent;
        }
        
        if (typeof spec.grouping != typeof undefined) {
            obj.grouping = spec.grouping;
        }

        return obj;
    };

    return contextActivities;
});