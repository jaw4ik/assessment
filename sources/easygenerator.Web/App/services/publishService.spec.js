define(['services/publishService'], function (service) {
    "use strict";

    var
        apiHttpWrapper = require('http/apiHttpWrapper');

    describe('service [publishCourse]', function () {

        describe('buildCourse:', function () {

            var course;
            var post;

            beforeEach(function () {
                course = { id: 'someId' };

                post = $.Deferred();
                spyOn(apiHttpWrapper, 'post').and.returnValue(post.promise());
            });

            it('should be function', function () {
                expect(service.buildCourse).toBeFunction();
            });

            it('should return promise', function () {
                var promise = service.buildCourse();

                expect(promise).toBePromise();
            });

            it('should send request', function (done) {
                post.resolve({});

                var promise = service.buildCourse(course.id);
                promise.fin(done);

                expect(apiHttpWrapper.post).toHaveBeenCalledWith('course/build', { courseId: course.id });
            });

            describe('and send request to server', function () {

                beforeEach(function () {
                    post.resolve({ PackageUrl: 'SomeUrl', BuildOn: '1378106938845' });
                });

                it('should resolve promise with true', function (done) {
                    var promise = service.buildCourse();
                    promise.fin(done);

                    expect(promise).toBeResolvedWith({ packageUrl: 'SomeUrl', builtOn: new Date('1378106938845') });
                });

            });

        });

        describe('scormBuildCourse:', function () {
            var course;
            var post;

            beforeEach(function () {
                course = { id: 'someId' };

                post = $.Deferred();
                spyOn(apiHttpWrapper, 'post').and.returnValue(post.promise());
            });

            it('should be function', function () {
                expect(service.scormBuildCourse).toBeFunction();
            });

            it('should return promise', function () {
                var promise = service.scormBuildCourse();

                expect(promise).toBePromise();
            });

            it('should send request', function (done) {
                post.resolve({});
                var promise = service.scormBuildCourse(course.id);
                promise.fin(done);

                expect(apiHttpWrapper.post).toHaveBeenCalledWith('course/scormbuild', { courseId: course.id });
            });

            describe('and send request to server', function () {

                beforeEach(function () {
                    post.resolve({ ScormPackageUrl: 'SomeUrl' });
                });

                it('should resolve promise with true', function (done) {
                    var promise = service.scormBuildCourse();
                    promise.fin(function () { done(); });

                    expect(promise).toBeResolvedWith({ scormPackageUrl: 'SomeUrl' });
                });

            });

        });

        describe('publishCourse:', function () {
            var course;
            var post;

            beforeEach(function () {
                course = { id: 'someId' };

                post = $.Deferred();
                spyOn(apiHttpWrapper, 'post').and.returnValue(post.promise());
            });

            it('should be function', function () {
                expect(service.publishCourse).toBeFunction();
            });

            it('should return promise', function () {
                var promise = service.publishCourse();

                expect(promise).toBePromise();
            });

            it('should send request', function (done) {
                post.resolve({});
                var promise = service.publishCourse(course.id);
                    promise.fin(done);

                expect(apiHttpWrapper.post).toHaveBeenCalledWith('course/publish', { courseId: course.id });
            });

            describe('and send request to server', function () {

                beforeEach(function () {
                    post.resolve({ PublishedPackageUrl: 'SomeUrl' });
                });

                it('should resolve promise with true', function (done) {
                    var promise = service.publishCourse();
                    promise.fin(done);

                    expect(promise).toBeResolvedWith({ publishedPackageUrl: 'SomeUrl' });
                });

            });

        });

        describe('publishCourseForReview:', function () {
            var course;
            var post;

            beforeEach(function () {
                course = { id: 'someId' };

                post = $.Deferred();
                spyOn(apiHttpWrapper, 'post').and.returnValue(post.promise());
            });

            it('should be function', function () {
                expect(service.publishCourseForReview).toBeFunction();
            });

            it('should return promise', function () {
                var promise = service.publishCourseForReview();

                expect(promise).toBePromise();
            });

            it('should send request', function (done) {
                post.resolve({});
                var promise = service.publishCourseForReview(course.id);
                    promise.fin(done);

                expect(apiHttpWrapper.post).toHaveBeenCalledWith('course/publishForReview', { courseId: course.id });
            });

            describe('and send request to server', function () {

                beforeEach(function () {
                    post.resolve({ ReviewUrl: 'SomeUrl' });
                });

                it('should resolve promise with true', function (done) {
                    var promise = service.publishCourseForReview();
                    promise.fin(done);

                    expect(promise).toBeResolvedWith({ reviewUrl: 'SomeUrl' });
                });

            });

        });

        describe('publishCourseToStore:', function () {
            var course;
            var post;

            beforeEach(function () {
                course = { id: 'someId' };

                post = $.Deferred();
                spyOn(apiHttpWrapper, 'post').and.returnValue(post.promise());
            });

            it('should be function', function () {
                expect(service.publishCourseToStore).toBeFunction();
            });

            it('should return promise', function () {
                var promise = service.publishCourseToStore();

                expect(promise).toBePromise();
            });

            it('should send request to \'\'', function (done) {
                post.resolve({});

                var promise = service.publishCourseToStore(course.id);

                promise.fin(function () {
                    expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/aim4you/publish', { courseId: course.id });
                    done();
                });

            });


            describe('and send request to server', function () {

                describe('and request success', function () {

                    beforeEach(function () {
                        post.resolve(true);
                    });

                    it('should resolve promise with true', function (done) {
                        var promise = service.publishCourseToStore();
                        promise.fin(done);

                        expect(promise).toBeResolvedWith();
                    });

                });

            });
        });

    });

});