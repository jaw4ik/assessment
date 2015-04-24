define(['notifications/subscriptionExpiration/notificationController', 'notifications/notification'],
    function(controller, notifications) {

        var userContext = require('userContext'),
            constants = require('constants');

        describe('subscription expiration [NotificationController]', function () {

            var notificationName;

            beforeEach(function () {
                notificationName = 'expiriationNotification';
                userContext.identity = {};
                userContext.identity.subscription = {};
            });

            it('should be defined', function() {
                expect(controller).toBeDefined();
            });

            describe('execute:', function() {

                it('should be function', function() {
                    expect(controller.execute).toBeFunction();
                });

                describe('when userContext.identity is null', function() {

                    beforeEach(function() {
                        userContext.identity = null;
                    });

                    it('should return undefined', function() {
                        expect(controller.execute()).toBeUndefined();
                    });

                });

                describe('when userContext.identity is not null', function () {

                    describe('when user access type is free', function() {

                        beforeEach(function () {
                            userContext.identity.subscription.accessType = constants.accessType.free;
                        });

                        it('should return undefined', function() {
                            expect(controller.execute()).toBeUndefined();
                        });

                        describe('when notification exists', function () {

                            beforeEach(function () {
                                notifications.collection([]);
                                notifications.collection.push({
                                    name: notificationName,
                                    expirationDate: 5,
                                    firstname: 'user'
                                });
                            });

                            it('should remove notification', function () {
                                controller.execute();
                                expect(notifications.collection().length).toBe(0);
                            });

                        });

                    });

                    describe('when user access type is starter (not free)', function () {
                        beforeEach(function () {
                            userContext.identity.subscription.accessType = constants.accessType.starter;
                        });

                        describe('when expiration date is null', function () {

                            beforeEach(function () {
                                userContext.identity.subscription.expirationDate = null;
                            });

                            it('should be undefined', function() {
                                expect(controller.execute()).toBeUndefined();
                            });

                            describe('when notification exists', function () {

                                beforeEach(function () {
                                    notifications.collection([]);
                                    notifications.collection.push({
                                        name: notificationName,
                                        expirationDate: 5,
                                        firstname: 'user'
                                    });
                                });

                                it('should remove notification', function () {
                                    controller.execute();
                                    expect(notifications.collection().length).toBe(0);
                                });

                            });

                        });

                        describe('when expiration date is undefined', function () {

                            beforeEach(function () {
                                userContext.identity.subscription.expirationDate = undefined;
                            });

                            it('should be undefined', function () {
                                expect(controller.execute()).toBeUndefined();
                            });

                            describe('when notification exists', function () {

                                beforeEach(function () {
                                    notifications.collection([]);
                                    notifications.collection.push({
                                        name: notificationName,
                                        expirationDate: 5,
                                        firstname: 'user'
                                    });
                                });

                                it('should remove notification', function () {
                                    controller.execute();
                                    expect(notifications.collection().length).toBe(0);
                                });

                            });

                        });

                        describe('when expiration date more than 7', function () {

                            beforeEach(function () {
                                var date = new Date();
                                date.setDate(date.getDate() + 10);
                                userContext.identity.subscription.expirationDate = date;
                            });

                            it('should be undefined', function () {
                                expect(controller.execute()).toBeUndefined();
                            });

                            describe('when notification exists', function () {

                                beforeEach(function () {
                                    notifications.collection([]);
                                    notifications.collection.push({
                                        name: notificationName,
                                        expirationDate: 5,
                                        firstname: 'user'
                                    });
                                });

                                it('should remove notification', function () {
                                    controller.execute();
                                    expect(notifications.collection().length).toBe(0);
                                });

                            });

                        });

                        describe('when expiration date is correct', function () {

                            beforeEach(function () {
                                var date = new Date();
                                date.setDate(date.getDate() + 5);
                                userContext.identity.subscription.expirationDate = date;
                                userContext.identity.firstname = 'user';
                            });

                            describe('when notifications context already has notification', function() {

                                describe('and when expiration date of this notification equal current expiration date', function() {

                                    beforeEach(function() {
                                        notifications.collection.push({
                                            name: notificationName,
                                            expirationDate: 5
                                        });
                                    });

                                    it('should return undefined', function() {
                                        expect(controller.execute()).toBeUndefined();
                                    });

                                });

                            });

                            describe('when notifications context already has notification', function() {

                                describe('and when expiration date of this notification not equal current expiration date', function () {

                                    beforeEach(function () {
                                        notifications.collection([]);
                                        notifications.collection.push({
                                            name: notificationName,
                                            expirationDate: 5,
                                            firstname: 'user'
                                        });
                                    });

                                    it('should remove this notification and add new notification', function () {
                                        var date = new Date();
                                        date.setDate(date.getDate() + 2);
                                        userContext.identity.subscription.expirationDate = date;
                                        controller.execute();
                                        expect(notifications.collection()[0].amountOfDays).toBe(2);
                                    });

                                });
                                
                            });

                        });

                    });

                });

            });

        });

    });