define(['xApi/activityProvider'],
    function (viewModel) {
        "use strict";

        describe('viewModel [activityProvider]', function () {

            it('should be defined', function() {
                expect(viewModel).toBeDefined();
            });

            describe('init:', function () {

                it('should be function', function() {
                    expect(viewModel.init).toBeFunction();
                });

                it('should return promise', function() {
                    expect(viewModel.init()).toBePromise();
                });

            });

            describe('createActor:', function () {

                it('should be function', function() {
                    expect(viewModel.createActor).toBeFunction();
                });

                it('should return Actor', function() {
                    var result = viewModel.createActor('SomeName', 'fake@gmail.com');

                    expect(result.name).toBe('SomeName');
                    expect(result.mbox).toBe('mailto:fake@gmail.com');
                });

            });

        });

    }
);