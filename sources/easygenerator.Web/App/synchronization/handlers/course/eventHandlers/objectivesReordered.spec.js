define(['synchronization/handlers/course/eventHandlers/objectivesReordered'], function (handler) {
    "use strict";

    var
        dataContext = require('dataContext'),
        app = require('durandal/app')
    ;

    describe('synchronization course [objectivesReordered]', function () {

        var course = { Id: 'courseId' },
            mappedCourse = { id: course.Id, collaborators: [] };

        beforeEach(function () {
            spyOn(app, 'trigger');
        });

        var modifiedOn = new Date(),
            objectiveId1 = 'obj1',
            objectiveId2 = 'obj2',
            objectivesOrder = [objectiveId2, objectiveId1],
            objectives = [{ id: objectiveId1 }, { id: objectiveId2 }];

        it('should be function', function () {
            expect(handler).toBeFunction();
        });

        describe('when courseId is not a string', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(undefined, objectivesOrder, modifiedOn.toISOString());
                };

                expect(f).toThrow('CourseId is not a string');
            });
        });

        describe('when templateId is not a string', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(mappedCourse.id, undefined, modifiedOn.toISOString());
                };

                expect(f).toThrow('ObjectiveIds is not an array');
            });
        });

        describe('when modifiedOn is not a date', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(mappedCourse.id, objectivesOrder, undefined);
                };

                expect(f).toThrow('ModifiedOn is not a string');
            });
        });

        describe('when course is not found in data context', function () {
            it('should throw an exception', function () {
                dataContext.courses = [];

                var f = function () {
                    handler(mappedCourse.id, objectivesOrder, modifiedOn.toISOString());
                };

                expect(f).toThrow('Course has not been found');
            });
        });

        it('should update course objectives order', function () {
            mappedCourse.objectives = objectives;
            dataContext.courses = [mappedCourse];

            handler(mappedCourse.id, objectivesOrder, modifiedOn.toISOString());
            expect(dataContext.courses[0].objectives[0].id).toBe(objectiveId2);
            expect(dataContext.courses[0].objectives[1].id).toBe(objectiveId1);
        });

        it('should update course modified on date', function () {
            mappedCourse.modifiedOn = "";
            dataContext.courses = [mappedCourse];
            mappedCourse.objectives = objectives;

            handler(mappedCourse.id, objectivesOrder, modifiedOn.toISOString());
            expect(dataContext.courses[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
        });

        it('should trigger app event', function () {
            dataContext.courses = [mappedCourse];
            mappedCourse.objectives = objectives;

            handler(mappedCourse.id, objectivesOrder, modifiedOn.toISOString());
            expect(app.trigger).toHaveBeenCalled();
        });

    });

})