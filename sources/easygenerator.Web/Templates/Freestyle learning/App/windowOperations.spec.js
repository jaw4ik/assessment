define(['windowOperations'],
    function (windowOperations) {

        "use strict";

        describe('viewModel [windowOperations]', function () {

            it('should be defined', function () {
                expect(windowOperations).toBeDefined();
            });

            describe('close:', function () {

                beforeEach(function() {
                    spyOn(window, 'close').andCallFake(function () { });
                });

                it('should be function', function () {
                    expect(windowOperations.close).toBeFunction();
                });

                beforeEach(function () {
                    jasmine.Clock.useMock();
                    spyOn(window, 'alert').andCallFake(function () { });
                });

                it('should close window', function () {
                    windowOperations.close();
                    expect(window.close).toHaveBeenCalled();
                });

                describe('when navigator is not Microsoft Internet Explorer', function () {

                    it('should show notification', function () {
                        spyOn(window, 'navigator');
                        window.navigator.appName = "asd";

                        windowOperations.close();

                        jasmine.Clock.tick(101);
                        expect(window.alert).toHaveBeenCalledWith("Thank you. It is now safe to close this page.");
                    });

                });
                
                describe('when navigator is Microsoft Internet Explorer', function () {

                    it('should not show notification', function () {
                        spyOn(window, 'navigator');
                        window.navigator.appName = "Microsoft Internet Explorer";

                        windowOperations.close();

                        jasmine.Clock.tick(101);
                        expect(window.alert).not.toHaveBeenCalled();
                    });

                });

            });

        });

    }
);