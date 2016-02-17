import bootstrapper from './bootstrapper';

import tasks from 'bootstrapper.tasks';
import system from 'durandal/system';

describe('[bootstrapper]', function () {

    it('should be object', function () {
        expect(bootstrapper).toBeObject();
    });

    describe('run:', function () {

        beforeEach(function () {
            spyOn(system, 'log');
        });

        it('should be function', function () {
            expect(bootstrapper.run).toBeFunction();
        });


        it('should execute all excutable tasks', function () {
            var task1 = createExecutableTask();
            var task2 = createExecutableTask();

            spyOn(task1, 'execute');
            spyOn(task2, 'execute');

            spyOn(tasks, 'getCollection').and.returnValue([task1, task2]);

            bootstrapper.run();

            expect(task1.execute).toHaveBeenCalled();
            expect(task2.execute).toHaveBeenCalled();
        });

        describe('when execute non-executable task', function () {

            it('should log message', function () {
                var task1 = createNonExecutableTask();
                var task2 = createExecutableTask();

                spyOn(tasks, 'getCollection').and.returnValue([task1, task2]);

                bootstrapper.run();

                expect(system.log).toHaveBeenCalled();
            });

        });

        function createExecutableTask() {
            return {
                execute: function () {
                }
            };
        }

        function createNonExecutableTask() {
            return {};
        }

    });

});
