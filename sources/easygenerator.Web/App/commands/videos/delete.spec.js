import storageHttpWrapper from 'http/storageHttpWrapper';
import dataContext from 'dataContext';
import userContext from 'userContext';
import constants from 'constants';
import app from 'durandal/app';
import videoCommands from './index';

describe('[deleteVideo]', () => {
    let video = {  id : '123' },
        identifyStoragePermissionsDefer = Q.defer(),
        postDefer = Q.defer();

    beforeAll(() => {
        spyOn(userContext, 'identifyStoragePermissions').and.returnValue(identifyStoragePermissionsDefer.promise);
        spyOn(storageHttpWrapper, 'post').and.returnValue(postDefer.promise);
        spyOn(dataContext, 'videos').and.returnValue(new Array(video));
    });

    beforeEach(() => {
        postDefer.resolve();
        identifyStoragePermissionsDefer.resolve();
    });

    it('should return function', () => {
        expect(videoCommands.deleteVideo).toBeFunction();
    });

    it('should call storageHttpWrapper.post', (done) => {
        videoCommands.deleteVideo(video.id).then(() => {
            expect(storageHttpWrapper.post).toHaveBeenCalled();
            done();
        });
    });
    
    it('should call identifyStoragePermissions', (done) => {
        videoCommands.deleteVideo(video.id).then(() => {
            expect(userContext.identifyStoragePermissions).toHaveBeenCalled();
            done();
        });
    });

    describe('and when video deleted successfully', () => {

        beforeEach(() => {
            identifyStoragePermissionsDefer.resolve();
            spyOn(app, 'trigger');
        });

        it('should call app.trigger for changesInQuota', (done) => {
            videoCommands.deleteVideo(video.id).then(() => {
                expect(app.trigger).toHaveBeenCalledWith(constants.storage.changesInQuota);
                done();
            });
        });

        it('should call app.trigger for changesInUpload', (done) => {
            videoCommands.deleteVideo(video.id).then(() => {
                expect(app.trigger).toHaveBeenCalledWith(constants.storage.video.changesInUpload);   
                done();
            });
        });
    });
});

