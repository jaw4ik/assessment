import viewModel from './index.js';

import * as getImages from './queries/getImages.js';
import uploadImage from './commands/upload';
import * as deleteImage from './commands/deleteImage.js';
import Image from './image.js';
import notify from 'notify.js';
import preview from './preview/index.js'
import eventTracker from 'eventTracker';

describe('[images]', () => {
    let image = {
        id: 'id',
        title: 'title', 
        url: 'url'
    }, imageViewModel;
    
    beforeEach(() => {
        imageViewModel = new Image(image);
        viewModel.images([imageViewModel]);
        spyOn(eventTracker, 'publish');
    });
    
    describe('images:', () => {
        it('should be observableArray', function () {
            expect(viewModel.images).toBeObservableArray();
        });
    });

    describe('activate:', () => {
        it('should get images from server', () => {
            spyOn(getImages, 'execute').and.returnValue(Promise.resolve());
            viewModel.activate();
            expect(getImages.execute).toHaveBeenCalled();
        });

        describe('when request is resolved', () => {
            beforeEach(() => {
                spyOn(getImages, 'execute').and.returnValue(Promise.resolve([image]));
            });

            it('should set images', done => {
                viewModel.activate().then(() => {
                    expect(viewModel.images()[0].id).toBe(imageViewModel.id);
                    expect(viewModel.images()[0].title).toBe(imageViewModel.title);
                    expect(viewModel.images()[0].url).toBe(imageViewModel.url);
                    expect(viewModel.images()[0].thumbnailUrl).toBe(imageViewModel.thumbnailUrl);
                    expect(viewModel.images()[0].isDeleteConfirmationShown()).toBe(imageViewModel.isDeleteConfirmationShown());
                    expect(viewModel.images()[0].isDeleting()).toBe(imageViewModel.isDeleting());
                    
                    done();
                });
            });    

            it('should set images for preview by reference', done => {
                viewModel.activate().then(() => {
                    expect(preview.images).toBe(viewModel.images);
                    done();
                });
            });    
        });

        describe('when request is rejected', () => {
            beforeEach(() => {
                spyOn(getImages, 'execute').and.returnValue(Promise.reject('error'));
            });

            it('show error notification', done => {
                spyOn(notify, 'error');

                viewModel.activate().then(() => {
                    expect(notify.error).toHaveBeenCalledWith('error');
                    done();
                });
            });    
        });
    });

    describe('showDeleteImageConfirmation:', () => {
        it('should set isDeleteConfirmationShown to true', () => {
            imageViewModel.isDeleteConfirmationShown(false);
            viewModel.showDeleteImageConfirmation(imageViewModel);
            expect(imageViewModel.isDeleteConfirmationShown()).toBeTruthy();
        });
    });

    describe('hideDeleteImageConfirmation:', () => {
        it('should set isDeleteConfirmationShown to false', () => {
            imageViewModel.isDeleteConfirmationShown(true);
            viewModel.hideDeleteImageConfirmation(imageViewModel);
            expect(imageViewModel.isDeleteConfirmationShown()).toBeFalsy();
        });
    });

    describe('showImagePopup:', () => {
        it('should show image preview with current image index', () => {
            spyOn(preview, 'show');
            viewModel.showImagePopup(imageViewModel);
            expect(preview.show).toHaveBeenCalledWith(0);
        });
    });

    describe('uploadImage:', () => {

        let defaultImage;
        let file;
        let uploadImagePromise;
        let imageResult;

        beforeEach(() => {
            file = 'some file';
            imageResult = {
                id: 'id',
                title: 'image.jpg',
                url: 'https://urlko.com'
            };
            defaultImage = viewModel._generateDefaultImage();
            spyOn(viewModel, '_generateDefaultImage').and.returnValue(defaultImage);
        });

        it('should send event \'Upload image file\'', () => {
            spyOn(uploadImage, 'execute');
            viewModel.uploadImage();
            expect(eventTracker.publish).toHaveBeenCalledWith('Upload image file', 'Image library');
        });

        it('should add defaultImage to collection', () => {
            spyOn(uploadImage, 'execute');
            viewModel.uploadImage();
            expect(viewModel.images.indexOf(defaultImage)).not.toBe(-1);
        });

        describe('when images is loaded successfully', () => {

            beforeEach(() => {
                uploadImagePromise = Promise.resolve(imageResult);
                spyOn(uploadImage, 'execute').and.returnValue(uploadImagePromise);
            });

            it('should delete generated images', done => (async () => {
                viewModel.uploadImage(file);
                await uploadImagePromise;
                expect(viewModel.images.indexOf(defaultImage)).toBe(-1);
            })().then(done));

        });

        describe('when images is not loaded successfully', () => {

            let reason;

            beforeEach(() => {
                reason = 'some reason';
                uploadImagePromise = Promise.reject(reason);
                spyOn(uploadImage, 'execute').and.returnValue(uploadImagePromise);
            });

            it('should delete generated images', done => (async () => {
                try {
                    viewModel.uploadImage(file);
                    await uploadImagePromise;
                } catch (e) {
                    expect(viewModel.images.indexOf(defaultImage)).toBe(-1);
                } 
            })().then(done));

            it('should show error notification', done => (async () => {
                try {
                    spyOn(notify, 'error');
                    viewModel.uploadImage(file);
                    await uploadImagePromise;
                } catch (e) {
                    expect(notify.error).toHaveBeenCalledWith(reason);
                } 
            })().then(done));

        });

    });

    describe('deleteImage:', () => {
        it('should publish event', () => {
            spyOn(deleteImage, 'execute').and.returnValue(Promise.resolve());
            viewModel.deleteImage(imageViewModel);
            expect(eventTracker.publish).toHaveBeenCalledWith('Delete image from library', 'Image library');
        });

        it('should set isDeleting true', () => {
            spyOn(deleteImage, 'execute').and.returnValue(Promise.resolve());
            imageViewModel.isDeleting(false);

            viewModel.deleteImage(imageViewModel);
            expect(imageViewModel.isDeleting()).toBeTruthy();
        });

        it('should delete image from server', () => {
            spyOn(deleteImage, 'execute').and.returnValue(Promise.resolve());
            
            viewModel.deleteImage(imageViewModel);
            expect(deleteImage.execute).toHaveBeenCalledWith(imageViewModel.id);
        });

        describe('when image is deleted', () => {
            it('should delete image from viewModel', done => {
                spyOn(deleteImage, 'execute').and.returnValue(Promise.resolve());
                
                viewModel.deleteImage(imageViewModel).then(() => {
                    expect(viewModel.images().length).toBe(0);
                    done();
                });
            });
        });

        describe('when image is not deleted', () => {
            beforeEach(() => {
                spyOn(deleteImage, 'execute').and.returnValue(Promise.reject('error'));
            });

            it('should set isDeleting false', done => {
                imageViewModel.isDeleting(true);

                viewModel.deleteImage(imageViewModel).then(() => {
                    expect(imageViewModel.isDeleting()).toBeFalsy();
                    done();
                });
            });

            it('should show error notification', done => {
                spyOn(notify, 'error');

                viewModel.deleteImage(imageViewModel).then(() => {
                    expect(notify.error).toHaveBeenCalledWith('error');
                    done();
                });
            });
        });

        describe('openChooseImageDialogHandler:', () => {
            it('should publish event', () => {
                viewModel.openChooseImageDialogHandler();
                expect(eventTracker.publish).toHaveBeenCalledWith('Open \'choose image file\' dialog', 'Image library');
            });
        });
    });
});