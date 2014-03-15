define(['./xAPINotSupported', 'eventManager', 'plugins/router', 'repositories/courseRepository'],
    function (viewModel,  eventManager,  router, repository) {

        "use strict";

        describe('viewModel [xAPINotSupported]', function () {

            it('should be defined', function () {
                expect(viewModel).toBeDefined();
            });

            beforeEach(function () {
                spyOn(router, 'navigate');
                spyOn(eventManager, 'courseStarted');
            });


            describe('skip:', function () {

                it('should be function', function () {
                    expect(viewModel.skip).toBeFunction();
                });

                it('should trigger event "courseStarted"', function () {
                    viewModel.skip();
                    expect(eventManager.courseStarted).toHaveBeenCalledWith();
                });

                it('should navigate to root', function () {
                    viewModel.skip();
                    expect(router.navigate).toHaveBeenCalledWith('');
                });

            });
        });

    }
);