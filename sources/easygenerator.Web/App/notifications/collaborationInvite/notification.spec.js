import Notification from './notification';

import acceptInvite from './commands/acceptInvite';
import declineInvite from './commands/declineInvite';
import constants from 'constants';
import app from 'durandal/app';

describe('collaboration invite [notification]:', function () {
    var notification,
        id = 'id',
        courseId = 'courseId',
        key = 'key',
        firstname = 'user',
        coauthorFirstname = 'coautor',
        coauthorLastname = 'surname',
        courseTitle = 'course';

    beforeEach(function () {
        notification = new Notification(key, id, courseId, firstname, coauthorFirstname, coauthorLastname, courseTitle);
        spyOn(app, 'trigger');
        spyOn(app, 'on');
        spyOn(app, 'off');
    });

    describe('on:', function() {
        it('should subscribe on event \'course.collaboration.inviteCourseTitleUpdated\'', function () {
            notification.on();
            expect(app.on).toHaveBeenCalledWith(constants.messages.course.collaboration.inviteCourseTitleUpdated + courseId, notification.courseTitleUpdated);
        });
    });

    describe('off:', function() {
        it('should unsubscribe on event \'course.collaboration.inviteCourseTitleUpdated\'', function () {
            notification.off();
            expect(app.off).toHaveBeenCalledWith(constants.messages.course.collaboration.inviteCourseTitleUpdated + courseId, notification.courseTitleUpdated);
        });
    });

    describe('key:', function () {
        it('should be set', function () {
            expect(notification.key).toBe(key);
        });
    });

    describe('firstname:', function () {
        it('should be set', function () {
            expect(notification.firstname).toBe(firstname);
        });
    });

    describe('courseAuthorFirstname:', function () {
        it('should be set', function () {
            expect(notification.courseAuthorFirstname).toBe(coauthorFirstname);
        });
    });

    describe('courseAuthorLastname:', function () {
        it('should be set', function () {
            expect(notification.courseAuthorLastname).toBe(coauthorLastname);
        });
    });

    describe('coauthorAvatarLetter:', function () {
        it('should be set', function () {
            expect(notification.coauthorAvatarLetter).toBe(coauthorFirstname.charAt(0));
        });
    });

    describe('courseTitle:', function () {
        it('should be observable', function () {
            expect(notification.courseTitle).toBeObservable();
        });

        it('should be set', function () {
            expect(notification.courseTitle()).toBe(courseTitle);
        });
    });

    describe('courseTitleUpdated:', function () {
        beforeEach(function() {
            notification.courseTitle('');
        });

        it('should update courseTitle', function () {
            var value = 'new title';
            notification.courseTitleUpdated(value);
            expect(notification.courseTitle()).toBe(value);
        });
    });

    describe('accept:', function () {
        var acceptInviteDefer;

        beforeEach(function () {
            acceptInviteDefer = Q.defer();
            spyOn(acceptInvite, 'execute').and.returnValue(acceptInviteDefer.promise);
        });

        it('should be function', function () {
            expect(notification.accept).toBeFunction();
        });

        it('should accept invite', function (done) {
            acceptInviteDefer.resolve();
            var promise = notification.accept();
            promise.fin(function () {
                expect(acceptInvite.execute).toHaveBeenCalledWith(courseId, id);
                done();
            });
        });

        describe('when invite accepted:', function () {
            beforeEach(function () {
                acceptInviteDefer.resolve();
            });

            it('should raise remove notification event', function (done) {
                acceptInviteDefer.resolve();
                var promise = notification.accept();
                promise.fin(function () {
                    expect(app.trigger).toHaveBeenCalled();

                    expect(app.trigger.calls.mostRecent().args[0]).toBe(constants.notification.messages.remove);
                    expect(app.trigger.calls.mostRecent().args[1]).toBe(key);
                    done();
                });
            });
        });

    });

    describe('decline:', function () {
        var declineInviteDefer;

        beforeEach(function () {
            declineInviteDefer = Q.defer();
            spyOn(declineInvite, 'execute').and.returnValue(declineInviteDefer.promise);
        });

        it('should be function', function () {
            expect(notification.decline).toBeFunction();
        });

        it('should decline invite', function (done) {
            declineInviteDefer.resolve();
            var promise = notification.decline();
            promise.fin(function () {
                expect(declineInvite.execute).toHaveBeenCalledWith(courseId, id);
                done();
            });
        });

        describe('when invite declined:', function () {
            beforeEach(function () {
                declineInviteDefer.resolve();
            });

            it('should raise remove notification event', function (done) {
                declineInviteDefer.resolve();
                var promise = notification.decline();
                promise.fin(function () {
                    expect(app.trigger).toHaveBeenCalled();

                    expect(app.trigger.calls.mostRecent().args[0]).toBe(constants.notification.messages.remove);
                    expect(app.trigger.calls.mostRecent().args[1]).toBe(key);
                    done();
                });
            });
        });
    });

});
