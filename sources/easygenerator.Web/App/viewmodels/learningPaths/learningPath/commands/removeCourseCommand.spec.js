import command from './removeCourseCommand';

import httpWrapper from 'http/apiHttpWrapper';
import dataContext from 'dataContext';

describe('command learning path [removeCourseCommand]', function () {

    describe('execute:', function () {

        var dfd = Q.defer(),
            learningPath = {
                id: 'id',
                title: 'title',
                entities: []
            },
            course = {
                id: 'courseId'
            };
        beforeEach(function () {
            spyOn(httpWrapper, 'post').and.returnValue(dfd.promise);
        });

        it('should return promise', function () {
            expect(command.execute()).toBePromise();
        });

        it('should send request to the server to remove course', function (done) {
            dfd.resolve();
            command.execute(learningPath.id, course.id).fin(function () {
                expect(httpWrapper.post).toHaveBeenCalledWith('/api/learningpath/course/remove', { learningPathId: learningPath.id, courseId: course.id });
                done();
            });
        });

        describe('when course removed successfully', function () {
            beforeEach(function () {
                dataContext.learningPaths = [learningPath];
                learningPath.entities = [course];
                dfd.resolve();
            });

            it('should remove course from learning path in data context', function (done) {
                command.execute(learningPath.id, course.id).fin(function () {
                    expect(learningPath.entities.length).toBe(0);
                    done();
                });

            });
        });

    });
});
