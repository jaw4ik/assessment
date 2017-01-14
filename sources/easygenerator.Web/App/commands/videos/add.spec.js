import userContext from 'userContext';
import storageFileUploader from 'storageFileUploader';
import addVideo from './add';
import settings from 'videoUpload/settings';

describe('[addVideo]', () => {
    let eventCategory = 'Video library',
        events = {
            openUploadVideoDialog: 'Open \"choose video file\" dialog',
            deleteVideoFromLibrary: 'Delete video from library'
        };
    let associatedLearningContentId = '123', callback = () => {};

    it('should return function', () => {
        expect(addVideo).toBeFunction();
    });

    describe('when user has free plan', () => {

        beforeEach(() => {
            spyOn(userContext, 'hasStarterAccess').and.returnValue(false);
            spyOn(storageFileUploader, 'upload');
        });

        it('should return false', () => {
            let accountCanUpload = addVideo(events.openUploadVideoDialog, eventCategory, settings, associatedLearningContentId, callback);
            expect(accountCanUpload).toBe(false);
        });

        it('should not upload video', () => {
            addVideo(events.openUploadVideoDialog, eventCategory, settings, associatedLearningContentId, callback);
            expect(storageFileUploader.upload).not.toHaveBeenCalled();
        });
    });

    describe('when user has trial plan', () => {

        beforeEach(() => {
            spyOn(userContext, 'hasStarterAccess').and.returnValue(true);
            spyOn(userContext, 'hasTrialAccess').and.returnValue(true);
            spyOn(storageFileUploader, 'upload');
        });

        it('should return false', () => {
            let accountCanUpload = addVideo(events.openUploadVideoDialog, eventCategory, settings, associatedLearningContentId, callback);
            expect(accountCanUpload).toBe(false);
        });

        it('should not upload video', () => {
            addVideo(events.openUploadVideoDialog, eventCategory, settings, associatedLearningContentId, callback);
            expect(storageFileUploader.upload).not.toHaveBeenCalled();
        });
    });

    describe('when user has not free plan', () => {

        beforeEach(() => {
            spyOn(userContext, 'hasStarterAccess').and.returnValue(true);
            spyOn(userContext, 'hasTrialAccess').and.returnValue(false);
            spyOn(storageFileUploader, 'upload');
        });

        it('should upload video', () => {
            addVideo(events.openUploadVideoDialog, eventCategory, settings, associatedLearningContentId, callback);
            expect(storageFileUploader.upload).toHaveBeenCalled();
        });
    });
});

