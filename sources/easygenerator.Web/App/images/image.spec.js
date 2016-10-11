import Image from './image.js';


let image = {
    id: 'imageId',
    title: 'imageTitle',
    url: 'imageUrl'
},
    viewModel;

describe('[image]', () => {
    beforeEach(() => {
        viewModel = new Image(image);
    });

    describe('id:', function () {
        it('should be set', function () {
            expect(viewModel.id).toBe(image.id);
        });
    });

    describe('title:', function () {
        it('should be set', function () {
            expect(viewModel.title).toBe(image.title);
        });
    });

    describe('url:', function () {
        it('should be set', function () {
            expect(viewModel.url).toBe(image.url);
        });
    });

    describe('isDeleteConfirmationShown:', function () {
        it('should be observable', function () {
            expect(viewModel.isDeleteConfirmationShown).toBeObservable();
        });

        it('should be set to false', function () {
            expect(viewModel.isDeleteConfirmationShown()).toBeFalsy();
        });
    });

    describe('isDeleting:', function () {
        it('should be observable', function () {
            expect(viewModel.isDeleting).toBeObservable();
        });

        it('should be set to false', function () {
            expect(viewModel.isDeleting()).toBeFalsy();
        });
    });
});