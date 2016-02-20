import notification from './notification';

import eventTracker from 'eventTracker';
import localizationManager from 'localization/localizationManager';
import constants from 'constants';

describe('subscriptionExpirationNotification:', function () {

    var subscriptionExpirationNotification = null,
        key = 'notificationKey',
        firstname = 'firstName',
        amountOfDays = 2,
        accessType = constants.accessType.plus,
        expirationDate = new Date();

    beforeEach(function () {
        spyOn(localizationManager, "localize").and.callFake(function (key) {
            switch (key) {
                case 'upgradeNotificationContent':
                    return '{0} {1}';
                case 'upgradeStarterPlan':
                    return 'starter';
                case 'upgradePlusPlan':
                    return 'plus';
                case 'upgradeNotificationToday':
                    return 'today';
                case 'upgradeNotificationIn1day':
                    return '1day';
                case 'upgradeNotificationInSeveralDays':
                    return '{0}days';
            }

            return '';
        });
        subscriptionExpirationNotification = new notification(key, firstname, amountOfDays, accessType, expirationDate);
    });

    describe('key:', function () {

        it('should be defined', function () {
            expect(subscriptionExpirationNotification.key).toBeDefined();
        });

        it('should be equal \'notificationName\'', function () {
            expect(subscriptionExpirationNotification.key).toBe(key);
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

        it('should be equal \'amountOfDays\'', function () {
            expect(subscriptionExpirationNotification.amountOfDays).toBe(amountOfDays);
        });

    });

    describe('expirationMessage:', function () {

        it('should be defined', function () {
            expect(subscriptionExpirationNotification.expirationMessage).toBeDefined();
        });

        var expirationNotification, type, days, expDate;

        describe('when accessType is starter', function () {
            beforeEach(function () {
                type = constants.accessType.starter;
            });

            describe('and amount of days is 0', function () {
                beforeEach(function () {
                    days = 0;
                });

                describe('and expiration date is today', function () {
                    beforeEach(function () {
                        expDate = new Date();
                    });

                    it('should be \'starter today\'', function () {
                        expirationNotification = new notification(key, firstname, days, type, expDate);
                        expect(expirationNotification.expirationMessage).toBe('starter today');
                    });
                });

                describe('and expiration date is not today', function () {
                    beforeEach(function () {
                        expDate = new Date();
                        expDate.setDate(expDate.getDate() + 1);
                    });

                    it('should be \'starter 1day\'', function () {
                        expirationNotification = new notification(key, firstname, days, type, expDate);
                        expect(expirationNotification.expirationMessage).toBe('starter 1day');
                    });
                });
            });

            describe('and amount of days is 1', function () {
                beforeEach(function () {
                    days = 1;
                    expDate = new Date();
                    expDate.setDate(expDate.getDate() + 1);
                });


                it('should be \'starter 1day\'', function () {
                    expirationNotification = new notification(key, firstname, days, type, expDate);
                    expect(expirationNotification.expirationMessage).toBe('starter 1day');
                });

            });

            describe('and amount of days is 2 (more than one)', function () {
                beforeEach(function () {
                    days = 2;
                    expDate = new Date();
                });

                it('should be \'starter 2days\'', function () {
                    expirationNotification = new notification(key, firstname, days, type, expDate);
                    expect(expirationNotification.expirationMessage).toBe('starter 2days');
                });
            });
        });

        describe('when accessType is plus', function () {

            beforeEach(function () {
                type = constants.accessType.plus;
            });

            describe('and amount of days is 0', function () {
                beforeEach(function () {
                    days = 0;
                });

                describe('and when expiration date is today', function () {
                    beforeEach(function () {
                        expDate = new Date();
                    });

                    it('should be \'plus today\'', function () {
                        expirationNotification = new notification(key, firstname, days, type, expDate);
                        expect(expirationNotification.expirationMessage).toBe('plus today');
                    });
                });

                describe('and when expiration date is not today', function () {
                    beforeEach(function () {
                        expDate = new Date();
                        expDate.setDate(expDate.getDate() + 1);
                    });

                    it('should be \'plus 1day\'', function () {
                        expirationNotification = new notification(key, firstname, days, type, expDate);
                        expect(expirationNotification.expirationMessage).toBe('plus 1day');
                    });
                });
            });

            describe('and amount of days is 1', function () {
                beforeEach(function () {
                    days = 1;
                    expDate = new Date();
                    expDate.setDate(expDate.getDate() + 1);
                });

                it('should be \'plus 1day\'', function () {
                    expirationNotification = new notification(key, firstname, days, type, expDate);
                    expect(expirationNotification.expirationMessage).toBe('plus 1day');
                });

            });

            describe('and amount of days is 2 (more than one)', function () {
                beforeEach(function () {
                    days = 2;
                    expDate = new Date();
                });

                it('should be \'plus 2days\'', function () {
                    expirationNotification = new notification(key, firstname, days, type, expDate);
                    expect(expirationNotification.expirationMessage).toBe('plus 2days');
                });
            });
        });

        describe('when accessType is undefined', function () {
            it('should throw exception \'Undefined access type\'', function () {
                var f = function () {
                    expirationNotification = new notification(key, firstname, amountOfDays, undefined, expirationDate);
                };

                expect(f).toThrow("Undefined access type");
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
