define(function (require) {

    var
        viewModel = require('viewmodels/shell'),
        router = require('plugins/router'),
        eventTracker = require('eventTracker');

    describe('viewModel [shell]', function () {

        beforeEach(function () {
            spyOn(eventTracker, 'publish');
            spyOn(router, 'navigate');
            spyOn(router, 'setLocation');
        });

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('homeModule', function () {

            it('should be defined', function () {
                expect(viewModel.homeModuleName).toBeDefined();
            });

            it('should equal \'courses\'', function () {
                expect(viewModel.homeModuleName).toEqual('courses');
            });

        });

        describe('activate:', function () {

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

        });

        describe('userEmail:', function () {

            it('should be defined', function () {
                expect(viewModel.userEmail).toBeDefined();
            });

        });

        describe('showNavigation:', function () {

            it('should be defined', function () {
                expect(viewModel.showNavigation).toBeDefined();
            });

            it('should be function', function () {
                expect(viewModel.showNavigation).toBeFunction();
            });

            describe('when activeModuleName is error page', function () {

                describe('when error page 400', function () {

                    it('should be return true', function () {
                        spyOn(viewModel, 'activeModuleName').andReturn('400');
                        expect(viewModel.showNavigation()).toBeTruthy();
                    });

                });

                describe('when error page 404', function () {

                    it('should be return true', function () {
                        spyOn(viewModel, 'activeModuleName').andReturn('404');
                        expect(viewModel.showNavigation()).toBeTruthy();
                    });

                });

            });

            describe('when activeModuleName is not error page', function () {

                it('should be return fasle', function () {
                    spyOn(viewModel, 'activeModuleName').andReturn('somepage');
                    expect(viewModel.showNavigation()).toBeFalsy();
                });

            });

        });

    });

});