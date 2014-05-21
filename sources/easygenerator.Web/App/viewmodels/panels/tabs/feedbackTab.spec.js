﻿define(function (require) {

    var viewModel = require('viewmodels/panels/tabs/feedbackTab'),
        router = require('plugins/router'),
        eventTracker = require('eventTracker'),
        httpWrapper = require('http/httpWrapper'),
        notify = require('notify'),
        userContext = require('userContext');

    describe('viewModel [feedbackTab]', function () {

        beforeEach(function () {
            spyOn(eventTracker, 'publish');
            spyOn(router, 'navigate');
            spyOn(router, 'setLocation');
        });

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('isEnabled:', function () {

            it('should be computed', function () {
                expect(viewModel.isEnabled).toBeComputed();
            });

            it('should return true', function () {
                expect(viewModel.isEnabled()).toBeTruthy();
            });
        });

        describe('canActivate:', function () {

            it('should be function', function () {
                expect(viewModel.canActivate).toBeFunction();
            });

        });

        describe('activate:', function () {

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            it('should send event \'Open feedback form\'', function (done) {
                viewModel.activate().fin(function () {
                    expect(eventTracker.publish).toHaveBeenCalledWith('Open feedback form');
                    done();
                });
            });

            it('should clear previous error message', function (done) {
                viewModel.isFeedbackMessageErrorVisible(null);

                viewModel.activate().fin(function () {
                    expect(viewModel.isFeedbackMessageErrorVisible()).toBe(false);
                    done();
                });
            });

            describe('when user is anonymous', function () {

                beforeEach(function () {
                    userContext.identity = null;
                });

                it('should set isTryMode to true', function (done) {
                    viewModel.activate().fin(function () {
                        expect(viewModel.isTryMode).toBeTruthy();
                        done();
                    });
                });

                it('should set userEmail to null', function (done) {
                    viewModel.activate().fin(function () {
                        expect(viewModel.userEmail).toBeNull();
                        done();
                    });
                });

            });

            describe('when user is not anonymous', function () {

                beforeEach(function () {
                    userContext.identity = {
                        email: 'some_user@easygenerator.com'
                    };
                });

                it('should set isTryMode to false', function (done) {
                    viewModel.activate().fin(function () {
                        expect(viewModel.isTryMode).toBeFalsy();
                        done();
                    });
                });

                it('should set userEmail', function (done) {
                    viewModel.activate().fin(function () {
                        expect(viewModel.userEmail).toBe(userContext.identity.email);
                        done();
                    });
                });

            });

        });

        describe('userEmail:', function () {

            it('should be defined', function () {
                expect(viewModel.userEmail).toBeDefined();
            });

        });

        describe('sendFeedback:', function () {

            it('should be function', function () {
                expect(viewModel.sendFeedback).toBeFunction();
            });

            describe('when user entered feedback message', function () {

                var feedbackDefer;

                beforeEach(function () {
                    feedbackDefer = Q.defer();
                    spyOn(httpWrapper, 'post').and.returnValue(feedbackDefer.promise);
                    spyOn(notify, 'success');
                    viewModel.feedbackMessageFromUser('some message');
                });

                it('should send event \'Send feedback\'', function () {
                    viewModel.sendFeedback();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Send feedback');
                });

                describe('and try mode', function () {

                    beforeEach(function () {
                        viewModel.isTryMode = true;
                        viewModel.feedbackEmail('some email');
                    });

                    it('should call \'api/feedback/sendfeedback\' with anonymous user email and message', function () {
                        var data = { email: viewModel.feedbackEmail(), message: viewModel.feedbackMessageFromUser() };
                        viewModel.sendFeedback();
                        expect(httpWrapper.post).toHaveBeenCalledWith('api/feedback/sendfeedback', data);
                    });

                });

                describe('and not try mode', function () {

                    beforeEach(function () {
                        viewModel.isTryMode = false;
                        viewModel.userEmail = 'easygenerator user online';
                    });

                    it('should call \'api/feedback/sendfeedback\' with easygenerator user email and message', function () {
                        var data = { email: viewModel.userEmail, message: viewModel.feedbackMessageFromUser() };
                        viewModel.sendFeedback();
                        expect(httpWrapper.post).toHaveBeenCalledWith('api/feedback/sendfeedback', data);
                    });

                });

                describe('when email was sent', function () {

                    beforeEach(function () {
                        feedbackDefer.resolve();
                    });

                    it('should clear feedback message', function (done) {
                        viewModel.sendFeedback().fin(function () {
                            expect(viewModel.feedbackMessageFromUser()).toBe('');
                            done();
                        });
                    });

                    it('should clear feedback email', function (done) {
                        viewModel.sendFeedback().fin(function () {
                            expect(viewModel.feedbackEmail()).toBe('');
                            done();
                        });
                    });

                    it('should hide feedback popup', function () {
                        viewModel.isShowFeedbackPopup(true);
                        viewModel.sendFeedback();
                        expect(viewModel.isShowFeedbackPopup()).toBeFalsy();
                    });

                });

            });

            describe('when user not entered feedback message', function () {

                beforeEach(function () {
                    viewModel.feedbackMessageFromUser('');
                });

                it('should send event \'Feedback\'', function () {
                    viewModel.sendFeedback();
                    expect(eventTracker.publish).not.toHaveBeenCalledWith('Feedback');
                });

                it('should show error border', function () {
                    viewModel.isFeedbackMessageErrorVisible(false);
                    viewModel.sendFeedback();
                    expect(viewModel.isFeedbackMessageErrorVisible()).toBeTruthy();
                });

            });

        });

        describe('feedbackMessageFromUser:', function () {

            it('should be observable', function () {
                expect(viewModel.feedbackMessageFromUser).toBeObservable();
            });

        });

        describe('feedbackEmail:', function () {

            it('should be observable', function () {
                expect(viewModel.feedbackEmail).toBeObservable();
            });

        });

        describe('feedbackMessageFocus:', function () {

            it('should be function', function () {
                expect(viewModel.feedbackMessageFocus).toBeFunction();
            });

            it('should hide error border', function () {
                viewModel.feedbackMessageFocus();
                expect(viewModel.isFeedbackMessageErrorVisible()).toBeFalsy();
            });

        });

        describe('isFeedbackMessageErrorVisible:', function () {

            it('should be observable', function () {
                expect(viewModel.isFeedbackMessageErrorVisible).toBeObservable();
            });

        });

    });
});