﻿import viewModel from './notification';

import subscriptionExpirationNotificationController from './subscriptionExpiration/notificationController';
import collaborationInviteNotificationController from './collaborationInvite/notificationController';
import organizationInviteNotificationController from './organizationInvite/notificationController';
import organizationInviteConfirmationNotificationController from './organizationInviteConfirmation/notificationController';
import app from 'durandal/app';
import constants from 'constants';
import _ from 'underscore';

let controllers = [
    subscriptionExpirationNotificationController,
    collaborationInviteNotificationController,
    organizationInviteNotificationController,
    organizationInviteConfirmationNotificationController
];

describe('[notifications]', function () {
    var key = 'key',
        notification = { id: 'id', key: key };

    beforeEach(function () {
        spyOn(app, 'on');
    });

    it('should be defined', function () {
        expect(viewModel).toBeDefined();
    });

    describe('collection:', function () {

        it('should be observable', function () {
            expect(viewModel.collection).toBeObservable();
        });
    });

    describe('activeNotification:', function () {

        it('should be observable', function () {
            expect(viewModel.activeNotification).toBeObservable();
        });
    });

    describe('moveDirection:', function () {

        it('should be observable', function () {
            expect(viewModel.moveDirection).toBeDefined();
        });
    });

    describe('isVisible:', function () {

        it('should be computed', function () {
            expect(viewModel.isVisible).toBeComputed();
        });

        describe('when notifications array does not have any item', function () {

            it('should be false', function () {
                viewModel.collection([]);
                expect(viewModel.isVisible()).toBeFalsy();
            });

        });

        describe('when notifications array have any item', function () {

            it('should be true', function () {
                viewModel.collection([{ name: 'name' }]);
                expect(viewModel.isVisible()).toBeTruthy();
            });

        });
    });

    describe('index:', function () {
        it('should be computed', function () {
            expect(viewModel.index).toBeComputed();
        });

        it('should return active notification index in collection', function () {
            viewModel.activeNotification(notification);
            viewModel.collection([{}, notification]);

            expect(viewModel.index()).toBe(1);
        });
    });

    describe('canMoveNext:', function () {
        beforeEach(function () {
            viewModel.activeNotification(notification);
        });

        it('should be computed', function () {
            expect(viewModel.canMoveNext).toBeComputed();
        });

        describe('when active notification is last in collection', function () {
            it('should be false', function () {
                viewModel.collection([notification]);
                expect(viewModel.canMoveNext()).toBeFalsy();
            });
        });

        describe('when active notification is not last in collection', function () {
            it('should be false', function () {
                viewModel.collection([notification, {}]);
                expect(viewModel.canMoveNext()).toBeTruthy();
            });
        });
    });

    describe('canMovePrev:', function () {
        beforeEach(function () {
            viewModel.activeNotification(notification);
        });

        it('should be computed', function () {
            expect(viewModel.canMovePrev).toBeComputed();
        });

        describe('when active notification is first in collection', function () {
            it('should be false', function () {
                viewModel.collection([notification, {}]);
                expect(viewModel.canMovePrev()).toBeFalsy();
            });
        });

        describe('when active notification is not first in collection', function () {

            it('should be false', function () {
                viewModel.collection([{}, notification]);
                expect(viewModel.canMovePrev()).toBeTruthy();
            });
        });
    });

    describe('next:', function () {
        beforeEach(function () {
            viewModel.activeNotification(notification);
        });

        describe('when active notification is last item in collection', function () {
            it('should not update active notification', function () {
                viewModel.collection([{}, notification]);
                viewModel.next();
                expect(viewModel.activeNotification()).toBe(notification);
            });
        });

        it('should set active notification to next element in collection', function () {
            var newNotification = { id: '1' };
            viewModel.collection([notification, newNotification]);
            viewModel.next();
            expect(viewModel.activeNotification()).toBe(newNotification);
        });

        it('should set moveDirection to next', function () {
            viewModel.collection([notification, {}]);
            viewModel.moveDirection = null;
            viewModel.next();
            expect(viewModel.moveDirection).toBe('next');
        });
    });

    describe('prev:', function () {
        beforeEach(function () {
            viewModel.activeNotification(notification);
        });

        describe('when active notification is first item in collection', function () {
            it('should not update active notification', function () {
                viewModel.collection([notification, {}]);
                viewModel.prev();
                expect(viewModel.activeNotification()).toBe(notification);
            });
        });

        it('should set active notification to prev element in collection', function () {
            var newNotification = { id: '1' };
            viewModel.collection([newNotification, notification]);
            viewModel.prev();
            expect(viewModel.activeNotification()).toBe(newNotification);
        });

        it('should set moveDirection to prev', function () {
            viewModel.collection([{}, notification]);
            viewModel.moveDirection = null;
            viewModel.prev();
            expect(viewModel.moveDirection).toBe('prev');
        });
    });

    describe('activate:', function () {
        it('should return promise', function () {
            expect(viewModel.activate()).toBePromise();
        });

        it('should subscribe on \'notification.remove\' event', function () {
            viewModel.activate();
            expect(app.on).toHaveBeenCalledWith(constants.notification.messages.remove, viewModel.removeNotification);
        });

        it('should subscribe on \'notification.push\' event', function () {
            viewModel.activate();
            expect(app.on).toHaveBeenCalledWith(constants.notification.messages.push, viewModel.pushNotification);
        });

        beforeEach(() => {
            _.each(controllers, controller => spyOn(controller, 'execute').and.returnValue(Promise.resolve()));
        });

        it('should call controller execute method', function () {
            viewModel.activate();
            _.each(controllers, controller => expect(controller.execute).toHaveBeenCalled());
        });

        describe('when all controllers are executed', function () {

            describe('when collection contains at least one notification', function () {
                beforeEach(function () {
                    viewModel.collection([notification]);
                });

                it('should set active notification to first element in collection', function (done) {
                    viewModel.activeNotification(null);
                    viewModel.activate().then(function () {
                        expect(viewModel.activeNotification()).toBe(notification);
                        done();
                    });
                });
            });

            describe('when collection is empty', function () {
                beforeEach(function () {
                    viewModel.collection([]);
                });

                it('should not set active notification', function (done) {
                    viewModel.activeNotification(null);
                    viewModel.activate().then(function () {
                        expect(viewModel.activeNotification()).toBeNull();
                        done();
                    });
                });
            });
        });
    });

    describe('isExpanded:', function () {
        it('should be observable', function () {
            expect(viewModel.isExpanded).toBeObservable();
        });
    });

    describe('toggleIsExpanded:', function () {
        describe('when isExpanded is true', function () {
            beforeEach(function () {
                viewModel.isExpanded(true);
            });

            it('should set isExpanded false', function () {
                viewModel.toggleIsExpanded();
                expect(viewModel.isExpanded()).toBeFalsy();
            });

            it('should set moveDirection to null', function () {
                viewModel.moveDirection = '';
                viewModel.toggleIsExpanded();
                expect(viewModel.moveDirection).toBeNull();
            });
        });

        describe('when isExpanded is false', function () {
            beforeEach(function () {
                viewModel.isExpanded(false);
            });

            it('should set isExpanded true', function () {
                viewModel.toggleIsExpanded();
                expect(viewModel.isExpanded()).toBeTruthy();
            });
        });
    });

    describe('collapse:', function () {
        it('should set isExpanded false', function () {
            viewModel.isExpanded(true);
            viewModel.collapse();
            expect(viewModel.isExpanded()).toBeFalsy();
        });

        it('should set moveDirection to null', function () {
            viewModel.moveDirection = '';
            viewModel.collapse();
            expect(viewModel.moveDirection).toBeNull();
        });
    });

    describe('pushNotification:', function () {
        describe('when notification with specified key is already in collection', function () {
            var key = 'key',
                oldNotification = { key: key, name: '1' },
                newNotification = { key: key, name: '2' };

            beforeEach(function () {
                viewModel.collection([oldNotification]);
            });

            describe('when notification on() is defined', function () {
                beforeEach(function () {
                    newNotification.on = function () { };
                    spyOn(newNotification, 'on');
                });

                it('should call notification on() for new added notification', function () {
                    viewModel.pushNotification(newNotification);
                    expect(newNotification.on).toHaveBeenCalled();
                });
            });

            describe('when existing notification off() is defined', function () {
                beforeEach(function () {
                    oldNotification.off = function () { };
                    spyOn(oldNotification, 'off');
                });

                it('should call existing notification off() method', function () {
                    viewModel.pushNotification(newNotification);
                    expect(oldNotification.off).toHaveBeenCalled();
                });
            });

            it('should replace notification', function () {
                viewModel.pushNotification(newNotification);
                expect(viewModel.collection()[0]).toBe(newNotification);
                expect(viewModel.collection().length).toBe(1);
            });

            describe('when notification with specified key is active notification', function () {
                it('should update active notification', function () {
                    viewModel.activeNotification(oldNotification);
                    viewModel.pushNotification(newNotification);
                    expect(viewModel.activeNotification()).toBe(newNotification);
                });
            });

            describe('when notification with specified key is not an active notification', function () {
                it('should not update active notification', function () {
                    viewModel.activeNotification(null);
                    viewModel.pushNotification(newNotification);
                    expect(viewModel.activeNotification()).toBe(null);
                });
            });
        });

        describe('when notification with specified key is not in collection', function () {
            var key = 'key',
                newNotification = { key: key };

            beforeEach(function () {
                viewModel.collection([]);
            });

            describe('when notification on() is defined', function () {
                beforeEach(function () {
                    newNotification.on = function () { };
                    spyOn(newNotification, 'on');
                });

                it('should call notification on() for new added notification', function () {
                    viewModel.pushNotification(newNotification);
                    expect(newNotification.on).toHaveBeenCalled();
                });
            });

            it('should push notification', function () {

                viewModel.pushNotification(newNotification);
                expect(viewModel.collection()[0]).toBe(newNotification);
                expect(viewModel.collection().length).toBe(1);
            });

            describe('when notification is a single item in collection', function () {
                it('should set active notification', function () {
                    viewModel.activeNotification(null);
                    viewModel.pushNotification(newNotification);
                    expect(viewModel.activeNotification()).toBe(newNotification);
                });
            });

            describe('when notification is not a single item in collection', function () {
                it('should not update active notification', function () {
                    viewModel.activeNotification(null);
                    viewModel.collection.push({});
                    viewModel.pushNotification(newNotification);
                    expect(viewModel.activeNotification()).toBe(null);
                });
            });
        });

        describe('when is not expanded', function () {
            var newNotification = { key: key };

            beforeEach(function () {
                viewModel.isExpanded(false);
            });

            it('should expand', function () {
                viewModel.collection([{}]);
                viewModel.pushNotification(newNotification);
                expect(viewModel.isExpanded()).toBeTruthy();
            });

            it('should update active notification', function () {
                viewModel.activeNotification(null);
                viewModel.collection([]);
                viewModel.pushNotification(newNotification);
                expect(viewModel.activeNotification()).toBe(newNotification);
            });
        });
    });

    describe('removeNotification:', function () {

        describe('when notification with such key is in collection', function () {
            var existingNotification = {};
            beforeEach(function () {
                viewModel.collection([notification]);
            });



            describe('and when active notification has specified key', function () {
                beforeEach(function () {
                    viewModel.activeNotification(notification);
                });

                describe('and when notification is last in collection', function () {
                    beforeEach(function () {
                        viewModel.collection([existingNotification, notification]);
                    });

                    it('should set active notification to prev item in collection', function () {
                        viewModel.removeNotification(key);
                        expect(viewModel.activeNotification()).toBe(existingNotification);
                    });
                });

                describe('and when notification is not last in collection', function () {
                    beforeEach(function () {
                        viewModel.collection([notification, existingNotification]);
                    });

                    it('should set active notification to next item in collection', function () {
                        viewModel.removeNotification(key);
                        expect(viewModel.activeNotification()).toBe(existingNotification);
                    });
                });

                describe('and when notification is a single item in collection', function () {
                    it('should set isExpanded to false', function () {
                        viewModel.collection([notification]);
                        viewModel.isExpanded(true);

                        viewModel.removeNotification(key);
                        expect(viewModel.isExpanded()).toBeFalsy();
                    });

                    it('should set active notification to null', function () {
                        viewModel.collection([notification]);
                        viewModel.activeNotification({});

                        viewModel.removeNotification(key);
                        expect(viewModel.activeNotification()).toBeNull();
                    });
                });

            });

            describe('and when active notification does not have specified key', function () {
                beforeEach(function () {
                    viewModel.activeNotification({ key: 'diffKey' });
                });

                describe('and when notification is a single item in collection', function () {

                    it('should set isExpanded to false', function () {
                        viewModel.collection([notification]);
                        viewModel.isExpanded(true);

                        viewModel.removeNotification(key);
                        expect(viewModel.isExpanded()).toBeFalsy();
                    });

                    it('should set active notification to null', function () {
                        viewModel.collection([notification]);
                        viewModel.activeNotification({});

                        viewModel.removeNotification(key);
                        expect(viewModel.activeNotification()).toBeNull();
                    });

                    it('should set moveDirection to null', function () {
                        viewModel.collection([notification]);
                        viewModel.moveDirection = '';
                        viewModel.removeNotification(key);
                        expect(viewModel.moveDirection).toBeNull();
                    });
                });
            });


            it('should remove notification', function () {
                viewModel.removeNotification(key);
                expect(viewModel.collection().length).toBe(0);
            });

            describe('when notification off method is defined', function () {
                beforeEach(function () {
                    notification.off = function () { };
                    spyOn(notification, 'off');
                });

                it('should call notification off()', function () {
                    viewModel.removeNotification(key);
                    expect(notification.off).toHaveBeenCalled();
                });
            });
        });
    });

});
