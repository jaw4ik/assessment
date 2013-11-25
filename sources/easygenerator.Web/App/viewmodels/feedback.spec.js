define(function (require) {

    var viewModel = require('viewmodels/feedback'),
        router = require('plugins/router'),
        eventTracker = require('eventTracker'),
        localizationManager = require('localization/localizationManager'),
        helpHintRepository = require('repositories/helpHintRepository'),
        httpWrapper = require('httpWrapper'),
        notify = require('notify'),
        dataContext = require('dataContext');

    describe('viewModel [feedback]', function () {

        beforeEach(function () {
            spyOn(eventTracker, 'publish');
            spyOn(router, 'navigate');
            spyOn(router, 'setLocation');
        });

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('activate:', function () {

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            it('should set browserCulture', function () {
                localizationManager.currentLanguage = 'ar';
                var promise = viewModel.activate();
                waitsFor(function() {
                    return !promise.isPending();
                });
                runs(function() {
                    expect(viewModel.browserCulture()).toBe('ar');
                });
            });

            it('should set userEmail', function () {
                dataContext.userEmail = 'some email';
                var promise = viewModel.activate();
                waitsFor(function() {
                    return !promise.isPending();
                });
                runs(function() {
                    expect(viewModel.userEmail).toBe('some email');
                });
            });

            it('should set isTryMode', function() {
                dataContext.isTryMode = false;
                var promise = viewModel.activate();
                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.isTryMode).toBeFalsy();
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
                    spyOn(httpWrapper, 'post').andReturn(feedbackDefer.promise);
                    spyOn(notify, 'info');
                    viewModel.feedbackMessageFromUser('some message');
                });

                it('should send event \'Feedback\'', function () {
                    viewModel.sendFeedback();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Feedback');
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

                    it('should call notify with message \'Feedback\'', function () {
                        var promise = viewModel.sendFeedback();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(notify.info).toHaveBeenCalledWith('Your feedback has been sent successfully');
                        });
                    });

                    it('should clear feedback message', function () {
                        var promise = viewModel.sendFeedback();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.feedbackMessageFromUser()).toBe('');
                        });
                    });

                    it('should clear feedback email', function () {
                        var promise = viewModel.sendFeedback();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.feedbackEmail()).toBe('');
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

        describe('isShowFeedbackPopup:', function () {

            it('should be observable', function () {
                expect(viewModel.isShowFeedbackPopup).toBeObservable();
            });

        });

        describe('toggleFeedbackPopup:', function () {

            it('should be function', function () {
                expect(viewModel.toggleFeedbackPopup).toBeFunction();
            });

            it('should toggle feedbackPopup', function () {
                viewModel.isShowFeedbackPopup(false);
                viewModel.toggleFeedbackPopup();
                expect(viewModel.isShowFeedbackPopup()).toBeTruthy();
            });

        });

    });

});