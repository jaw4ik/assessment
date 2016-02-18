import command from './updateEntitiesOrderCommand';

import httpWrapper from 'http/apiHttpWrapper';
import dataContext from 'dataContext';

describe('command learning path [updateEntitiesOrder]', function () {

    describe('execute:', function () {

        var dfd = Q.defer(),
            courses = [{ id: 'courseId1' }, { id: 'courseId2' }],
            learningPath = {
                id: 'id',
                title: 'title',
                entities: []
            };

        beforeEach(function () {
            spyOn(httpWrapper, 'post').and.returnValue(dfd.promise);
        });

        it('should return promise', function () {
            expect(command.execute()).toBePromise();
        });

        it('should send request to the server to update entities order', function (done) {
            dfd.resolve();
            command.execute(learningPath.id, courses).fin(function () {
                expect(httpWrapper.post).toHaveBeenCalledWith('/api/learningpath/entities/order/update',
                    {
                        learningPathId: learningPath.id,
                        entities: [courses[0].id, courses[1].id]
                    });
                done();
            });
        });

        describe('when entities order updated successfully', function () {
            beforeEach(function () {
                dataContext.learningPaths = [learningPath];
                dfd.resolve();
            });

            it('should update learning path courses order in data context', function (done) {
                learningPath.entities = [courses[1], courses[0]];
                command.execute(learningPath.id, courses).fin(function () {
                    expect(learningPath.entities[0]).toBe(courses[0]);
                    expect(learningPath.entities[1]).toBe(courses[1]);
                    done();
                });

            });
        });

    });
});
