define(['bootstrapping/compositionTask'], function(task) {
    "use strict";

    var composition = require('durandal/composition');

    describe('task [compositionTask]', function () {

        describe('execute:', function () {

            beforeEach(function() {
                spyOn(composition, 'addBindingHandler');
            });

            it('should add autofocus binding', function() {
                task.execute();

                expect(composition.addBindingHandler).toHaveBeenCalledWith('autofocus');
            });

            it('should add scrollToElement binding', function () {
                task.execute();

                expect(composition.addBindingHandler).toHaveBeenCalledWith('scrollToElement');
            });

            it('should add placeholder binding', function () {
                task.execute();

                expect(composition.addBindingHandler).toHaveBeenCalledWith('placeholder');
            });

        });

    });

});