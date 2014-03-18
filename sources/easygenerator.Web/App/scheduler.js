define(['durandal/system'], function (system) {

    var
        self = {
            tasks: {}
        }
    ;


    function execute() {
        for (var id in self.tasks) {
            if (self.tasks.hasOwnProperty(id)) {
                self.tasks[id].execute();
            }
            
        };
        setTimeout(execute, 2000);
    }


    setTimeout(execute, 2000);

    return {
        push: function (task) {
            var id = system.guid();

            self.tasks[id] = task;

            return id;
        },
        remove: function (id) {
            delete self.tasks[id];
        }
    };


})