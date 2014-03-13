define(['bootstrapping/viewLocatorTask'], function (task) {
    "use strict";

    var viewLocator = require('durandal/viewLocator');

    describe('task [viewLocatorTask]', function () {

        describe('execute:', function () {

            beforeEach(function () {
                spyOn(viewLocator, 'useConvention');
            });

            it('should initialize viewLocator', function () {
                task.execute();

                expect(viewLocator.useConvention).toHaveBeenCalled();
            });

        });

    });

});