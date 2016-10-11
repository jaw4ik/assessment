import dispatcher from './audioUploadDispatcher';

import app from 'durandal/app';
import factory from 'audio/factory';
import constants from 'constants';
import UploadModel from 'audio/UploadAudioModel';

describe('[audioUploadDispatcher]', () => {

    let file = { name: 'sample.wav' },
            model = new UploadModel(file);

    beforeEach(() => {
        spyOn(factory, 'create').and.returnValue(model);
        spyOn(model, 'upload');
    });

    describe('uploads:', () => {
        it('should be array', () => {
            expect(dispatcher.uploads).toBeArray();
        });
    });

    describe('removeUpload:', () => {

        it('should remove upload from uploads list', () => {
            var upload = {};
            dispatcher.uploads = [upload];
            dispatcher.removeUpload(upload);
            expect(dispatcher.uploads.length).toBe(0);
        });

    });

    describe('startUploading:', () => {

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

    });
});
