﻿import Notification from './notification';

import acceptInviteCommand from './commands/acceptInvite';
import declineInviteCommand from './commands/declineInvite';
import constants from 'constants';
import app from 'durandal/app';

describe('organization invite [notification]:', () => {
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
    });

    describe('off:', () => {
        it('should unsubscribe from organization title updated event', () => {
            notification.off();
            expect(app.off).toHaveBeenCalledWith(constants.messages.organization.titleUpdated, jasmine.any(Function));
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

    describe('accept:', () => {
        it('should set isAccepting to true', () => {
            spyOn(acceptInviteCommand, 'execute');
            notification.isAccepting(false);

            notification.accept();

            expect(notification.isAccepting()).toBeTruthy();
        });

        describe('when invite accepted', () => {
            beforeEach(() => {
                spyOn(acceptInviteCommand, 'execute').and.returnValue(Promise.resolve());
            });

            it('should send app event', done => (async () => {
                await notification.accept();
                
                expect(app.trigger).toHaveBeenCalledWith(constants.notification.messages.remove, key);
                
            })().then(done));
        });

        describe('when failed to accept invite', () => {
            beforeEach(() => {
                spyOn(acceptInviteCommand, 'execute').and.returnValue(Promise.reject());
            });

            it('should set isAccepting to false', done => (async () => {
                notification.isAccepting(true);
                await notification.accept();
                
                expect(notification.isAccepting()).toBeFalsy();
                
            })().then(done));
        });
    });

    describe('decline:', () => {
        it('should set isDeclining to true', () => {
            spyOn(declineInviteCommand, 'execute');
            notification.isDeclining(false);

            notification.decline();

            expect(notification.isDeclining()).toBeTruthy();
        });

        describe('when invite declined', () => {
            beforeEach(() => {
                spyOn(declineInviteCommand, 'execute').and.returnValue(Promise.resolve());
            });

            it('should send app event', done => (async () => {
                await notification.decline();
                
                expect(app.trigger).toHaveBeenCalledWith(constants.notification.messages.remove, key);
                
            })().then(done));
        });

        describe('when failed to decline invite', () => {
            beforeEach(() => {
                spyOn(declineInviteCommand, 'execute').and.returnValue(Promise.reject());
            });

            it('should set isDeclining to false', done => (async () => {
                notification.isDeclining(true);
                await notification.decline();
                
                expect(notification.isDeclining()).toBeFalsy();
                
            })().then(done));
        });
    });

});
