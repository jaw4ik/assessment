define(['xApi/requestManager'],
    function (viewModel) {

        describe('viewModel [requestManager]', function () {

            var ajaxDefer;

            beforeEach(function() {
                ajaxDefer = $.Deferred();
                $.ajax = jasmine.createSpy('ajax').andReturn(ajaxDefer.promise());
            });

            it('should be defined', function () {
                expect(viewModel).toBeDefined();
            });

            describe('sendStatement:', function () {

                it('should be function', function() {
                    expect(viewModel.sendStatement).toBeFunction();
                });

                it('should return promise', function() {
                    expect(viewModel.sendStatement()).toBePromise();
                });

            });

        });

    }
);