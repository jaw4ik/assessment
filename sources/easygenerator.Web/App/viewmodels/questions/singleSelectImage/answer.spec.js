define(function (require) {
    "use strict";

    var ctor = require('viewmodels/questions/singleSelectImage/answer');


    describe('question singleSelectImage [answer]', function () {

        var id = 'id',
            image = 'image';

        it('should be defined', function () {
            expect(ctor).toBeDefined();
        });

        it('should define id', function () {
            var answer = new ctor(id, image);
            expect(answer.id).toBeObservable();
        });

        it('should define image', function () {
            var answer = new ctor(id, image);
            expect(answer.image).toBeObservable();
        });

        it('should define isProcessing', function () {
            var answer = new ctor(id, image);
            expect(answer.isProcessing).toBeObservable();
        });

        it('should define isDeleted', function () {
            var answer = new ctor(id, image);
            expect(answer.isDeleted).toBeFalsy();
        });

        it('should define isEditing', function () {
            var answer = new ctor(id, image);
            expect(answer.isEditing).toBeObservable();
        });

        it('should define isImageLoading', function () {
            var answer = new ctor(id, image);
            expect(answer.isImageLoading).toBeObservable();
        });

        describe('hasImage:', function() {
            it('should define computed', function () {
                var answer = new ctor(id, image);
                expect(answer.hasImage).toBeComputed();
            });

            it('should be true when image is defined', function() {
                var answer = new ctor(id, image);
                expect(answer.hasImage()).toBeTruthy();
            });

            it('should be true when image is defined', function () {
                var answer = new ctor(id, null);
                expect(answer.hasImage()).toBeFalsy();
            });
        });
    });
});