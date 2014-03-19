﻿define(['user/subscriptionExpirationNotificationTask'],
    function(task) {

        var shellViewModel = require('viewmodels/shell'),
            userContext = require('userContext'),
            constants = require('constants');

        describe('task [subscriptionExpirationNotificationTask]', function () {

            var notificationName;

            beforeEach(function () {
                notificationName = 'expiriationNotification';
                userContext.identity = {};  
            });

            it('should be defined', function() {
                expect(task).toBeDefined();
            });

            describe('execute:', function() {

                it('should be function', function() {
                    expect(task.execute).toBeFunction();
                });

                describe('when userContext.identity is null', function() {

                    beforeEach(function() {
                        userContext.identity = null;
                    });

                    it('should return undefined', function() {
                        expect(task.execute()).toBeUndefined();
                    });

                });

                describe('when userContext.identity is not null', function () {

                    describe('when user access type is free', function() {

                        beforeEach(function () {
                            userContext.identity.accessType = constants.accessType.free;
                        });

                        it('should return undefined', function() {
                            expect(task.execute()).toBeUndefined();
                        });

                    });

                    describe('when user access type is not free', function() {

                        describe('when expiry date is null', function () {

                            beforeEach(function () {
                                userContext.identity.expirationDate = null;
                            });

                            it('should be undefined', function() {
                                expect(task.execute()).toBeUndefined();
                            });

                        });

                        describe('when expiry date is undefined', function () {

                            beforeEach(function () {
                                userContext.identity.expirationDate = undefined;
                            });

                            it('should be undefined', function () {
                                expect(task.execute()).toBeUndefined();
                            });

                        });

                        describe('when expiry date more than 7', function () {

                            beforeEach(function () {
                                userContext.identity.expirationDate = 10;
                            });

                            it('should be undefined', function () {
                                expect(task.execute()).toBeUndefined();
                            });

                        });

                        describe('when expiry date is correct', function () {

                            beforeEach(function () {
                                userContext.identity.expirationDate = 5;
                                userContext.identity.firstname = 'user';
                            });

                            describe('when notifications context already has notification', function() {

                                describe('and when expiry date of this notification equal current expiry date', function() {

                                    beforeEach(function() {
                                        shellViewModel.notifications.push({
                                            name: notificationName,
                                            expirationDate: 5
                                        });
                                    });

                                    it('should return undefined', function() {
                                        expect(task.execute()).toBeUndefined();
                                    });

                                });

                            });

                            describe('when notifications context already has notification', function() {

                                describe('and when expiry date of this notification not equal current expiry date', function () {

                                    beforeEach(function () {
                                        shellViewModel.notifications([]);
                                        shellViewModel.notifications.push({
                                            name: notificationName,
                                            expirationDate: 5,
                                            firstname: 'user'
                                        });
                                    });

                                    it('should remove this notification and add new notification', function () {
                                        userContext.identity.expirationDate = 2;
                                        task.execute();
                                        expect(shellViewModel.notifications()[0].expirationDate).toBe(2);
                                    });

                                });
                                
                            });

                        });

                    });

                });

            });

        });

    });