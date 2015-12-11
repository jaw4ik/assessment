define(['synchronization/handlers/comment/eventHandlers/deleted'], function (handler) {
    "use strict";

    var app = require('durandal/app'),
        constants = require('constants');

    describe('synchronization comment [deleted]', function () {

        var courseId = 'courseId',
            commentId = 'commentId';

        beforeEach(function () {
            spyOn(app, 'trigger');
        });

        it('should trigger app event \'course:comment:deletedByCollaborator\'', function () {
            handler(courseId, commentId);
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.comment.deletedByCollaborator, courseId, commentId);
        });

        describe('when courseId is not a string', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(undefined, commentId);
                };

                expect(f).toThrow('CourseId is not a string');
            });
        });

        describe('when commentId is not a string', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(courseId, undefined);
                };

                expect(f).toThrow('CommentId is not a string');
            });
        });
    });
})