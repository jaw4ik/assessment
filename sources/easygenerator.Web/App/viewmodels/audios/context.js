define([], function() {

    var commands = [];

    return {
        add: add,
        remove: remove
    };

    function add(command) {
        commands.push(command);
    }

    function remove(command) {
        commands.remove(command);
    }

});