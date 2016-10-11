﻿import Notification from './notification';

import constants from 'constants';
import app from 'durandal/app';

describe('organization invite confirmation [notification]:', () => {
    let notification,
        id = 'id',
        organizationId = 'organizationId',
        key = 'key',
        userFirstname = 'user',
        organizationAdminFirstname = 'admin',
        organizationAdminLastname = 'surname',
        organizationTitle = 'organization';

    beforeEach(() => {
        notification = new Notification(key, id, organizationId, userFirstname, organizationAdminFirstname, organizationAdminLastname, organizationTitle);
        spyOn(app, 'trigger');
        spyOn(app, 'on');
        spyOn(app, 'off');
    });

    describe('on:', () => {

        it('should subscribe on organization title updated event', () => {
            notification.on();
            expect(app.on).toHaveBeenCalledWith(constants.messages.organization.titleUpdated, jasmine.any(Function));
        });

        it('should subscribe on membership started updated event', () => {
            notification.on();
            expect(app.on).toHaveBeenCalledWith(constants.messages.organization.membershipStarted, jasmine.any(Function));
        });

    });

    describe('off:', () => {
        
        it('should unsubscribe from organization title updated event', () => {
            notification.off();
            expect(app.off).toHaveBeenCalledWith(constants.messages.organization.titleUpdated, jasmine.any(Function));
        });

        it('should unsubscribe from membership started updated event', () => {
            notification.off();
            expect(app.off).toHaveBeenCalledWith(constants.messages.organization.membershipStarted, jasmine.any(Function));
        });

    });

    describe('key:', () => {
        it('should be set', () => {
            expect(notification.key).toBe(key);
        });
    });

    describe('userFirstname:', () => {
        it('should be set', () => {
            expect(notification.userFirstname).toBe(userFirstname);
        });
    });

    describe('organizationAdminFirstname:', () => {
        it('should be set', () => {
            expect(notification.organizationAdminFirstname).toBe(organizationAdminFirstname);
        });
    });

    describe('organizationAdminLastname:', () => {
        it('should be set', () => {
            expect(notification.organizationAdminLastname).toBe(organizationAdminLastname);
        });
    });

    describe('userAvatarLetter:', () => {
        it('should be set', () => {
            expect(notification.userAvatarLetter).toBe(userFirstname.charAt(0));
        });
    });

    describe('organizationTitle:', () => {
        it('should be observable', () => {
            expect(notification.organizationTitle).toBeObservable();
        });

        it('should be set', () => {
            expect(notification.organizationTitle()).toBe(organizationTitle);
        });
    });

    describe('organizationTitleUpdated:', () => {
        beforeEach(() => {
            notification.organizationTitle('');
        });

        describe('when organizationId is current organizationId', () => {
            it('should update title', () => {
                var value = 'new title';
                notification.organizationTitleUpdated(organizationId, value);
                expect(notification.organizationTitle()).toBe(value);
            });
        });

        describe('when organizationId is not current organizationId', () => {
            it('should not update title', () => {
                var value = 'new title',
                    title = 'title';

                notification.organizationTitle(title);

                notification.organizationTitleUpdated('someId', value);
                expect(notification.organizationTitle()).toBe(title);
            });
        });
    });

    describe('organizationMembershipStarted:', () => {

        describe('when organizationId is current organizationId', () => {
            it('should trigger event ' + constants.notification.messages.remove, () => {
                notification.organizationMembershipStarted({ id: organizationId });
                expect(app.trigger).toHaveBeenCalledWith(constants.notification.messages.remove, notification.key);
            });
        });

        describe('when organizationId is not current organizationId', () => {
            it('should not trigger events', () => {
                notification.organizationMembershipStarted({ id: 'someId' });
                expect(app.trigger).not.toHaveBeenCalled();
            });
        });
    });

});
