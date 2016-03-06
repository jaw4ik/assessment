import deleteAudioCommand from 'audio/vimeo/commands/delete';

import storageHttpWrapper from 'http/storageHttpWrapper';
import userContext from 'userContext';
import constants from 'constants';
import dataContext from 'dataContext';
import app from 'durandal/app';

describe('deleteAudioCommand:', () => {

    var audio;

    beforeEach(() => {
        spyOn(storageHttpWrapper, 'post').and.returnValue(Promise.resolve());
        spyOn(userContext, 'identifyStoragePermissions').and.returnValue(Promise.resolve());
        spyOn(app, 'trigger');
        audio = { id: 'id' };
        dataContext.audios = [audio];
    });

    it('should be object', () => {
        expect(deleteAudioCommand).toBeObject();
    });

    describe('execute', () => {

        it('should be function', () => {
            expect(deleteAudioCommand.execute).toBeFunction();
        });

        it('should do request to storage server', () => {
            deleteAudioCommand.execute(audio.id);
            expect(storageHttpWrapper.post).toHaveBennCalledWith(constants.storage.host + constants.storage.audio.deleteUrl, { mediaId: audio.id });
        });

        describe('when storage server returns successful response', () => {

            it('should remove audio from dataContext', done => (async () => {
                await deleteAudioCommand.execute(audio.id);
                expect(dataContext.audios().length).toBe(0);
            })().then(done));

            it('should identify storage permissions', done => (async () => {
                await deleteAudioCommand.execute(audio.id);
                expect(userContext.identifyStoragePermissions).toHaveBeenCalled();
            })().then(done));

            it('should trigger up event', done => (async () => {
                await deleteAudioCommand.execute(audio.id);
                expect(app.trigger).toHaveBeenCalledWith(constants.storage.changesInQuota);
            })().then(done));

        });

    });

});