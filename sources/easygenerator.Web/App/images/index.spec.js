import * as getImages from './queries/getImages.js';
import imageUpload from 'imageUpload.js';
import * as deleteImage from './commands/deleteImage.js';
import Image from './image.js';
import notify from 'notify.js';
import preview from './preview/index.js'
import viewModel from './index.js';
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
        it('should publish event', () => {
            spyOn(imageUpload, 'v2').and.returnValue(Promise.reject());
            viewModel.uploadImage({});
            expect(eventTracker.publish).toHaveBeenCalledWith('Upload image file', 'Image library');
        });

        it('should upload image to server', done => {
            let file = { name: 'file' };
            spyOn(imageUpload, 'v2').and.returnValue(Promise.resolve());

            viewModel.uploadImage(file).then(() => {
                expect(imageUpload.v2).toHaveBeenCalledWith(file);
                done();
            });
        });

        describe('when image is uploaded', () => {
            it('should add it to viewModel images', done => {
                let file = { name: 'file' };
                viewModel.images([]);
                spyOn(imageUpload, 'v2').and.returnValue(Promise.resolve(image));

                viewModel.uploadImage(file).then(() => {
                    expect(viewModel.images()[0].id).toBe(imageViewModel.id);
                    expect(viewModel.images()[0].title).toBe(imageViewModel.title);
                    expect(viewModel.images()[0].url).toBe(imageViewModel.url);
                    expect(viewModel.images()[0].thumbnailUrl).toBe(imageViewModel.thumbnailUrl);
                    expect(viewModel.images()[0].isDeleteConfirmationShown()).toBe(imageViewModel.isDeleteConfirmationShown());
                    expect(viewModel.images()[0].isDeleting()).toBe(imageViewModel.isDeleting());

                    done();
                });
            });
        });

        describe('when error occures', () => {
            it('should show error notification', done => {
                let file = { name: 'file' };
                spyOn(imageUpload, 'v2').and.returnValue(Promise.reject('error'));
                spyOn(notify, 'error');

                viewModel.uploadImage(file).then(() => {
                    expect(notify.error).toHaveBeenCalledWith('error');
                    done();
                });
            });
        });
    });
    
    describe('uploadImages:', () => {
        it('should upload all files', () => {
            spyOn(viewModel, 'uploadImage');
            let file1 = { name: 'file1' },
                file2 = { name: 'file2' };

            viewModel.uploadImages(file1, file2);
            expect(viewModel.uploadImage).toHaveBeenCalledWith(file1);
            expect(viewModel.uploadImage).toHaveBeenCalledWith(file2);
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