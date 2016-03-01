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

    it('should delete not used sections created by another users', function() {
        var section = { id: 'obj1', createdBy: userName },
            section2 = { id: 'obj2', createdBy: 'userName2' },
            section3 = { id: 'obj3', createdBy: 'userName2' },
            section4 = { id: 'obj4', createdBy: userName };

        dataContext.sections = [section, section2, section3, section4];

        var course = { sections: [section, section2], id: courseId };
        var course2 = { sections: [section3], id: 'courseId2' };

        dataContext.courses = [course, course2];
        handler(courseId);
        expect(dataContext.sections.length).toBe(3);
        expect(dataContext.sections[0].id).toBe(section.id);
        expect(dataContext.sections[1].id).toBe(section3.id);
        expect(dataContext.sections[2].id).toBe(section4.id);
    });

    it('should trigger app event', function () {
        handler(courseId);
        expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.collaboration.finished, courseId);
    });
});
