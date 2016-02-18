import handler from './objectivesReplaced';

import dataContext from 'dataContext';
import app from 'durandal/app';
import constants from 'constants';
import objectiveModelMapper from 'mappers/objectiveModelMapper';

describe('synchronization course [objectivesReplaced]', function () {

    var courseId = 'courseId';
    var clonedObjectives;
    var modifiedOn = new Date();
    var course = {
        id: courseId,
        modifiedOn: ''
    };


    beforeEach(function () {
        spyOn(app, 'trigger');
        clonedObjectives = {
            'objectiveId1': {},
            'objectiveId2': {},
            'objectiveId3': {}
        };
        courseId = 'courseId';
    });

    it('should be function', function () {
        expect(handler).toBeFunction();
    });

    describe('when course id is undefined', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(undefined, clonedObjectives, modifiedOn.toISOString());
            };

            expect(f).toThrow('CourseId is not a string');
        });
    });

    describe('when course id is null', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(null, clonedObjectives, modifiedOn.toISOString());
            };

            expect(f).toThrow('CourseId is not a string');
        });
    });

    describe('when course id is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler({}, clonedObjectives, modifiedOn.toISOString());
            };

            expect(f).toThrow('CourseId is not a string');
        });
    });

    describe('when replacedObjectivesInfo is undefined', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(courseId, undefined, modifiedOn.toISOString());
            };

            expect(f).toThrow('ReplacedObjectivesInfo is not an object');
        });
    });

    describe('when replacedObjectivesInfo is null', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(courseId, null, modifiedOn.toISOString());
            };

            expect(f).toThrow('ReplacedObjectivesInfo is not an object');
        });
    });

    describe('when replacedObjectivesInfo is not an object', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(courseId, '', modifiedOn.toISOString());
            };

            expect(f).toThrow('ReplacedObjectivesInfo is not an object');
        });
    });

    describe('when modifiedOn is undefined', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(courseId, clonedObjectives, undefined);
            };

            expect(f).toThrow('ModifiedOn is not a string');
        });
    });

    describe('when modifiedOn is null', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(courseId, clonedObjectives, null);
            };

            expect(f).toThrow('ModifiedOn is not a string');
        });
    });

    describe('when modifiedOn is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(courseId, clonedObjectives, {});
            };

            expect(f).toThrow('ModifiedOn is not a string');
        });
    });

    describe('when course with specified id does not found', function() {
        beforeEach(function() {
            dataContext.courses = [];
        });

        it('should throw an exception', function () {
            var f = function () {
                handler(courseId, clonedObjectives, modifiedOn.toISOString());
            };

            expect(f).toThrow('Course has not been found');
        });
    });

    describe('when course with specified id exists', function() {
        beforeEach(function () {
                
            dataContext.courses = [course];
            course.objectives = [
                {
                    id: 'objectiveId10'
                },
                {
                    id: 'objectiveId1'
                }
            ];
        });

        it('should update course modified on date', function () {
            handler(courseId, clonedObjectives, modifiedOn.toISOString());
            expect(dataContext.courses[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
        });

        it('should trigger app event about new cloned objectives', function () {
            spyOn(objectiveModelMapper, "map").and.returnValue('mapedObjective');
            handler(courseId, clonedObjectives, modifiedOn.toISOString());

            expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.objectiveRelatedByCollaborator, courseId, 'mapedObjective', 1);
        });

        it('should trigger app event about old objectives that were removed', function () {
            spyOn(objectiveModelMapper, "map").and.returnValue('mapedObjective');
            handler(courseId, clonedObjectives, modifiedOn.toISOString());

            expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.objectiveRelatedByCollaborator, courseId, 'mapedObjective', 1);

            app.trigger(constants.messages.course.objectivesUnrelatedByCollaborator, courseId, ['objectiveId1', 'objectiveId2', 'objectiveId3']);
        });
    });
});
