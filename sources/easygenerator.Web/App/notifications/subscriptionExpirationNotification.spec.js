define(['notifications/subscriptionExpirationNotification'], function(notification) {

    var eventTracker = require('eventTracker'),
        constants = require('constants');

    describe('subscriptionExpirationNotification:', function () {

        var subscriptionExpirationNotification = null,
            name = 'notificationName',
            firstname = 'firstName',
            amountOfDays = 2,
            accessType = '2',
            expirationDate = new Date();

        beforeEach(function () {
            subscriptionExpirationNotification = new notification(name, firstname, amountOfDays, accessType, expirationDate);
        });

        describe('name:', function() {

            it('should be defined', function() {
                expect(subscriptionExpirationNotification.name).toBeDefined();
            });

            it('should be equal \'notificationName\'', function () {
                expect(subscriptionExpirationNotification.name).toBe(name);
            });

        });

        describe('firstname:', function () {
            
            it('should be defined', function () {
                expect(subscriptionExpirationNotification.firstname).toBeDefined();
            });

            it('should be equal \'firstName\'', function () {
                expect(subscriptionExpirationNotification.firstname).toBe(firstname);
            });

        });

        describe('amountOfDays:', function () {
            
            it('should be defined', function () {
                expect(subscriptionExpirationNotification.amountOfDays).toBeDefined();
            });

            it('should be equal \'firstName\'', function () {
                expect(subscriptionExpirationNotification.amountOfDays).toBe(amountOfDays);
            });

        });

        describe('planName:', function () {

            it('should be defined', function () {
                expect(subscriptionExpirationNotification.planName).toBeDefined();
            });

            describe('when access type is starter', function() {
                
                it('should be equal \'Starter Plan\'', function () {
                    subscriptionExpirationNotification = new notification(name, firstname, amountOfDays, '1', expirationDate);
                    expect(subscriptionExpirationNotification.planName).toBe('Starter Plan');
                });

            });

            describe('when access type is plus', function () {

                it('should be equal \'Plus Plan\'', function () {
                    subscriptionExpirationNotification = new notification(name, firstname, amountOfDays, accessType, expirationDate);
                    expect(subscriptionExpirationNotification.planName).toBe('Plus Plan');
                });

            });

        });

        describe('isToday:', function () {
            
            it('should be defined', function () {
                expect(subscriptionExpirationNotification.isToday).toBeDefined();
            });

            describe('when expiration day is today', function() {

                it('should be true', function() {
                    expect(subscriptionExpirationNotification.isToday).toBeTruthy();
                });

            });

            describe('when expiration day is not today', function () {

                it('should be false', function () {
                    var someDate = new Date();
                    someDate.setDate(someDate.getDate() + 5);
                    subscriptionExpirationNotification = new notification(name, firstname, amountOfDays, accessType, someDate);
                    expect(subscriptionExpirationNotification.isToday).toBeFalsy();
                });

            });

        });

        describe('openUpgradePlanUrl:', function () {

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
                spyOn(window, 'open');
            });

            it('should be function', function () {
                expect(subscriptionExpirationNotification.openUpgradePlanUrl).toBeFunction();
            });

            it('should send event \'Upgrade now\'', function () {
                subscriptionExpirationNotification.openUpgradePlanUrl();
                expect(eventTracker.publish).toHaveBeenCalledWith(constants.upgradeEvent, constants.upgradeCategory.expirationNotification);
            });

            it('should open upgrade link in new window', function () {
                subscriptionExpirationNotification.openUpgradePlanUrl();
                expect(window.open).toHaveBeenCalledWith(constants.upgradeUrl, '_blank');
            });

        });

    });

});