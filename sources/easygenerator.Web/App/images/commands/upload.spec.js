import uploadImage from './upload';
import _ from 'underscore';
import constants from 'constants';
import localizationManager from 'localization/localizationManager';
import fileUpload from 'fileUpload';

describe('command [image upload]', () => {

    const imageServiceUploadUrl = `${constants.imageService.host}/image/upload`;
    const maxFileSize = 10 * 1024 * 1024;
    const allowedFileExtensions = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];
    let file;
    let localizationMessage;
    let fileUploadPromise;

    beforeEach(() => {
        file = {
            name: '',
            size: 1000
        };
        localizationMessage = 'some message';
        spyOn(localizationManager, 'localize').and.returnValue(localizationMessage);
    });

    describe('when file type is not supported', () => {

        beforeEach(() => {
            fileUploadPromise = Promise.resolve();
            spyOn(fileUpload, 'xhr2').and.returnValue(fileUploadPromise);
        });

        it('should throw an error', done => (async () => {
            try {
                file.name = 'unsupported.doc';
                await uploadImage.execute(file);
                await fileUploadPromise;
            } catch (e) {
                expect(e).toBe(localizationMessage);
            } 
        })().then(done));

    });

    describe('when file larger than max allowed size', () => {
        
        beforeEach(() => {
            fileUploadPromise = Promise.resolve();
            spyOn(fileUpload, 'xhr2').and.returnValue(fileUploadPromise);
        });

        it('should throw an error', done => (async () => {
            try {
                file.size = 20 * 1024 * 1024;
                await uploadImage.execute(file);
                await fileUploadPromise;
            } catch (e) {
                expect(e).toBe(localizationMessage);
            } 
        })().then(done));

    });

    describe('when file is supported and not larger then max allowed size', () => {

        let authGetHeaderPromise;

        beforeEach(() => {
            fileUploadPromise = Promise.resolve();
            spyOn(fileUpload, 'xhr2').and.returnValue(fileUploadPromise);
        });

        describe('when auth provider is return header', () => {

            beforeEach(() => {
                authGetHeaderPromise = Promise.reject();
                spyOn(window.auth, 'getHeader').and.returnValue();
            });


        });

        describe('when auth provider is not return header', () => {
            
        });

    });

});