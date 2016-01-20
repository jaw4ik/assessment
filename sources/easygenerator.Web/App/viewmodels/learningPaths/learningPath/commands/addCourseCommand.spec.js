define(['viewmodels/learningPaths/learningPath/commands/addCourseCommand'], function (command) {
    "use strict";
    var
        httpWrapper = require('http/apiHttpWrapper'),
        dataContext = require('dataContext')
    ;

    describe('command learning path [addCourseCommand]', function () {

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

            it('should send request to the server to add course', function (done) {
                dfd.resolve();
                command.execute(learningPath.id, course.id).fin(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('/api/learningpath/course/add', { learningPathId: learningPath.id, courseId: course.id });
                    done();
                });
            });

            describe('when course added successfully', function () {
                beforeEach(function () {
                    dataContext.learningPaths = [learningPath];
                    dataContext.courses = [course];
                    dfd.resolve();
                });

                it('should add course to learning path in data context', function (done) {
                    command.execute(learningPath.id, course.id).fin(function () {
                        expect(learningPath.entities.length).toBe(1);
                        expect(learningPath.entities[0]).toBe(course);
                        done();
                    });

                });
            });

        });
    });


});