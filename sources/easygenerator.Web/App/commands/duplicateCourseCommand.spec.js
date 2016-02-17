import command from './duplicateCourseCommand';

import repository from 'repositories/courseRepository';
import eventTracker from 'eventTracker';
import clientContext from 'clientContext';
import constants from 'constants';

describe('command [duplicateCourseCommand]', function () {

    describe('execute:', function () {

        var duplicateCourse,
            courseId = 'courseId',
            eventCategory = 'eventCategory';

        beforeEach(function () {
            duplicateCourse = Q.defer();

            spyOn(repository, 'duplicateCourse').and.returnValue(duplicateCourse.promise);
            spyOn(eventTracker, 'publish');
            spyOn(clientContext, 'set');
        });

        it('should be function', function () {
            expect(command.execute).toBeFunction();
        });

        it('should return promise', function () {
            expect(command.execute(courseId, eventCategory)).toBePromise();
        });

        it('should publish event \'Duplicate course\'', function () {
            command.execute(courseId, eventCategory);
            expect(eventTracker.publish).toHaveBeenCalledWith('Duplicate course', eventCategory);
        });

        it('should duplicate course', function () {
            command.execute(courseId, eventCategory);
            expect(repository.duplicateCourse).toHaveBeenCalledWith(courseId);
        });

        describe('when course duplicated', function () {

            var course = { id: 'courseId' };

            beforeEach(function () {
                duplicateCourse.resolve(course);
            });

            it('should set client context lastCreatedCourseId', function (done) {
                var promise = command.execute(course.id, eventCategory);

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
