define(['viewmodels/learningPaths/learningPath/commands/updateCoursesOrderCommand'], function (command) {
    "use strict";
    var
        httpWrapper = require('http/apiHttpWrapper'),
        dataContext = require('dataContext')
    ;

    describe('command learning path [updateCoursesOrder]', function () {

        describe('execute:', function () {

            var dfd = Q.defer(),
                courses = [{ id: 'courseId1' }, { id: 'courseId2' }],
                learningPath = {
                    id: 'id',
                    title: 'title',
                    courses: []
                };

            beforeEach(function () {
                spyOn(httpWrapper, 'post').and.returnValue(dfd.promise);
            });

            it('should return promise', function () {
                expect(command.execute()).toBePromise();
            });

            it('should send request to the server to update courses order', function (done) {
                dfd.resolve();
                command.execute(learningPath.id, courses).fin(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('/api/learningpath/courses/order/update',
                        {
                            learningPathId: learningPath.id,
                            courses: [courses[0].id, courses[1].id]
                        });
                    done();
                });
            });

            describe('when courses order updated successfully', function () {
                beforeEach(function () {
                    dataContext.learningPaths = [learningPath];
                    dfd.resolve();
                });

                it('should update learning path courses order in data context', function (done) {
                    learningPath.courses = [courses[1], courses[0]];
                    command.execute(learningPath.id, courses).fin(function () {
                        expect(learningPath.courses[0]).toBe(courses[0]);
                        expect(learningPath.courses[1]).toBe(courses[1]);
                        done();
                    });

                });
            });

        });
    });


});