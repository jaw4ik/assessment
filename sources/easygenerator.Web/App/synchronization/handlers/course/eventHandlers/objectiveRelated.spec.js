define(['synchronization/handlers/course/eventHandlers/objectiveRelated'], function (handler) {
    "use strict";

    var
        dataContext = require('dataContext'),
        app = require('durandal/app'),
        objectiveModelMapper = require('mappers/objectiveModelMapper')
    ;

    describe('synchronization course [objectiveRelated]', function () {

        var course = { Id: 'courseId' },
            mappedCourse = { id: course.Id, collaborators: [] };

        beforeEach(function () {
            spyOn(app, 'trigger');
        });

        var modifiedOn = new Date(),
            objectiveId = 'obj1',
            courseId = mappedCourse.id,
            objective = { id: objectiveId },
            objectiveData = { id: objectiveId };

        beforeEach(function () {
            spyOn(objectiveModelMapper, 'map').and.returnValue(objective);
        });

        it('should be function', function () {
            expect(handler).toBeFunction();
        });

        describe('when courseId is not a string', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(undefined, objectiveData, 0, modifiedOn.toISOString());
                };

                expect(f).toThrow('CourseId is not a string');
            });
        });

        describe('when objective is not an object', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(courseId, undefined, 0, modifiedOn.toISOString());
                };

                expect(f).toThrow('Objective is not an object');
            });
        });

        describe('when modifiedOn is not a string', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(courseId, objectiveData, 0, undefined);
                };

                expect(f).toThrow('ModifiedOn is not a string');
            });
        });

        describe('when course is not found in data context', function () {
            it('should throw an exception', function () {
                dataContext.courses = [];

                var f = function () {
                    handler(courseId, objectiveData, 0, modifiedOn.toISOString());
                };

                expect(f).toThrow('Course has not been found');
            });
        });

        describe('when objective is not found in data context', function () {
            it('should push objective to data context', function () {
                dataContext.courses = [mappedCourse];
                dataContext.objectives = [];

                handler(courseId, objectiveData, 0, modifiedOn.toISOString());

                expect(dataContext.objectives.length).toBe(1);
            });
        });

        describe('when target index is not defined', function () {
            it('should push objective to course', function () {
                dataContext.courses = [mappedCourse];
                dataContext.objectives = [objective];
                mappedCourse.objectives = [];

                handler(courseId, objectiveData, 0, modifiedOn.toISOString());

                expect(dataContext.courses[0].objectives.length).toBe(1);
            });
        });

        describe('when target index is defined', function () {
            it('should insert objective with target index', function () {
                dataContext.courses = [mappedCourse];
                var obj = { id: 'id' };
                dataContext.objectives = [objective, obj];
                mappedCourse.objectives = [obj];

                handler(courseId, objectiveData, 0, modifiedOn.toISOString());

                expect(dataContext.courses[0].objectives[0].id).toBe(objectiveId);
            });
        });

        it('should update course modified on date', function () {
            mappedCourse.modifiedOn = "";
            dataContext.courses = [mappedCourse];
            dataContext.objectives = [objective];
            mappedCourse.objectives = [];

            handler(courseId, objectiveData, 0, modifiedOn.toISOString());
            expect(dataContext.courses[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
        });

        it('should trigger app event', function () {
            dataContext.courses = [mappedCourse];
            dataContext.objectives = [objective];
            mappedCourse.objectives = [];

            handler(courseId, objectiveData, 0, modifiedOn.toISOString());
            expect(app.trigger).toHaveBeenCalled();
        });
    });

})