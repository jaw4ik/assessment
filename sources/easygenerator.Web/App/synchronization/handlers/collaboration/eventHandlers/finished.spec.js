import handler from './finished';

import dataContext from 'dataContext';
import userContext from 'userContext';
import app from 'durandal/app';
import constants from 'constants';
var userName = 'userName';

describe('synchronization collaboration [finished]', function () {

    var courseId = 'courseId',
        course = { id: courseId };

    beforeEach(function () {
        spyOn(app, 'trigger');
        userContext.identity = { email: userName };
    });

    it('should be function', function () {
        expect(handler).toBeFunction();
    });

    describe('when courseId is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(undefined);
            };

            expect(f).toThrow('CourseId is not a string');
        });
    });

    it('should delete course from data context', function () {
        dataContext.courses = [course];
        handler(courseId);
        expect(dataContext.courses.length).toBe(0);
    });

    it('should delete not used objectives created by another users', function() {
        var objective = { id: 'obj1', createdBy: userName },
            objective2 = { id: 'obj2', createdBy: 'userName2' },
            objective3 = { id: 'obj3', createdBy: 'userName2' },
            objective4 = { id: 'obj4', createdBy: userName };

        dataContext.objectives = [objective, objective2, objective3, objective4];

        var course = { objectives: [objective, objective2], id: courseId };
        var course2 = { objectives: [objective3], id: 'courseId2' };

        dataContext.courses = [course, course2];
        handler(courseId);
        expect(dataContext.objectives.length).toBe(3);
        expect(dataContext.objectives[0].id).toBe(objective.id);
        expect(dataContext.objectives[1].id).toBe(objective3.id);
        expect(dataContext.objectives[2].id).toBe(objective4.id);
    });

    it('should trigger app event', function () {
        handler(courseId);
        expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.collaboration.finished, courseId);
    });
});
