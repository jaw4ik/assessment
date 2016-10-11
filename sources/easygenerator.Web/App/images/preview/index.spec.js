import viewModel from './index.js';

describe('images [preview]', () => {
    let image = {
        url: 'imageUrl'
    };

    describe('isShown:', function () {
        it('should be observable', function () {
            expect(viewModel.isShown).toBeObservable();
        });

        it('should be set to false', function () {
            expect(viewModel.isShown()).toBeFalsy();
        });
    });

    describe('isLoaded:', function () {
        it('should be observable', function () {
            expect(viewModel.isLoaded).toBeObservable();
        });

        it('should be set to false', function () {
            expect(viewModel.isLoaded()).toBeFalsy();
        });
    });

    describe('images:', () => {
        it('should be observableArray', function () {
            expect(viewModel.images).toBeObservableArray();
        });
    });

    describe('current:', function () {
        it('should be observable', function () {
            expect(viewModel.current).toBeObservable();
        });

        it('should be set to 0', function () {
            expect(viewModel.current()).toBe(0);
        });
    });

    describe('imageUrl:', function () {
        it('should be computed', function () {
            expect(viewModel.imageUrl).toBeComputed();
        });

        it('should return current image url', function () {
            viewModel.images = ko.observable([image]);
            expect(viewModel.imageUrl()).toBe(image.url);
        });
    });

    describe('show:', () => {
        it('should set current index', () => {
            viewModel.current(0);
            viewModel.show(1);
            expect(viewModel.current()).toBe(1);
        });

        it('should set isShown true', () => {
            viewModel.isShown(false);
            viewModel.show(1);
            expect(viewModel.isShown()).toBeTruthy();
        });
    });

    describe('chooseImage:', () => {

        it('should set new index for current element', () => {
            viewModel.images = ko.observableArray([{}, {}, image]);
            viewModel.current(0);
            viewModel.chooseImage(image);
            expect(viewModel.current()).toBe(2);
        });

    });

    describe('hide:', () => {
        it('should set isShown false', () => {
            viewModel.isShown(true);
            viewModel.hide();
            expect(viewModel.isShown()).toBeFalsy();
        });
    });

    describe('isNextAvailable:', () => {
        beforeEach(() => {
            viewModel.images = ko.observable([image, image]);
        });

        it('should return false if current image is the last', () => {
            viewModel.current(1);
            expect(viewModel.isNextAvailable()).toBeFalsy();
        });

        it('should return true if current image is not the last', () => {
            viewModel.current(0);
            expect(viewModel.isNextAvailable()).toBeTruthy();
        });
    });

    describe('isPrevAvailable:', () => {
        beforeEach(() => {
            viewModel.images = ko.observable([image, image]);
        });

        it('should return false if current image is the first', () => {
            viewModel.current(0);
            expect(viewModel.isPrevAvailable()).toBeFalsy();
        });

        it('should return true if current image is not the first', () => {
            viewModel.current(1);
            expect(viewModel.isPrevAvailable()).toBeTruthy();
        });
    });

    describe('next:', () => {
        beforeEach(() => {
            viewModel.images = ko.observable([image, image]);
        });

        describe('when current image is not the last', () => {
            it('should increase current index', () => {
                viewModel.current(0);
                viewModel.next();
                expect(viewModel.current()).toBe(1);
            });
        });

        describe('when current image is the last', () => {
            it('should not increase current index', () => {
                viewModel.current(1);
                viewModel.next();
                expect(viewModel.current()).toBe(1);
            });
        });
    });

    describe('previous:', () => {
        beforeEach(() => {
            viewModel.images = ko.observable([image, image]);
        });

        describe('when current image is not the first', () => {
            it('should decrease current index', () => {
                viewModel.current(1);
                viewModel.previous();
                expect(viewModel.current()).toBe(0);
            });
        });

        describe('when current image is the first', () => {
            it('should not decrease current index', () => {
                viewModel.current(0);
                viewModel.previous();
                expect(viewModel.current()).toBe(0);
            });
        });
    });
});

