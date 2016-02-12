import handler from 'synchronization/handlers/comment/eventHandlers/created';

import app from 'durandal/app';
import constants from 'constants';
import dataContext from 'dataContext';
import commentMapper from 'mappers/commentModelMapper';

describe('synchronization comment [created]', () => {

    var courseId = 'courseId',
        course = { id: courseId },
        comment = { id: 'commentId' },
        commentData = { Id: 'Id' };

    beforeEach(() => {
        spyOn(app, 'trigger');
        spyOn(commentMapper, 'map').and.returnValue(comment);
    });

    describe('when courseId is not a string', () => {
        it('should throw an exception', () => {
            var f = () => {
                handler(undefined, commentData);
            };

            expect(f).toThrow('CourseId is not a string');
        });
    });

    describe('when commentData is not an object', () => {
        it('should throw an exception', () => {
            var f = () => {
                handler(courseId, undefined);
            };

            expect(f).toThrow('CommentData is not an object');
        });
    });

    describe('when course is not found in dataContext', () => {
        beforeEach(() => {
            dataContext.courses = [];
        });

        it('should throw an exception', () => {
            var f = () => {
                handler(courseId, commentData);
            };

            expect(f).toThrow('Course is not an object');
        });

    });

    describe('when course is found in dataContext', () => {
        beforeEach(() => {
            dataContext.courses = [course];
        });

        it('should add comment to course comments', function () {
            course.comments = [];
            handler(courseId, commentData);
            expect(course.comments[0]).toBe(comment);
        });

        it('should trigger app event', function () {
            handler(courseId, commentData);
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.comment.createdByCollaborator + courseId, comment);
        });
    });
});