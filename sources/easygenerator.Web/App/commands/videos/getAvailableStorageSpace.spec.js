import userContext from 'userContext';
import localizationManager from 'localization/localizationManager';
import videoCommands from './index';

describe('[getAvailableStorageSpace]', () => {
    userContext.storageIdentity = {};

    describe('when user has free plan', () => {

        beforeEach(() => {
            spyOn(userContext, 'hasStarterAccess').and.returnValue(false);
            spyOn(userContext, 'hasPlusAccess').and.returnValue(false);
        });

        it('should return false', () => {
            let storageSpace = videoCommands.getAvailableStorageSpace();
            expect(storageSpace).toBe(false);
        });
    });    

    describe('when user has not free plan', () => {

        beforeEach(() => {
            spyOn(userContext, 'hasStarterAccess').and.returnValue(true);
            spyOn(userContext, 'hasPlusAccess').and.returnValue(true);
        });

        describe('when available storage space is greater than 1Gb', () => {

            beforeEach(() => {
                userContext.storageIdentity.availableStorageSpace = 1073741825;
                userContext.storageIdentity.totalStorageSpace = 1073741825 * 2;
            });

            it('should set available storage space in Gb', () => {
                let storageSpace = videoCommands.getAvailableStorageSpace();
                expect(storageSpace.availableStorageSpace).toBe('1.00' + localizationManager.localize('gb'));
            });

            it('should set available storage space in perseteges on progress bar', () => {
                let storageSpace = videoCommands.getAvailableStorageSpace();
                expect(storageSpace.availableStorageSpacePersentages).toBe(50);
            });
        });

        describe('when available storage space is less than 1Gb', () => {

            beforeEach(() => {
                userContext.storageIdentity.availableStorageSpace = 1073741823;
                userContext.storageIdentity.totalStorageSpace = 1073741823 * 2;
            });

            it('should set available storage space in Mb', () => {
                let storageSpace = videoCommands.getAvailableStorageSpace();
                expect(storageSpace.availableStorageSpace).toBe('1024.00' + localizationManager.localize('mb'));
            });

            it('should set available storage space in perseteges on progress bar', () => {
                let storageSpace = videoCommands.getAvailableStorageSpace();
                expect(storageSpace.availableStorageSpacePersentages).toBe(50);
            });
        });    
    });
});