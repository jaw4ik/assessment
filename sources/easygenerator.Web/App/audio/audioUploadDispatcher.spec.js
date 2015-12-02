import dispatcher from 'audio/audioUploadDispatcher';

import factory from 'audio/factory';
import constants from 'constants';
import UploadModel from 'audio/UploadAudioModel';

describe('[audioUploadDispatcher]', () => {
    describe('uploads:', () => {
        it('should be array', () => {
            expect(dispatcher.uploads).toBeArray();
        });
    });

    describe('startUploading:', () => {
        let file = { name: 'sample.wav' },
            model = new UploadModel(file);

        beforeEach(() => {
            spyOn(factory, 'create').and.returnValue(model);
            spyOn(model, 'upload');
        });

        it('should add upload to the uploads list', () => {
            dispatcher.uploads = [];
            dispatcher.startUploading(file);
            expect(dispatcher.uploads.length).toBe(1);
        });

        it('should call start uploading audio', () => {
            dispatcher.startUploading(file);
            expect(model.upload).toHaveBeenCalled();
        });

        it('should return model', () => {
            let result = dispatcher.startUploading(file);
            expect(result).toBe(model);
        });

        describe('and when uploading failed', () => {
            it('should remove upload from uploads list', () => {
                dispatcher.uploads = [];
                dispatcher.startUploading(file);
                model.trigger(constants.storage.audio.statuses.failed);
                expect(dispatcher.uploads.length).toBe(0);
            });
        });

        describe('and when uploading finished', () => {
            it('should remove upload from uploads list', () => {
                dispatcher.uploads = [];
                dispatcher.startUploading(file);
                model.trigger(constants.storage.audio.statuses.loaded);
                expect(dispatcher.uploads.length).toBe(0);
            });
        });
    });
});
