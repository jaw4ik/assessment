import service from './publishService';

import publishHttpWrapper from 'http/publishHttpWrapper';

describe('service [publishCourse]', function () {

    describe('buildCourse:', function () {

        var course;
        var post;

        beforeEach(function () {
            course = { id: 'someId' };

            post = Q.defer();
            spyOn(publishHttpWrapper, 'post').and.returnValue(post.promise);
        });

        it('should be function', function () {
            expect(service.buildCourse).toBeFunction();
        });

        it('should return promise', function () {
            var promise = service.buildCourse();

            expect(promise).toBePromise();
        });

        let includeMediaToPackage;
        describe('when includeMedia false', () => {
        
            beforeEach(() => {
                includeMediaToPackage = false;
            });

            it('should send request with includeMedia false', function (done) {
                post.resolve({});

                var promise = service.buildCourse(course.id, includeMediaToPackage);
                promise.fin(done);

                expect(publishHttpWrapper.post).toHaveBeenCalledWith('api/course/build', { courseId: course.id, includeMedia: includeMediaToPackage });
            });
        
        });

        describe('when includeMedia true', () => {
        
            beforeEach(() => {
                includeMediaToPackage = true;
            });

            it('should send request with includeMedia true', function (done) {
                post.resolve({});

                var promise = service.buildCourse(course.id, includeMediaToPackage);
                promise.then(function() {
                    expect(publishHttpWrapper.post).toHaveBeenCalledWith('api/course/build', { courseId: course.id, includeMedia: includeMediaToPackage });
                    done();
                });
            });
        
        });

        describe('and send request to server', function () {

            it('should resolve promise with true', function(done) {
                post.resolve({ PackageUrl: 'SomeUrl', BuildOn: 1378106938845 });

                service.buildCourse().then(function(result) {
                    expect(result).toEqual({ packageUrl: 'SomeUrl', builtOn: new Date(1378106938845) });
                    done();
                });

            });

        });

    });

    describe('scormBuildCourse:', function () {
        var course;
        var post;

        beforeEach(function () {
            course = { id: 'someId' };

            post = Q.defer();
            spyOn(publishHttpWrapper, 'post').and.returnValue(post.promise);
        });

        it('should be function', function () {
            expect(service.scormBuildCourse).toBeFunction();
        });

        it('should return promise', function () {
            var promise = service.scormBuildCourse();

            expect(promise).toBePromise();
        });

        let includeMediaToPackage;
        describe('when includeMedia false', () => {
        
            beforeEach(() => {
                includeMediaToPackage = false;
            });

            it('should send request with includeMedia false', function (done) {
                post.resolve({});
                var promise = service.scormBuildCourse(course.id, includeMediaToPackage);
                promise.fin(function () {
                    expect(publishHttpWrapper.post).toHaveBeenCalledWith('api/course/scormbuild', { courseId: course.id, includeMedia: includeMediaToPackage });
                    done();
                });
            });
        
        });

        describe('when includeMedia true', () => {
        
            beforeEach(() => {
                includeMediaToPackage = true;
            });

            it('should send request with includeMedia true', function (done) {
                post.resolve({});
                var promise = service.scormBuildCourse(course.id, includeMediaToPackage);
                promise.fin(function () {
                    expect(publishHttpWrapper.post).toHaveBeenCalledWith('api/course/scormbuild', { courseId: course.id, includeMedia: includeMediaToPackage });
                    done();
                });
            });
        
        });

        describe('and send request to server', function () {

            beforeEach(function () {
                post.resolve({ ScormPackageUrl: 'SomeUrl' });
            });

            it('should resolve promise with true', function (done) {
                var promise = service.scormBuildCourse();
                promise.fin(function () {
                    expect(promise).toBeResolvedWith({ scormPackageUrl: 'SomeUrl' });
                    done();
                });
            });

        });

    });

    describe('publishCourse:', function () {
        var course;
        var post;

        beforeEach(function () {
            course = { id: 'someId' };

            post = Q.defer();
            spyOn(publishHttpWrapper, 'post').and.returnValue(post.promise);
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
            promise.fin(function () {
                expect(publishHttpWrapper.post).toHaveBeenCalledWith('api/course/publish', { courseId: course.id });
                done();
            });

        });

        describe('and send request to server', function () {

            beforeEach(function () {
                post.resolve({ PublishedPackageUrl: 'SomeUrl' });
            });

            it('should resolve promise with true', function (done) {
                var promise = service.publishCourse();

                promise.fin(function () {
                    expect(promise).toBeResolvedWith({ publishedPackageUrl: 'SomeUrl' });
                    done();
                });
            });

        });

    });

    describe('publishCourseForReview:', function () {
        var course;
        var post;

        beforeEach(function () {
            course = { id: 'someId' };

            post = Q.defer();
            spyOn(publishHttpWrapper, 'post').and.returnValue(post.promise);
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

            promise.fin(function () {
                expect(publishHttpWrapper.post).toHaveBeenCalledWith('api/course/publishForReview', { courseId: course.id });
                done();
            });
        });

        describe('and send request to server', function () {

            beforeEach(function () {
                post.resolve({ ReviewUrl: 'SomeUrl' });
            });

            it('should resolve promise with true', function (done) {
                var promise = service.publishCourseForReview();
                promise.fin(function () {
                    expect(promise).toBeResolvedWith({ reviewUrl: 'SomeUrl' });
                    done();
                });

            });

        });

    });

    describe('buildLearningPath:', function() {
        var post,
            learningPathId;

        beforeEach(function () {
            post = Q.defer();
            learningPathId = 'learnigPathId';
            spyOn(publishHttpWrapper, 'post').and.returnValue(post.promise);
        });

        it('should be a function', function () {
            expect(service.buildLearningPath).toBeFunction();
        });

        it('should return promise', function () {
            var promise = service.buildLearningPath(learningPathId);

            expect(promise).toBePromise();
        });

        it('should send request', function (done) {
            post.resolve({});

            var promise = service.buildLearningPath(learningPathId);
            promise.fin(done);

            expect(publishHttpWrapper.post).toHaveBeenCalledWith('api/learningpath/build', { learningPathId: learningPathId });
        });

        describe('when server return response', function () {

            it('should resolve promise with packageUrl', function (done) {
                post.resolve({ PackageUrl: 'SomeUrl' });

                var promise = service.buildLearningPath(learningPathId);
                promise.then(function () {
                    expect(promise).toBeResolvedWith({ packageUrl: 'SomeUrl' });
                    done();
                });

            });

        });
    });

    describe('publishLearningPath:', function () {
        var post,
            learningPathId;

        beforeEach(function () {
            post = Q.defer();
            learningPathId = 'learnigPathId';
            spyOn(publishHttpWrapper, 'post').and.returnValue(post.promise);
        });

        it('should be a function', function () {
            expect(service.publishLearningPath).toBeFunction();
        });

        it('should return promise', function () {
            var promise = service.publishLearningPath(learningPathId);

            expect(promise).toBePromise();
        });

        it('should send request', function (done) {
            post.resolve({});

            var promise = service.publishLearningPath(learningPathId);
            promise.fin(done);

            expect(publishHttpWrapper.post).toHaveBeenCalledWith('api/learningpath/publish', { learningPathId: learningPathId });
        });

        describe('when server return response', function () {

            it('should resolve promise with packageUrl', function (done) {
                post.resolve({ PublicationUrl: 'SomeUrl' });

                var promise = service.publishLearningPath(learningPathId);
                promise.then(function () {
                    expect(promise).toBeResolvedWith({ publicationUrl: 'SomeUrl' });
                    done();
                });

            });

        });
    });

    describe('publishCourseToCustomLms:', function () {
        var course;
        var company;
        var post;

        beforeEach(function () {
            course = { id: 'someId' };
            company = { id: 'companyId' };

            post = Q.defer();
            spyOn(publishHttpWrapper, 'post').and.returnValue(post.promise);
        });

        it('should be a function', function () {
            expect(service.publishCourseToCustomLms).toBeFunction();
        });

        it('should return promise', function () {
            expect(service.publishCourseToCustomLms()).toBePromise();
        });

        it('should send request', function (done) {
            post.resolve({});
            var promise = service.publishCourseToCustomLms(course.id, company.id);
            promise.fin(function () {
                expect(publishHttpWrapper.post).toHaveBeenCalledWith('api/course/publishToCustomLms', { courseId: course.id, companyId: company.id });
                done();
            });
        });

    });

    describe('publishLearningPathToCustomLms:', function () {
        var learningPathId = 'learningPathId',
            companyId = 'companyId',
            postDfr;

        beforeEach(function () {
            postDfr = Q.defer();
            spyOn(publishHttpWrapper, 'post').and.returnValue(postDfr.promise);
        });

        it('should be a function', function () {
            expect(service.publishLearningPathToCustomLms).toBeFunction();
        });

        it('should return promise', function () {
            expect(service.publishLearningPathToCustomLms()).toBePromise();
        });

        it('should send request', function (done) {
            postDfr.resolve();
            var promise = service.publishLearningPathToCustomLms(learningPathId, companyId);
            promise.fin(function () {
                expect(publishHttpWrapper.post).toHaveBeenCalledWith('api/learningpath/publishToCustomLms', { learningPathId: learningPathId, companyId: companyId });
                done();
            });
        });

    });

    describe('publishCourseToCoggno:', function () {
        var course;
        var post;

        beforeEach(function () {
            course = { id: 'someId' };

            post = Q.defer();
            spyOn(publishHttpWrapper, 'post').and.returnValue(post.promise);
        });

        it('should be a function', function () {
            expect(service.publishCourseToCoggno).toBeFunction();
        });

        it('should return promise', function () {
            expect(service.publishCourseToCoggno()).toBePromise();
        });

        it('should send request', function (done) {
            post.resolve({});
            var promise = service.publishCourseToCoggno(course.id);
            promise.fin(function () {
                expect(publishHttpWrapper.post).toHaveBeenCalledWith('api/course/publishToCoggno', { courseId: course.id });
                done();
            });
        });

    });

});