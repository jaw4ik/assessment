define(['widgets/uiLockViewer/viewmodel'], function (uiLockViewer) {

    "use strict";

    describe('[uiLockViewer]', function () {

        it('should be defined', function() {
            expect(uiLockViewer).toBeDefined();
        });

        describe('prototype:', function() {

            describe('visible:', function () {

                it('should be observable', function() {
                    expect(uiLockViewer.prototype.visible).toBeObservable();
                });

            });

        });
        
        describe('lock:', function () {

            it('should be function', function () {
                expect(uiLockViewer.lock).toBeFunction();
            });

            it('should set visible to true', function () {
                uiLockViewer.prototype.visible(false);
                uiLockViewer.lock();
                expect(uiLockViewer.prototype.visible()).toBeTruthy();
            });

        });
        
        describe('unlock:', function () {

            it('should be function', function () {
                expect(uiLockViewer.unlock).toBeFunction();
            });

            it('should set visible to false', function () {
                uiLockViewer.prototype.visible(true);
                uiLockViewer.unlock();
                expect(uiLockViewer.prototype.visible()).toBeFalsy();
            });

        });

    });

});