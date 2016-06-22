import handler from './collaboratorAccessTypeUpdated';

import dataContext from 'dataContext';
import app from 'durandal/app';
import constants from 'constants';

describe('synchronization collaboration [collaboratorAccessTypeUpdated]', function () {
    var courseId = 'id',
        collaboratorId = 'collaboratorId',
        collaborator,
        courses;

    beforeEach(function () {
        collaborator = { id: collaboratorId, isAdmin: false },
        courses = [
            { id: courseId, collaborators: [collaborator] }
        ];

        dataContext.courses = courses;
        spyOn(app, 'trigger');
    });

    describe('when courseId is not string', function () {

        it('should throw exception', function () {
            var f = function () {
                handler(undefined, collaboratorId, true);
            };
            expect(f).toThrow('courseId is not a string');
        });
    });

    describe('when collaboratorId is not string', function () {

        it('should throw exception', function () {
            var f = function () {
                handler(courseId, undefined, true);
            };
            expect(f).toThrow('collaboratorId is not a string');
        });
    });

    describe('when isAdmin is not bool', function () {

        it('should throw exception', function () {
            var f = function () {
                handler(courseId, collaboratorId, undefined);
            };
            expect(f).toThrow('isAdmin is not a bool');
        });
    });

    describe('when course is not found in data context', function () {
        beforeEach(function () {
            dataContext.courses = [];
        });

        it('should throw exception', function () {
            var f = function () {
                handler(courseId, collaboratorId, true);
            };
            expect(f).toThrow('Course is not an object');
        });
    });

    describe('when collaborator is not found by id', function () {
        beforeEach(function () {
            dataContext.courses[0].collaborators = [];
        });

        it('should throw exception', function () {
            var f = function () {
                handler(courseId, collaboratorId, true);
            };
            expect(f).toThrow('Collaborator is not an object');
        });
    });

    it('should set collaborator isAdmin to true', function () {
        courses[0].collaborators[0].isAdmin = false;
        handler(courseId, collaboratorId, true);
        expect(courses[0].collaborators[0].isAdmin).toBeTruthy();
    });

    it('should trigger app event', function () {
        handler(courseId, collaboratorId, true);
        expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.collaboration.collaboratorAccessTypeUpdated + collaboratorId, true);
    });
});
