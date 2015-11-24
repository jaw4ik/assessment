import system from 'durandal/system';
import tasks from 'bootstrapper.tasks';

function run() {
    _.each(tasks.getCollection(), function(task) {
        if (_.isFunction(task.execute)) {
            task.execute();
        } else {
            system.log('Bootstrapper task ' + system.getModuleId(task) + 'is not executable');
        }

    });
}

export default { run };