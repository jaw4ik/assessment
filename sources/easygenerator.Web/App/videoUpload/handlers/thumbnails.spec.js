define(['videoUpload/handlers/thumbnails'], function (thumbnailsHandler) {
    "use strict";
    var vimeoCommands = require('videoUpload/commands/vimeo');

    describe('[thumbnailsHandler]', function () {

        it('should be object', function () {
            expect(thumbnailsHandler).toBeObject();
        });

        describe('getThumbnailUrls', function () {
            var defer;

            beforeEach(function () {
                defer = Q.defer();
                spyOn(vimeoCommands, 'getThumbnailUrl').and.returnValue(defer.promise);
            });

            it('should be function', function () {
                expect(thumbnailsHandler.getThumbnailUrls).toBeFunction();
            });

            it('should return promise', function () {
                expect(thumbnailsHandler.getThumbnailUrls()).toBePromise();
            });

            it('should load images for videos', function (done) {
                var videos = [{ vimeoId: 1 }];

                defer.resolve('thumbnail');
                var promise = thumbnailsHandler.getThumbnailUrls(videos);
                promise.fin(function () {
                    expect(videos[0].thumbnailUrl).toBe('thumbnail');
                    done();
                });

            });

        });

    });

});