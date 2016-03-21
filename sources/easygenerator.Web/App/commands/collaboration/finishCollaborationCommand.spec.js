import command from 'commands/collaboration/finishCollaborationCommand';

import _ from 'underscore';
import dataContext from 'dataContext';
import http from 'http/apiHttpWrapper';
import userContext from 'userContext';
import constants from 'constants';
import app from 'durandal/app';

describe('command [finishCollaboration:]', () => {
    var courseId = courseId,
        course = { id: courseId },
        useremail = 'email@mail.mail';

    beforeEach(() => {
        userContext.identity = { email: useremail };
        spyOn(app, 'trigger');
    });

    it('should post finish collaboration request', () => {
        spyOn(http, 'post');
        command.execute(courseId);
        expect(http.post).toHaveBeenCalledWith('api/course/collaboration/finish', { courseId: courseId, collaboratorEmail: useremail });
    });

    describe('when request succeeded', () => {
        beforeEach(() => {
            let promise = Promise.resolve(true);
            spyOn(http, 'post').and.returnValue(promise);
        });

        it('should delete course from data context', done => (async () => {
            dataContext.courses = [course];
            await command.execute(courseId);
            expect(dataContext.courses.length).toBe(0);
        })().then(done));

        it('should delete not used sections created by another users', done => (async () => {
            var section = { id: 'obj1', createdBy: useremail },
            section2 = { id: 'obj2', createdBy: 'userName2' },
            section3 = { id: 'obj3', createdBy: 'userName2' },
            section4 = { id: 'obj4', createdBy: useremail };

            dataContext.sections = [section, section2, section3, section4];

            var course = { sections: [section, section2], id: courseId };
            var course2 = { sections: [section3], id: 'courseId2' };
            dataContext.courses = [course, course2];

            await command.execute(courseId);
            
            expect(dataContext.sections.length).toBe(3);
            expect(dataContext.sections[0].id).toBe(section.id);
            expect(dataContext.sections[1].id).toBe(section3.id);
            expect(dataContext.sections[2].id).toBe(section4.id);
        })().then(done));

        it('should trigger app event', done => (async () => {
            await command.execute(courseId);
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.collaboration.finished, courseId);
        })().then(done));
    });

    describe('when request failed', () => {
        beforeEach(() => {
            let promise = Promise.reject();
            spyOn(http, 'post').and.returnValue(promise);
        });

        it('should reject promise', done => (async () => {
            await command.execute(courseId);
        })().catch(done));
    });
});