define(['notifications/collaborationInvite/notificationController'],
    function (controller) {

        var userContext = require('userContext'),
            constants = require('constants'),
            app = require('durandal/app'),
            getInvites = require('notifications/collaborationInvite/queries/getInvites');

        describe('collaboration invite [notificationController]', function () {
            var getInvitesDefer,
                firstname = 'user';

            beforeEach(function () {
                userContext.identity = { firstname: firstname };
                userContext.identity.subscription = {};
                spyOn(app, 'on');
                spyOn(app, 'trigger');
                getInvitesDefer = Q.defer();
                spyOn(getInvites, 'execute').and.returnValue(getInvitesDefer.promise);
            });

            it('should be defined', function () {
                expect(controller).toBeDefined();
            });

            describe('execute:', function () {

                beforeEach(function () {
                    spyOn(controller, 'pushNotification');
                    spyOn(controller, 'removeNotification');
                });

                it('should be function', function () {
                    expect(controller.execute).toBeFunction();
                });

                describe('when userContext.identity is null', function () {

                    beforeEach(function () {
                        userContext.identity = null;
                    });

                    it('should return promise', function () {
                        expect(controller.execute()).toBePromise();
                    });

                    it('should not subscribe on course.collaboration.inviteCreated event', function (done) {
                        getInvitesDefer.resolve();
                        var promise = controller.execute();
                        promise.fin(function () {
                            expect(app.on).not.toHaveBeenCalledWith(constants.messages.course.collaboration.inviteCreated, controller.pushNotification);
                            done();
                        });
                    });

                    it('should not subscribe on course.collaboration.inviteRemoved event', function (done) {
                        getInvitesDefer.resolve();
                        var promise = controller.execute();
                        promise.fin(function () {
                            expect(app.on).not.toHaveBeenCalledWith(constants.messages.course.collaboration.inviteRemoved, controller.removeNotification);
                            done();
                        });
                    });

                    it('should not load invites', function (done) {
                        getInvitesDefer.resolve();
                        var promise = controller.execute();
                        promise.fin(function () {
                            expect(getInvites.execute).not.toHaveBeenCalled();
                            done();
                        });
                    });

                });

                describe('when userContext.identity is not null', function () {

                    it('should return promise', function () {
                        expect(controller.execute()).toBePromise();
                    });

                    it('should load invites', function (done) {
                        getInvitesDefer.resolve();
                        var promise = controller.execute();
                        promise.fin(function () {
                            expect(getInvites.execute).toHaveBeenCalled();
                            done();
                        });
                    });

                    it('should subscribe on course.collaboration.inviteCreated event', function (done) {
                        getInvitesDefer.resolve();
                        var promise = controller.execute();
                        promise.fin(function () {
                            expect(app.on).toHaveBeenCalledWith(constants.messages.course.collaboration.inviteCreated, controller.pushNotification);
                            done();
                        });
                    });

                    it('should subscribe on course.collaboration.inviteRemoved event', function (done) {
                        getInvitesDefer.resolve();
                        var promise = controller.execute();
                        promise.fin(function () {
                            expect(app.on).toHaveBeenCalledWith(constants.messages.course.collaboration.inviteRemoved, controller.removeNotification);
                            done();
                        });
                    });

                    describe('when invites loaded', function () {
                        var invites = [
                        {
                            Id: '0',
                            CourseId: '1',
                            CourseAuthorFirstName: 'Ann',
                            CourseAuthorLastName: 'Qqq',
                            CourseTitle: 'titile'
                        }];
                        beforeEach(function () {
                            getInvitesDefer.resolve(invites);
                        });

                        it('should push notification for each invite', function () {
                            var promise = controller.execute();
                            promise.fin(function () {
                                expect(controller.pushNotification).toHaveBeenCalledWith(invites[0]);
                                done();
                            });
                        });
                    });

                });

            });

            describe('pushNotification:', function () {
                var invite = {
                    Id: '0',
                    CourseId: '1',
                    CourseAuthorFirstName: 'Ann',
                    CourseAuthorLastName: 'Qqq',
                    CourseTitle: 'titile'
                };

                it('should push notification', function () {
                    controller.pushNotification(invite);

                    expect(app.trigger).toHaveBeenCalled();
                    expect(app.trigger.calls.mostRecent().args[0]).toBe(constants.notification.messages.push);
                    expect(app.trigger.calls.mostRecent().args[1].key).toBe(constants.notification.keys.collaborationInvite + invite.Id);
                    expect(app.trigger.calls.mostRecent().args[1].courseId).toBe(invite.CourseId);
                    expect(app.trigger.calls.mostRecent().args[1].firstname).toBe(firstname);
                    expect(app.trigger.calls.mostRecent().args[1].courseAuthorFirstname).toBe( invite.CourseAuthorFirstName);
                    expect(app.trigger.calls.mostRecent().args[1].courseAuthorLastname).toBe( invite.CourseAuthorLastName);
                    expect(app.trigger.calls.mostRecent().args[1].courseTitle).toBe( invite.CourseTitle);
                });
            });

            describe('removeNotification:', function () {
                var id = 'id';

                it('should remove notification', function () {
                    controller.removeNotification(id);

                    expect(app.trigger).toHaveBeenCalled();
                    expect(app.trigger.calls.mostRecent().args[0]).toBe(constants.notification.messages.remove);
                    expect(app.trigger.calls.mostRecent().args[1]).toBe(constants.notification.keys.collaborationInvite + id);
                });
            });
        });

    });