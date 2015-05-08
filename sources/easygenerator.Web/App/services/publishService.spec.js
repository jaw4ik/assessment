define(['services/publishService'], function (service) {
    "use strict";

    var
        localizationManager = require('localization/localizationManager'),
        http = require('plugins/http');

    describe('service [publishCourse]', function () {

        describe('buildCourse:', function () {

            var course;
            var post;

            beforeEach(function () {
                course = { id: 'someId' };

                post = $.Deferred();
                spyOn(http, 'post').and.returnValue(post.promise());
            });

            it('should be function', function () {
                expect(service.buildCourse).toBeFunction();
            });

            it('should return promise', function () {
                var promise = service.buildCourse();

                expect(promise).toBePromise();
            });

            it('should send request', function (done) {
                post.resolve();
                var promise = service.buildCourse(course.id).fin(function () { });
                promise.fin(done);

                expect(http.post).toHaveBeenCalledWith('course/build', { courseId: course.id });
            });

            describe('and send request to server', function () {

                describe('and request succeed', function () {

                    describe('and response is undefined', function () {

                        it('should reject promise', function (done) {
                            var promise = service.buildCourse();
                            promise.fin(done);

                            post.resolve();

                            expect(promise).toBeRejected();
                        });

                    });

                    describe('and response.success is undefined', function () {

                        it('should reject promise', function (done) {
                            var promise = service.buildCourse();
                            promise.fin(done);

                            post.resolve({});

                            expect(promise).toBeRejected();
                        });

                    });

                    describe('and response.success is true', function () {

                        beforeEach(function () {
                            post.resolve({ success: true, data: { PackageUrl: 'SomeUrl', BuildOn: '1378106938845' } });
                        });

                        it('should resolve promise with true', function (done) {
                            var promise = service.buildCourse();
                            promise.fin(done);

                            expect(promise).toBeResolvedWith({ packageUrl: 'SomeUrl', builtOn: new Date('1378106938845') });
                        });

                    });

                    describe('and response.success is false', function () {

                        describe('and response.resourceKey is a string', function () {

                            var lozalizedMessage = 'localized message';

                            beforeEach(function () {
                                spyOn(localizationManager, 'localize').and.returnValue(lozalizedMessage);
                            });

                            it('should reject promise with localized message', function (done) {
                                var promise = service.buildCourse();
                                promise.fin(done);

                                var buildResult = { success: false, resourceKey: 'message' };

                                post.resolve(buildResult);

                                expect(promise).toBeRejectedWith(lozalizedMessage);
                            });

                        });

                        describe('and response.resourceKey does not exist', function () {

                            it('should reject promise with response message', function (done) {
                                var promise = service.buildCourse();
                                promise.fin(done);

                                var buildResult = { success: false, message: 'message' };

                                post.resolve(buildResult);

                                expect(promise).toBeRejectedWith(buildResult.message);
                            });

                        });

                    });

                });

                describe('and request failed', function () {

                    it('should reject promise', function (done) {
                        var promise = service.buildCourse();
                        promise.fin(done);

                        post.resolve();

                        expect(promise).toBeRejected();
                    });

                });

            });

        });

        describe('scormBuildCourse:', function () {
            var course;
            var post;

            beforeEach(function () {
                course = { id: 'someId' };

                post = $.Deferred();
                spyOn(http, 'post').and.returnValue(post.promise());
            });

            it('should be function', function () {
                expect(service.scormBuildCourse).toBeFunction();
            });

            it('should return promise', function () {
                var promise = service.scormBuildCourse();

                expect(promise).toBePromise();
            });

            it('should send request', function (done) {
                post.resolve();
                var promise = service.scormBuildCourse(course.id).fin(function () { });
                promise.fin(done);

                expect(http.post).toHaveBeenCalledWith('course/scormbuild', { courseId: course.id });
            });

            describe('and send request to server', function () {

                describe('and request succeed', function () {

                    describe('and response is undefined', function () {

                        it('should reject promise', function (done) {
                            var promise = service.scormBuildCourse();
                            promise.fin(done);

                            post.resolve();

                            expect(promise).toBeRejected();
                        });

                    });

                    describe('and response.success is undefined', function () {

                        it('should reject promise', function (done) {
                            var promise = service.scormBuildCourse();
                            promise.fin(done);

                            post.resolve({});

                            expect(promise).toBeRejected();
                        });

                    });

                    describe('and response.success is true', function () {

                        beforeEach(function () {
                            post.resolve({ success: true, data: { ScormPackageUrl: 'SomeUrl' } });
                        });

                        it('should resolve promise with true', function (done) {
                            var promise = service.scormBuildCourse();
                            promise.fin(done);

                            expect(promise).toBeResolvedWith({ scormPackageUrl: 'SomeUrl' });
                        });

                    });

                    describe('and response.success is false', function () {

                        describe('and response.resourceKey is a string', function () {

                            var lozalizedMessage = 'localized message';

                            beforeEach(function () {
                                spyOn(localizationManager, 'localize').and.returnValue(lozalizedMessage);
                            });

                            it('should reject promise with localized message', function (done) {
                                var promise = service.scormBuildCourse();
                                promise.fin(done);

                                var buildResult = { success: false, resourceKey: 'message' };

                                post.resolve(buildResult);

                                expect(promise).toBeRejectedWith(lozalizedMessage);
                            });

                        });

                        describe('and response.resourceKey does not exist', function () {

                            it('should reject promise with response message', function (done) {
                                var promise = service.scormBuildCourse();
                                promise.fin(done);

                                var buildResult = { success: false, message: 'message' };

                                post.resolve(buildResult);

                                expect(promise).toBeRejectedWith(buildResult.message);
                            });

                        });

                    });

                });

                describe('and request failed', function () {

                    it('should reject promise', function (done) {
                        var promise = service.scormBuildCourse();
                        promise.fin(done);

                        post.resolve();

                        expect(promise).toBeRejected();
                    });

                });

            });

        });

        describe('publishCourse:', function () {
            var course;
            var post;

            beforeEach(function () {
                course = { id: 'someId' };

                post = $.Deferred();
                spyOn(http, 'post').and.returnValue(post.promise());
            });

            it('should be function', function () {
                expect(service.publishCourse).toBeFunction();
            });

            it('should return promise', function () {
                var promise = service.publishCourse();

                expect(promise).toBePromise();
            });

            it('should send request', function (done) {
                post.resolve();
                var promise = service.publishCourse(course.id).fin(function () { });
                promise.fin(done);

                expect(http.post).toHaveBeenCalledWith('course/publish', { courseId: course.id });
            });

            describe('and send request to server', function () {

                describe('and request succeed', function () {

                    describe('and response is undefined', function () {

                        it('should reject promise', function (done) {
                            var promise = service.publishCourse();
                            promise.fin(done);

                            post.resolve();

                            expect(promise).toBeRejected();
                        });

                    });

                    describe('and response.success is undefined', function () {

                        it('should reject promise', function (done) {
                            var promise = service.publishCourse();
                            promise.fin(done);

                            post.resolve({});

                            expect(promise).toBeRejected();
                        });

                    });

                    describe('and response.success is true', function () {

                        beforeEach(function () {
                            post.resolve({ success: true, data: { PublishedPackageUrl: 'SomeUrl' } });
                        });

                        it('should resolve promise with true', function (done) {
                            var promise = service.publishCourse();
                            promise.fin(done);

                            expect(promise).toBeResolvedWith({ publishedPackageUrl: 'SomeUrl' });
                        });

                    });

                    describe('and response.success is false', function () {

                        describe('and response.resourceKey is a string', function () {

                            var lozalizedMessage = 'localized message';

                            beforeEach(function () {
                                spyOn(localizationManager, 'localize').and.returnValue(lozalizedMessage);
                            });

                            it('should reject promise with localized message', function (done) {
                                var promise = service.publishCourse();
                                promise.fin(done);

                                var buildResult = { success: false, resourceKey: 'message' };

                                post.resolve(buildResult);

                                expect(promise).toBeRejectedWith(lozalizedMessage);
                            });

                        });

                        describe('and response.resourceKey does not exist', function () {

                            it('should reject promise with response message', function (done) {
                                var promise = service.publishCourse();
                                promise.fin(done);

                                var buildResult = { success: false, message: 'message' };

                                post.resolve(buildResult);

                                expect(promise).toBeRejectedWith(buildResult.message);
                            });

                        });

                    });

                });

                describe('and request failed', function () {

                    it('should reject promise', function (done) {
                        var promise = service.publishCourse();
                        promise.fin(done);

                        post.resolve();

                        expect(promise).toBeRejected();
                    });

                });

            });

        });

        describe('publishCourseForReview:', function () {
            var course;
            var post;

            beforeEach(function () {
                course = { id: 'someId' };

                post = $.Deferred();
                spyOn(http, 'post').and.returnValue(post.promise());
            });

            it('should be function', function () {
                expect(service.publishCourseForReview).toBeFunction();
            });

            it('should return promise', function () {
                var promise = service.publishCourseForReview();

                expect(promise).toBePromise();
            });

            it('should send request', function (done) {
                post.resolve();
                var promise = service.publishCourseForReview(course.id).fin(function () { });
                promise.fin(done);

                expect(http.post).toHaveBeenCalledWith('course/publishForReview', { courseId: course.id });
            });

            describe('and send request to server', function () {

                describe('and request succeed', function () {

                    describe('and response is undefined', function () {

                        it('should reject promise', function (done) {
                            var promise = service.publishCourseForReview();
                            promise.fin(done);

                            post.resolve();

                            expect(promise).toBeRejected();
                        });

                    });

                    describe('and response.success is undefined', function () {

                        it('should reject promise', function (done) {
                            var promise = service.publishCourseForReview();
                            promise.fin(done);

                            post.resolve({});

                            expect(promise).toBeRejected();
                        });

                    });

                    describe('and response.success is true', function () {

                        beforeEach(function () {
                            post.resolve({ success: true, data: { ReviewUrl: 'SomeUrl' } });
                        });

                        it('should resolve promise with true', function (done) {
                            var promise = service.publishCourseForReview();
                            promise.fin(done);

                            expect(promise).toBeResolvedWith({ reviewUrl: 'SomeUrl' });
                        });

                    });

                    describe('and response.success is false', function () {

                        describe('and response.resourceKey is a string', function () {

                            var lozalizedMessage = 'localized message';

                            beforeEach(function () {
                                spyOn(localizationManager, 'localize').and.returnValue(lozalizedMessage);
                            });

                            it('should reject promise with localized message', function (done) {
                                var promise = service.publishCourseForReview();
                                promise.fin(done);

                                var buildResult = { success: false, resourceKey: 'message' };

                                post.resolve(buildResult);

                                expect(promise).toBeRejectedWith(lozalizedMessage);
                            });

                        });

                        describe('and response.resourceKey does not exist', function () {

                            it('should reject promise with response message', function (done) {
                                var promise = service.publishCourseForReview();
                                promise.fin(done);

                                var buildResult = { success: false, message: 'message' };

                                post.resolve(buildResult);

                                expect(promise).toBeRejectedWith(buildResult.message);
                            });

                        });

                    });

                });

                describe('and request failed', function () {

                    it('should reject promise', function (done) {
                        var promise = service.publishCourseForReview();
                        promise.fin(done);

                        post.resolve();

                        expect(promise).toBeRejected();
                    });

                });

            });

        });

        describe('publishCourseToStore:', function () {
            var course;
            var post;

            beforeEach(function () {
                course = { id: 'someId' };

                post = $.Deferred();
                spyOn(http, 'post').and.returnValue(post.promise());
            });

            it('should be function', function () {
                expect(service.publishCourseToStore).toBeFunction();
            });

            it('should return promise', function () {
                var promise = service.publishCourseToStore();

                expect(promise).toBePromise();
            });

            it('should send request to \'\'', function (done) {

                var promise = service.publishCourseToStore(course.id);

                promise.fin(function () {
                    expect(http.post).toHaveBeenCalledWith('api/aim4you/publish', { courseId: course.id });
                    done();
                });

                post.resolve();

            });


            describe('and send request to server', function () {

                describe('and request success', function () {

                    describe('and response is undefined', function () {

                        it('should reject promise', function (done) {
                            var promise = service.publishCourseToStore();
                            promise.fin(done);

                            post.resolve();

                            expect(promise).toBeRejected();
                        });

                    });

                    describe('and response.success is undefined', function () {

                        it('should reject promise', function (done) {
                            var promise = service.publishCourseToStore();
                            promise.fin(done);

                            post.resolve({});

                            expect(promise).toBeRejected();
                        });

                    });

                    describe('and response.success is true', function () {

                        beforeEach(function () {
                            post.resolve({ success: true, data: true });
                        });

                        it('should resolve promise with true', function (done) {
                            var promise = service.publishCourseToStore();
                            promise.fin(done);

                            expect(promise).toBeResolvedWith();
                        });

                    });

                    describe('and response.success is false', function () {

                        describe('and response.resourceKey is a string', function () {

                            var lozalizedMessage = 'localized message';

                            beforeEach(function () {
                                spyOn(localizationManager, 'localize').and.returnValue(lozalizedMessage);
                            });

                            it('should reject promise with localized message', function (done) {
                                var promise = service.publishCourseToStore();
                                promise.fin(done);

                                var buildResult = { success: false, resourceKey: 'message' };

                                post.resolve(buildResult);

                                expect(promise).toBeRejectedWith(lozalizedMessage);
                            });

                        });

                        describe('and response.resourceKey does not exist', function () {

                            it('should reject promise with response message', function (done) {
                                var promise = service.publishCourse();
                                promise.fin(done);

                                var buildResult = { success: false, message: 'message' };

                                post.resolve(buildResult);

                                expect(promise).toBeRejectedWith(buildResult.message);
                            });

                        });

                    });

                });

                describe('and request failed', function () {

                    it('should reject promise', function (done) {
                        var promise = service.publishCourseToStore();
                        promise.fin(done);

                        post.resolve();

                        expect(promise).toBeRejected();
                    });

                });

            });
        });

    });

});