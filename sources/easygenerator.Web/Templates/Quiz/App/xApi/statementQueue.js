define([], function () {

    var queue = ko.observableArray([]);

    queue.subscribe(function(newValue) {
        console.log(newValue);
    });

    return queue;

})