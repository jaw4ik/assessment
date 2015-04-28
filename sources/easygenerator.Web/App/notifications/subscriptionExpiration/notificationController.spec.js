define(['notifications/subscriptionExpiration/notificationController'],
    function (controller) {

        var userContext = require('userContext'),
            constants = require('constants'),
            app = require('durandal/app');

        describe('subscription expiration [notificationController]', function () {

            beforeEach(function () {
                userContext.identity = {};
                userContext.identity.subscription = {};
                spyOn(app, 'on');
                spyOn(app, 'trigger');
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

                    it('should not subscribe on user.downgraded event', function (done) {
                        var promise = controller.execute();
                        promise.fin(function () {
                            expect(app.on).not.toHaveBeenCalledWith(constants.messages.user.downgraded, controller.updateNotification);
                            done();
                        });
                    });

                    it('should not subscribe on user.upgradedToPlus event', function (done) {
                        var promise = controller.execute();
                        promise.fin(function () {
                            expect(app.on).not.toHaveBeenCalledWith(constants.messages.user.upgradedToPlus, controller.updateNotification);
                            done();
                        });
                    });

                    it('should not subscribe on user.upgradedToStarter event', function (done) {
                        var promise = controller.execute();
                        promise.fin(function () {
                            expect(app.on).not.toHaveBeenCalledWith(constants.messages.user.upgradedToStarter, controller.updateNotification);
                            done();
                        });
                    });

                    it('should not call updateNotification', function (done) {
                        spyOn(controller, 'updateNotification');
                        var promise = controller.execute();
                        promise.fin(function () {
                            expect(controller.updateNotification).not.toHaveBeenCalled();
                            done();
                        });
                    });

                });

                describe('when userContext.identity is not null', function () {

                    it('should subscribe on user.downgraded event', function (done) {
                        var promise = controller.execute();
                        promise.fin(function () {
                            expect(app.on).toHaveBeenCalledWith(constants.messages.user.downgraded, controller.updateNotification);
                            done();
                        });
                    });

                    it('should subscribe on user.upgradedToPlus event', function (done) {
                        var promise = controller.execute();
                        promise.fin(function () {
                            expect(app.on).toHaveBeenCalledWith(constants.messages.user.upgradedToPlus, controller.updateNotification);
                            done();
                        });
                    });

                    it('should subscribe on user.upgradedToStarter event', function (done) {
                        var promise = controller.execute();
                        promise.fin(function () {
                            expect(app.on).toHaveBeenCalledWith(constants.messages.user.upgradedToStarter, controller.updateNotification);
                            done();
                        });
                    });

                    it('should call updateNotification', function (done) {
                        spyOn(controller, 'updateNotification');
                        var promise = controller.execute();
                        promise.fin(function () {
                            expect(controller.updateNotification).toHaveBeenCalled();
                            done();
                        });
                    });

                });

            });

            describe('updateNotification:', function () {
                var firstname = 'user';

                describe('when user access type is free', function () {

                    beforeEach(function () {
                        userContext.identity.subscription.accessType = constants.accessType.free;
                    });

                    it('should remove notification', function () {
                        controller.updateNotification();
                        expect(app.trigger).toHaveBeenCalledWith(constants.notification.messages.remove, constants.notification.keys.subscriptionExpiration);
                    });
                });

                describe('when user access is starter', function () {
                    beforeEach(function () {
                        userContext.identity.subscription.accessType = constants.accessType.starter;
                        userContext.identity.firstname = firstname;
                    });

                    describe('and when expiration date is undefined', function () {
                        beforeEach(function () {
                            userContext.identity.subscription.expirationDate = undefined;
                        });

                        it('should remove notification', function () {
                            it('should remove notification', function () {
                                controller.updateNotification();
                                expect(app.trigger).toHaveBeenCalledWith(constants.notification.messages.remove, constants.notification.keys.subscriptionExpiration);
                            });
                        });
                    });

                    describe('and when plan expiress more than in 7 days', function () {
                        beforeEach(function () {
                            var date = new Date();
                            date.setDate(date.getDate() + 10);
                            userContext.identity.subscription.expirationDate = date;
                        });

                        it('should remove notification', function () {
                            controller.updateNotification();
                            expect(app.trigger).toHaveBeenCalledWith(constants.notification.messages.remove, constants.notification.keys.subscriptionExpiration);
                        });
                    });

                    describe('and when plan expiress less than in 7 days', function () {
                        var date = new Date();
                        beforeEach(function () {
                            date.setDate(date.getDate() + 5);
                            userContext.identity.subscription.expirationDate = date;
                        });

                        it('should push notification', function () {
                            controller.updateNotification();
                            expect(app.trigger).toHaveBeenCalled();

                            expect(app.trigger.calls.mostRecent().args[0]).toBe(constants.notification.messages.push);
                            expect(app.trigger.calls.mostRecent().args[1].key).toBe(constants.notification.keys.subscriptionExpiration);
                            expect(app.trigger.calls.mostRecent().args[1].firstname).toBe(firstname);
                            expect(app.trigger.calls.mostRecent().args[1].amountOfDays).toBe(5);
                            expect(app.trigger.calls.mostRecent().args[1].expirationDate).toBe(constants.accessType.date);
                        });
                    });
                });
            });

        });

    });