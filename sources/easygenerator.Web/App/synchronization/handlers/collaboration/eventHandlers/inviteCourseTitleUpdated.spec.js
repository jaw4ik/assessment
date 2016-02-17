import handler from './inviteCourseTitleUpdated';

import app from 'durandal/app';
import constants from 'constants';

describe('synchronization collaboration [inviteCourseTitleUpdated]', function () {
    var courseId = 'courseId',
        title = 'title';

    beforeEach(function () {
        spyOn(app, 'trigger');
    });


    it('should be function', function () {
        expect(handler).toBeFunction();
    });

    describe('when courseId is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(undefined, title);
            };

            expect(f).toThrow('CourseId is not a string');
        });
    });

    describe('when title is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(courseId, undefined);
            };

            expect(f).toThrow('Title is not a string');
        });
    });

    it('should trigger app event', function () {
        handler(courseId, title);
        expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.collaboration.inviteCourseTitleUpdated + courseId, title);
    });
});
