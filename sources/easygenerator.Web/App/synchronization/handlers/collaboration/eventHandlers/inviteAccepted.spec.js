import handler from './inviteAccepted';

import dataContext from 'dataContext';
import app from 'durandal/app';
import constants from 'constants';

describe('synchronization collaboration [inviteAccepted]', function () {
    var courseId = 'id',
        collaboratorEmail = 'mail@mail.com',
        collaborator,
        courses;

    beforeEach(function () {
        collaborator = { email: collaboratorEmail, isAccepted: false, id: 'id' },
        courses = [
            { id: courseId, collaborators: [collaborator] }
        ];

        dataContext.courses = courses;
        spyOn(app, 'trigger');
    });

    it('should be a function', function () {
        expect(handler).toBeFunction();
    });

    describe('when courseId is not string', function () {

        it('should throw exception', function () {
            var f = function () {
                handler(undefined, collaboratorEmail);
            };
            expect(f).toThrow('CourseId is not a string');
        });
    });

    describe('when collaborator email is not string', function () {

        it('should throw exception', function () {
            var f = function () {
                handler(courseId, undefined);
            };
            expect(f).toThrow('CollaboratorEmail is not a string');
        });
    });

    describe('when course is not found in data context', function () {
        beforeEach(function () {
            dataContext.courses = [];
        });

        it('should throw exception', function () {
            var f = function () {
                handler(courseId, collaboratorEmail);
            };
            expect(f).toThrow('Course is not an object');
        });
    });

    describe('when collaborator is not found by email', function () {
        beforeEach(function () {
            dataContext.courses[0].collaborators = [];
        });

        it('should throw exception', function () {
            var f = function () {
                handler(courseId, collaboratorEmail);
            };
            expect(f).toThrow('Collaborator is not an object');
        });
    });

    it('should set collaborator isAccepted to true', function () {
        courses[0].collaborators[0].isAccepted = false;
        handler(courseId, collaboratorEmail);
        expect(courses[0].collaborators[0].isAccepted).toBeTruthy();
    });

    it('should trigger app event', function () {
        courses[0].collaborators[0].isAccepted = false;
        handler(courseId, collaboratorEmail);
        expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.collaboration.inviteAccepted + collaborator.id);
    });
});
