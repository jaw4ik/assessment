import uiLocker from './uiLocker';

import uiLockViewer from 'widgets/uiLockViewer/viewmodel';

describe('[uiLocker]', () => {

    it('should be class', () => {
        expect(uiLocker).toBeFunction();
    });

    describe('lock:', () => {

        it('should be function', function() {
            expect(uiLocker.lock).toBeFunction();
        });

        it('should lock UI', () => {
            spyOn(uiLockViewer, 'lock');
            uiLocker.lock();
            expect(uiLockViewer.lock).toHaveBeenCalled();
        });
    });

    describe('unlock:', () => {

        it('should be function', () => {
            expect(uiLocker.unlock).toBeFunction();
        });

        it('should unlock ui', () => {
            spyOn(uiLockViewer, 'unlock');
            uiLocker.unlock();
            expect(uiLockViewer.unlock).toHaveBeenCalled();
        });

    });
});