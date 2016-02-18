import handler from './objectivesUnrelated';

import dataContext from 'dataContext';
import app from 'durandal/app';
import userContext from 'userContext';

describe('synchronization course [objectivesUnrelated]', function () {

    var course = { Id: 'courseId' },
        mappedCourse = { id: course.Id, collaborators: [] };

    beforeEach(function () {
        spyOn(app, 'trigger');
    });

    var modifiedOn = new Date(),
        objectiveId = 'obj1',
        courseId = mappedCourse.id,
        objective = { id: objectiveId, createdBy: 'user' };

    it('should be function', function () {
        expect(handler).toBeFunction();
    });

    describe('when courseId is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(undefined, [objectiveId], modifiedOn.toISOString());
            };

            expect(f).toThrow('CourseId is not a string');
        });
    });

    describe('when objectiveId is not an array', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(courseId, undefined, modifiedOn.toISOString());
            };

            expect(f).toThrow('ObjectiveIds is not an array');
        });
    });

    describe('when modifiedOn is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(courseId, [objectiveId], undefined);
            };

            expect(f).toThrow('ModifiedOn is not a string');
        });
    });

    describe('when course is not found in data context', function () {
        it('should throw an exception', function () {
            dataContext.courses = [];

            var f = function () {
                handler(courseId, [objectiveId], modifiedOn.toISOString());
            };

            expect(f).toThrow('Course has not been found');
        });
    });

    it('should unrelate objectives from course', function () {
        dataContext.courses = [mappedCourse];
        mappedCourse.objectives = [objective];

        handler(courseId, [objectiveId], modifiedOn.toISOString());

        expect(dataContext.courses[0].objectives.length).toBe(0);
    });

    describe('when objectives unrelated from collaborator', function() {
            
        it('should unrelate objectives from dataContext.objectives', function () {
            dataContext.objectives = [objective];
            userContext.identity = { email: 'anotheruser' };

            handler(courseId, [objectiveId], modifiedOn.toISOString());

            expect(dataContext.objectives.length).toBe(0);
        });

    });

    it('should update course modified on date', function () {
        mappedCourse.modifiedOn = "";
        dataContext.courses = [mappedCourse];
        dataContext.objectives = [objective];
        mappedCourse.objectives = [objective];

        handler(courseId, [objectiveId], modifiedOn.toISOString());
        expect(dataContext.courses[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
    });

    it('should trigger app event', function () {
        dataContext.courses = [mappedCourse];
        dataContext.objectives = [objective];
        mappedCourse.objectives = [objective];

        handler(courseId, [objectiveId], modifiedOn.toISOString());
        expect(app.trigger).toHaveBeenCalled();
    });

});
