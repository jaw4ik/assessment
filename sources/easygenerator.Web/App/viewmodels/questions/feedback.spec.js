define(['viewmodels/questions/feedback'], function (viewModel) {
    "use strict";

    var
        constants = require('constants'),
        eventTracker = require('eventTracker'),
        repository = require('repositories/questionRepository'),
        notify = require('notify');

    describe('viewModel [feedback]', function () {

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('questionId:', function () {

            it('should be defined', function () {
                expect(viewModel.questionId).toBeDefined();
            });

        });

        describe('autosaveInterval:', function () {

            it('should be defined', function () {
                expect(viewModel.autosaveInterval).toBeDefined();
            });

            it('should be equal to ' + constants.autosaveTimersInterval.feedbackText, function () {
                expect(viewModel.autosaveInterval).toBe(constants.autosaveTimersInterval.feedbackText);
            });

        });

        describe('isExpanded:', function () {

            it('should be observable', function () {
                expect(viewModel.isExpanded).toBeObservable();
            });

            it('should be true by default', function () {
                expect(viewModel.isExpanded()).toBeTruthy();
            });

        });

        describe('toggleExpand:', function () {

            it('should be function', function () {
                expect(viewModel.toggleExpand).toBeFunction();
            });

            it('should toggle isExpanded value', function () {
                viewModel.isExpanded(false);
                viewModel.toggleExpand();
                expect(viewModel.isExpanded()).toEqual(true);
            });

        });

        describe('correctFeedback:', function () {

            it('should be defined', function () {
                expect(viewModel.correctFeedback).toBeDefined();
            });

            describe('text:', function () {

                it('should be observable', function () {
                    expect(viewModel.correctFeedback.text).toBeObservable();
                });

            });

            describe('previousText:', function () {

                it('should be defined', function () {
                    expect(viewModel.correctFeedback.previousText).toBeDefined();
                });

            });

            describe('init:', function () {

                it('should be function', function () {
                    expect(viewModel.correctFeedback.init).toBeFunction();
                });

                it('should set text and previousText', function () {
                    viewModel.correctFeedback.text('');
                    viewModel.correctFeedback.previousText = '';

                    viewModel.correctFeedback.init('new text');

                    expect(viewModel.correctFeedback.text()).toBe('new text');
                    expect(viewModel.correctFeedback.previousText).toBe('new text');
                });

            });

            describe('hasFocus:', function () {

                it('should be observable', function () {
                    expect(viewModel.correctFeedback.hasFocus).toBeObservable();
                });

            });

            describe('isEmpty:', function () {

                it('should be computed', function () {
                    expect(viewModel.correctFeedback.isEmpty).toBeComputed();
                });

                describe('when text is empty', function () {

                    it('should be true', function () {
                        viewModel.correctFeedback.text('');
                        expect(viewModel.correctFeedback.isEmpty()).toBeTruthy();
                    });

                });

                describe('when text is not empty', function () {

                    it('should be false', function () {
                        viewModel.correctFeedback.text('text');
                        expect(viewModel.correctFeedback.isEmpty()).toBeFalsy();
                    });

                });

            });

            describe('updateText:', function () {

                it('should be function', function () {
                    expect(viewModel.correctFeedback.updateText).toBeFunction();
                });

                var updateCorrectFeedbackDefer;
                beforeEach(function () {
                    spyOn(eventTracker, 'publish');
                    updateCorrectFeedbackDefer = Q.defer();
                    spyOn(repository, 'updateCorrectFeedback').and.returnValue(updateCorrectFeedbackDefer.promise);
                    updateCorrectFeedbackDefer.resolve();
                });

                describe('when text equal previousText', function () {

                    beforeEach(function () {
                        viewModel.correctFeedback.text('some text');
                        viewModel.correctFeedback.previousText = 'some text';
                    });

                    it('should not update feedback', function () {
                        viewModel.correctFeedback.updateText();
                        expect(repository.updateCorrectFeedback).not.toHaveBeenCalled();
                    });

                    it('should not send event \'Update feedback content (correct answer)\'', function () {
                        viewModel.correctFeedback.updateText();
                        expect(eventTracker.publish).not.toHaveBeenCalled();
                    });

                });

                describe('when text not equal previousText', function () {

                    beforeEach(function () {
                        viewModel.correctFeedback.text('<p>some text</p>');
                        viewModel.correctFeedback.previousText = 'another text';
                    });

                    describe('and when html text is empty', function () {

                        beforeEach(function () {
                            viewModel.correctFeedback.text('   <p>    </p>   ');
                            viewModel.correctFeedback.previousText = 'another text';
                        });

                        it('should remove feedback', function () {
                            viewModel.correctFeedback.updateText();
                            expect(viewModel.correctFeedback.text()).toBe(' ');
                        });

                    });

                    it('should send event \'Update feedback content (correct answer)\'', function () {
                        viewModel.correctFeedback.updateText();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Update feedback content (correct answer)');
                    });

                    it('should set previousText equal to text', function () {
                        viewModel.correctFeedback.updateText();
                        expect(viewModel.correctFeedback.previousText).toBe(viewModel.correctFeedback.text());
                    });

                    it('should update feedback', function () {
                        viewModel.correctFeedback.updateText();
                        expect(repository.updateCorrectFeedback).toHaveBeenCalledWith(viewModel.questionId, viewModel.correctFeedback.text());
                    });

                    describe('and when feedback updated', function () {

                        it('should notify user', function (done) {
                            spyOn(notify, 'saved');
                            viewModel.correctFeedback.updateText();
                            updateCorrectFeedbackDefer.promise.fin(function () {
                                expect(notify.saved).toHaveBeenCalled();
                                done();
                            });
                        });

                    });

                });

            });

        });

        describe('incorrectFeedback:', function () {

            it('should be defined', function () {
                expect(viewModel.incorrectFeedback).toBeDefined();
            });

            describe('text:', function () {

                it('should be observable', function () {
                    expect(viewModel.incorrectFeedback.text).toBeObservable();
                });

            });

            describe('previousText:', function () {

                it('should be defined', function () {
                    expect(viewModel.incorrectFeedback.previousText).toBeDefined();
                });

            });

            describe('init:', function () {

                it('should be function', function () {
                    expect(viewModel.incorrectFeedback.init).toBeFunction();
                });

                it('should set text and previousText', function () {
                    viewModel.incorrectFeedback.text('');
                    viewModel.incorrectFeedback.previousText = '';

                    viewModel.incorrectFeedback.init('new text');

                    expect(viewModel.incorrectFeedback.text()).toBe('new text');
                    expect(viewModel.incorrectFeedback.previousText).toBe('new text');
                });

            });

            describe('hasFocus:', function () {

                it('should be observable', function () {
                    expect(viewModel.incorrectFeedback.hasFocus).toBeObservable();
                });

            });

            describe('isEmpty:', function () {

                it('should be computed', function () {
                    expect(viewModel.incorrectFeedback.isEmpty).toBeComputed();
                });

                describe('when text is empty', function () {

                    it('should be true', function () {
                        viewModel.incorrectFeedback.text('');
                        expect(viewModel.incorrectFeedback.isEmpty()).toBeTruthy();
                    });

                });

                describe('when text is not empty', function () {

                    it('should be false', function () {
                        viewModel.incorrectFeedback.text('text');
                        expect(viewModel.incorrectFeedback.isEmpty()).toBeFalsy();
                    });

                });

            });

            describe('updateText:', function () {

                it('should be function', function () {
                    expect(viewModel.incorrectFeedback.updateText).toBeFunction();
                });

                var updateIncorrectFeedbackDefer;
                beforeEach(function () {
                    spyOn(eventTracker, 'publish');
                    updateIncorrectFeedbackDefer = Q.defer();
                    spyOn(repository, 'updateIncorrectFeedback').and.returnValue(updateIncorrectFeedbackDefer.promise);
                    updateIncorrectFeedbackDefer.resolve();
                });

                describe('when text equal previousText', function () {

                    beforeEach(function () {
                        viewModel.incorrectFeedback.text('some text');
                        viewModel.incorrectFeedback.previousText = 'some text';
                    });

                    it('should not update feedback', function () {
                        viewModel.incorrectFeedback.updateText();
                        expect(repository.updateIncorrectFeedback).not.toHaveBeenCalled();
                    });

                    it('should not send event \'Update feedback content (incorrect answer)\'', function () {
                        viewModel.incorrectFeedback.updateText();
                        expect(eventTracker.publish).not.toHaveBeenCalled();
                    });

                });

                describe('when text not equal previousText', function () {

                    beforeEach(function () {
                        viewModel.incorrectFeedback.text('<p>some text</p>');
                        viewModel.incorrectFeedback.previousText = 'another text';
                    });

                    describe('and when html text is empty', function () {

                        beforeEach(function () {
                            viewModel.incorrectFeedback.text('   <p>    </p>   ');
                            viewModel.incorrectFeedback.previousText = 'another text';
                        });

                        it('should remove feedback', function () {
                            viewModel.incorrectFeedback.updateText();
                            expect(viewModel.incorrectFeedback.text()).toBe(' ');
                        });

                    });

                    it('should send event \'Update feedback content (incorrect answer)\'', function () {
                        viewModel.incorrectFeedback.updateText();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Update feedback content (incorrect answer)');
                    });

                    it('should set previousText equal to text', function () {
                        viewModel.incorrectFeedback.updateText();
                        expect(viewModel.incorrectFeedback.previousText).toBe(viewModel.incorrectFeedback.text());
                    });

                    it('should update feedback', function () {
                        viewModel.incorrectFeedback.updateText();
                        expect(repository.updateIncorrectFeedback).toHaveBeenCalledWith(viewModel.questionId, viewModel.incorrectFeedback.text());
                    });

                    describe('and when feedback updated', function () {

                        it('should notify user', function (done) {
                            spyOn(notify, 'saved');
                            viewModel.incorrectFeedback.updateText();
                            updateIncorrectFeedbackDefer.promise.fin(function () {
                                expect(notify.saved).toHaveBeenCalled();
                                done();
                            });
                        });

                    });

                });

            });

        });

        describe('correctFeedbackUpdatedByCollaborator:', function () {

            it('should be function', function () {
                expect(viewModel.correctFeedbackUpdatedByCollaborator).toBeFunction();
            });

            viewModel.questionId = 'questionId';
            var question = { id: null };
            var feedbackText = 'correct feedback text';

            describe('when it is not current question', function () {

                beforeEach(function () {
                    question.id = 'another id';
                });

                it('should not update correctFeedback text', function () {
                    viewModel.correctFeedback.text('');

                    viewModel.correctFeedbackUpdatedByCollaborator(question, feedbackText);

                    expect(viewModel.correctFeedback.text()).not.toBe(feedbackText);
                });

            });

            describe('when it is current question', function () {

                beforeEach(function () {
                    question.id = viewModel.questionId;
                });

                it('should update correctFeedback text', function () {
                    viewModel.correctFeedback.text('');

                    viewModel.correctFeedbackUpdatedByCollaborator(question, feedbackText);

                    expect(viewModel.correctFeedback.text()).toBe(feedbackText);
                });

            });

        });

        describe('incorrectFeedbackUpdatedByCollaborator:', function () {

            it('should be function', function () {
                expect(viewModel.incorrectFeedbackUpdatedByCollaborator).toBeFunction();
            });

            viewModel.questionId = 'questionId';
            var question = { id: null };
            var feedbackText = 'correct feedback text';

            describe('when it is not current question', function () {

                beforeEach(function () {
                    question.id = 'another id';
                });

                it('should not update incorrectFeedback text', function () {
                    viewModel.incorrectFeedback.text('');

                    viewModel.incorrectFeedbackUpdatedByCollaborator(question, feedbackText);

                    expect(viewModel.incorrectFeedback.text()).not.toBe(feedbackText);
                });

            });

            describe('when it is current question', function () {

                beforeEach(function () {
                    question.id = viewModel.questionId;
                });

                it('should update incorrectFeedback text', function () {
                    viewModel.incorrectFeedback.text('');

                    viewModel.incorrectFeedbackUpdatedByCollaborator(question, feedbackText);

                    expect(viewModel.incorrectFeedback.text()).toBe(feedbackText);
                });

            });

        });

        describe('activate:', function () {

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            it('should return promise', function () {
                expect(viewModel.activate()).toBePromise();
            });

            var questionId = '1';
            var getQuestionFeedbackDeferred;
            beforeEach(function () {
                getQuestionFeedbackDeferred = Q.defer();
                spyOn(repository, 'getQuestionFeedback').and.returnValue(getQuestionFeedbackDeferred.promise);
                getQuestionFeedbackDeferred.resolve({
                    correctFeedbackText: 'correct',
                    incorrectFeedbackText: 'incorrect'
                });
            });

            it('should set isExpanded to true', function (done) {
                viewModel.isExpanded(false);
                viewModel.activate(questionId).fin(function () {
                    expect(viewModel.isExpanded()).toBeTruthy();
                    done();
                });
            });

            it('should set questionId', function (done) {
                viewModel.questionId = null;
                viewModel.activate(questionId).fin(function () {
                    expect(viewModel.questionId).toBe(questionId);
                    done();
                });
            });

            it('should get question feedback', function (done) {
                viewModel.activate(questionId).fin(function () {
                    expect(repository.getQuestionFeedback).toHaveBeenCalledWith(questionId);
                    done();
                });
            });

            describe('and when question feedback received', function () {

                it('should init correct feedback', function (done) {
                    spyOn(viewModel.correctFeedback, 'init');
                    viewModel.activate(questionId).fin(function () {
                        expect(viewModel.correctFeedback.init).toHaveBeenCalledWith('correct');
                        done();
                    });
                });

                it('should init incorrect feedback', function (done) {
                    spyOn(viewModel.incorrectFeedback, 'init');
                    viewModel.activate(questionId).fin(function () {
                        expect(viewModel.incorrectFeedback.init).toHaveBeenCalledWith('incorrect');
                        done();
                    });
                });

            });

        });

    });

});