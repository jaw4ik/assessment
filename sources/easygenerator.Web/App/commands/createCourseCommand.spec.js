define(['commands/createCourseCommand'], function (command) {

    var
        repository = require('repositories/courseRepository'),
        localizationManager = require('localization/localizationManager'),
        router = require('plugins/router'),
        eventTracker = require('eventTracker'),
        clientContext = require('clientContext'),
        constants = require('constants')
    ;

    describe('command [createCourseCommand]', function () {

        describe('execute:', function () {

            var addCourse,
                defaultTitle = 'default title',
                eventCategory = 'eventCategory';

            beforeEach(function () {
                addCourse = Q.defer();

                spyOn(router, 'navigate');
                spyOn(repository, 'addCourse').and.returnValue(addCourse.promise);
                spyOn(eventTracker, 'publish');
                spyOn(localizationManager, 'localize').and.returnValue(defaultTitle);
                spyOn(clientContext, 'set');
            });

            it('should be function', function () {
                expect(command.execute).toBeFunction();
            });

            it('should return promise', function () {
                expect(command.execute(eventCategory)).toBePromise();
            });

            it('should publish event \'Create course and open its properties\'', function () {
                command.execute(eventCategory);
                expect(eventTracker.publish).toHaveBeenCalledWith('Create course and open its properties', eventCategory);
            });

            it('should add course', function () {
                command.execute(eventCategory);
                expect(repository.addCourse).toHaveBeenCalledWith(defaultTitle);
            });

            describe('when course added', function () {

                var course = { id: 'courseId' };

                beforeEach(function () {
                    addCourse.resolve(course);
                });

                it('should set client context lastCreatedCourseId', function (done) {
                    var promise = command.execute(eventCategory);

                    promise.fin(function () {
                        expect(clientContext.set).toHaveBeenCalledWith(constants.clientContextKeys.lastCreatedCourseId, course.id);
                        done();
                    });
                });

                it('should resolve promise with course', function (done) {
                    var promise = command.execute(eventCategory);

                    promise.fin(function () {
                        expect(promise.inspect().value).toBe(course);
                        done();
                    });
                });
            });

        });

    });

})
