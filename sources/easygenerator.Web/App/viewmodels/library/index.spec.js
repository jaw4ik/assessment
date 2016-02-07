define(['viewmodels/library/index'], function (index) {
    "use strict";

    var app = require('durandal/app'),
        router = index.router;

    describe('viewModel [library index]', function () {

        it('should be defined', function () {
            expect(index).toBeDefined();
        });

        describe('index router', function () {

            it('should be defined', function () {
                expect(router).toBeDefined();
            });

        });

        describe('activate:', function () {
            var instruction;

            beforeEach(function () {
                spyOn(app, 'trigger');
                router.parent = {
                    activeInstruction: function() {
                        return instruction;
                    }
                };
            });

            describe('when activeInstructions fragment is not \'library\'', function() {
                it('should not trigger event', function () {
                    instruction = { fragment: 'test' };
                    index.activate();
                    expect(app.trigger).not.toHaveBeenCalled();
                });
            });

            describe('when activeInstructions fragment is \'library\'', function () {
                it('should trigger event \'library:default:activate\'', function () {
                    instruction = { fragment: 'library' };
                    index.activate();
                    expect(app.trigger).toHaveBeenCalledWith('library:default:activate');
                });
            });
        });
    });
});