define(['commands/createCourseCommand'], function (command) {

    var
        repository = require('repositories/courseRepository'),
        router = require('plugins/router'),
        clientContext = require('clientContext'),
        constants = require('constants')
    ;

    describe('command [createCourseCommand]', function () {

        describe('execute:', function () {
            var title = 'title',
                templateId = 'templateId',
                addCourse;

            beforeEach(function () {
                addCourse = Q.defer();

                spyOn(router, 'navigate');
                spyOn(repository, 'addCourse').and.returnValue(addCourse.promise);
                spyOn(clientContext, 'set');
            });

            it('should be function', function () {
                expect(command.execute).toBeFunction();
            });

            it('should return promise', function () {
                expect(command.execute(title, templateId)).toBePromise();
            });

            it('should add course', function () {
                command.execute(title, templateId);
                expect(repository.addCourse).toHaveBeenCalledWith(title, templateId);
            });

            describe('when course added', function () {

                var course = { id: 'courseId' };

                beforeEach(function () {
                    addCourse.resolve(course);
                });

                it('should set client context lastCreatedCourseId', function (done) {
                    var promise = command.execute(title, templateId);

                    promise.fin(function () {
                        expect(clientContext.set).toHaveBeenCalledWith(constants.clientContextKeys.lastCreatedCourseId, course.id);
                        done();
                    });
                });

                it('should resolve promise with course', function (done) {
                    var promise = command.execute(title, templateId);

                    promise.fin(function () {
                        expect(promise.inspect().value).toBe(course);
                        done();
                    });
                });
            });

        });

    });

})
