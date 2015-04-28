define(['notifications/collaborationInvite/notificationController'],
    function (controller) {

        var userContext = require('userContext'),
            constants = require('constants'),
            app = require('durandal/app'),
            getInvites = require('notifications/collaborationInvite/queries/getInvites');

        describe('collaboration invite [notificationController]', function () {
            var getInvitesDefer;

            beforeEach(function () {
                userContext.identity = {};
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

                    describe('when invites loaded', function () {
                        var invites = [
                        {
                            Id: '0',
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
                                expect(app.trigger).toHaveBeenCalled();
                                expect(app.trigger.calls.mostRecent().args[0]).toBe(constants.notification.messages.push);
                                expect(app.trigger.calls.mostRecent().args[1].key).toBe(constants.notification.keys.collaborationInvite + invites[0].id);
                                done();
                            });
                        });
                    });

                });

            });
        });

    });