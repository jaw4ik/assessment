define(['bootstrapping/routingTask'], function (task) {
    "use strict";

    var routerExtender = require('routing/routerExtender');

    describe('task [routingTask]', function () {

        describe('execute:', function () {

            beforeEach(function () {
                spyOn(routerExtender, 'execute');
            });

            it('should execute routerExtender', function () {
                task.execute();

                expect(routerExtender.execute).toHaveBeenCalled();
            });

        });

    });

});