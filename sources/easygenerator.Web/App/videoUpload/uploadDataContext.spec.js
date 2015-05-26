/*define(['videoUpload/uploadDataContext'], function (uploadDataContext) {
    "use strict";

    var constants = require('constants'),
        videoRepository = require('repositories/videoRepository'),
        progressHandler = require('./handlers/progress'),
        Video = require('models/video');

    describe('[uploadDataContext]', function () {

        it('should be object', function () {
            expect(uploadDataContext).toBeObject();
        });

        describe('queueUploads', function () {

            it('should be array', function() {
                except(uploadDataContext.queueUploads).toBeArray();
            });

        });

        describe('uploadChanged', function () {

            it('should be function', function () {
                except(uploadDataContext.uploadChanged).toBeArray();
            });

        });

    });

});*/