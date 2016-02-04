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

        describe('activate:', () => {
            var instruction;

            beforeEach(() => {
                spyOn(app, 'trigger');
                router.parent = {
                    activeInstruction: function() {
                        return instruction;
                    }
                };
            });

            describe('when activeInstructions fragment is not \'library\'', () => {
                it('should not trigger event', () => {
                    instruction = { fragment: 'test' };
                    index.activate();
                    expect(app.trigger).not.toHaveBeenCalled();
                });
            });

            describe('when activeInstructions fragment is \'library\'', () => {
                it('should trigger event \'library:default:activate\'', () => {
                    instruction = { fragment: 'library' };
                    index.activate();
                    expect(app.trigger).toHaveBeenCalledWith('library:default:activate');
                });
            });
        });
    });

});