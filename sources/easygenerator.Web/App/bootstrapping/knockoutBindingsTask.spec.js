define(['bootstrapping/knockoutBindingsTask'], function (task) {
    "use strict";

    describe('task [knockoutBindingsTask]', function () {

        describe('execute:', function () {

            it('should configure ko.bindingHandlers.sortable.options', function () {
                task.execute();

                var options = ko.bindingHandlers.sortable.options;

                expect(options.opacity).toBeDefined();
                expect(options.placeholder).toBeDefined();
                expect(options.forcePlaceholderSize).toBeDefined();
                expect(options.containment).toBeDefined();
                expect(options.handle).toBeDefined();
                expect(options.tolerance).toBeDefined();
                expect(options.cursor).toBeDefined();
                expect(options.start).toBeFunction();
            });

        });

    });

});