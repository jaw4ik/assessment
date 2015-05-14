define(['uiLocker', 'widgets/uiLockViewer/viewmodel'], function (uiLocker, uiLockViewer) {

    "use strict";

    describe('[uiLocker]', function() {

        it('should be defined', function() {
            expect(uiLocker).toBeDefined();
        });

        describe('lock:', function() {

            it('should be function', function() {
                expect(uiLocker.lock).toBeFunction();
            });

            it('should lock ui', function() {
                spyOn(uiLockViewer, 'lock');
                uiLocker.lock();
                expect(uiLockViewer.lock).toHaveBeenCalled();
            });

        });
        
        describe('unlock:', function () {

            it('should be function', function () {
                expect(uiLocker.unlock).toBeFunction();
            });

            it('should unlock ui', function () {
                spyOn(uiLockViewer, 'unlock');
                uiLocker.unlock();
                expect(uiLockViewer.unlock).toHaveBeenCalled();
            });

        });

    });

});