define(function (require) {
    "use strict";

    var
        ctor = require('viewmodels/questions/answers'),
        repository = require('repositories/answerRepository'),
        eventTracker = require('eventTracker'),
        notify = require('notify')
    ;

    describe('viewModel [answers]', function () {

        var viewModel;
        var questionId = 'questionId';

        beforeEach(function () {
            spyOn(notify, 'saved');
            spyOn(notify, 'error');
            spyOn(eventTracker, 'publish');
        });

        describe('selectedAnswer:', function () {

            beforeEach(function () {
                viewModel = ctor(questionId, []);
            });

            it('should be observable', function () {
                expect(viewModel.selectedAnswer).toBeObservable();
            });
        });

        describe('answers:', function () {

            beforeEach(function () {
                viewModel = ctor(questionId, []);
            });

            it('should be observable array', function () {
                expect(viewModel.answers).toBeObservable();
            });

        });

        describe('isExpanded:', function () {

            beforeEach(function () {
                viewModel = ctor(questionId, []);
            });

            it('should be observable', function () {
                expect(viewModel.isExpanded).toBeObservable();
            });

            it('should be true by default', function () {
                expect(viewModel.isExpanded()).toBeTruthy();
            });

        });

        describe('beginEditText:', function () {

            it('should be function', function () {
                expect(viewModel.beginEditText).toBeFunction();
            });

            it('should send event \'Start editing answer option\'', function () {
                var answer = { id: ko.observable('answerId'), text: ko.observable(''), hasFocus: ko.observable(false) };
                viewModel.beginEditText(answer);
                expect(eventTracker.publish).toHaveBeenCalledWith('Start editing answer option');
            });

            it('should set focus to answer', function () {
                var answer = { id: ko.observable('answerId'), text: ko.observable(''), hasFocus: ko.observable(false) };
                viewModel.beginEditText(answer);
                expect(answer.hasFocus()).toBeTruthy();
            });

        });

        describe('endEditText:', function () {

            var removeAnswer;

            beforeEach(function () {
                viewModel = ctor(questionId, []);

                removeAnswer = Q.defer();
                spyOn(repository, 'removeAnswer').and.returnValue(removeAnswer.promise);
            });

            it('should be function', function () {
                expect(viewModel.endEditText).toBeFunction();
            });

            it('should send event \'End editing answer option\'', function () {
                var answer = { id: ko.observable('answerId'), text: ko.observable(''), hasFocus: ko.observable(true) };
                viewModel.endEditText(answer);
                expect(eventTracker.publish).toHaveBeenCalledWith('End editing answer option');
            });

            it('should remove focus from answer', function () {
                var answer = { id: ko.observable('answerId'), text: ko.observable(''), hasFocus: ko.observable(true) };
                viewModel.endEditText(answer);
                expect(answer.hasFocus()).toBeFalsy();
            });
        });

        describe('toggleExpand:', function () {

            beforeEach(function () {
                viewModel = ctor(questionId, []);
            });

            it('should be function', function () {
                expect(viewModel.toggleExpand).toBeFunction();
            });

            it('should toggle isExpanded value', function () {
                viewModel.isExpanded(false);
                viewModel.toggleExpand();
                expect(viewModel.isExpanded()).toEqual(true);
            });

        });

        describe('addedByCollaborator:', function () {
            var answer = { id: 'id', text: 'text', isCorrect: true },
                question = { id: questionId };

            beforeEach(function () {
                viewModel = ctor(questionId, []);
            });

            it('should be function', function () {
                expect(viewModel.addedByCollaborator).toBeFunction();
            });

            describe('when question is not current question', function () {
                it('should not add answer', function () {
                    viewModel.answers([]);
                    viewModel.addedByCollaborator({ id: 'smth' }, answer);
                    expect(viewModel.answers().length).toEqual(0);
                });
            });

            it('should add answer', function () {
                viewModel.answers([]);
                viewModel.addedByCollaborator(question, answer);
                expect(viewModel.answers().length).toEqual(1);
                expect(viewModel.answers()[0].id()).toEqual(answer.id);
                expect(viewModel.answers()[0].text()).toEqual(answer.text);
                expect(viewModel.answers()[0].isCorrect()).toBe(answer.isCorrect);
                expect(viewModel.answers()[0].hasFocus()).toBeFalsy();
            });
        });

        describe('textUpdatedByCollaborator:', function () {
            var text = 'text',
                answer = { id: 'id', text: text, isCorrect: true },
                question = { id: questionId },
            vmAnswer = {
                id: ko.observable(answer.id), isDeleted: ko.observable(false), text: ko.observable('')
            };

            beforeEach(function () {
                viewModel = ctor(questionId, []);
            });

            it('should be function', function () {
                expect(viewModel.textUpdatedByCollaborator).toBeFunction();
            });

            describe('when question is not current question', function () {
                it('should not update answer', function () {
                    viewModel.answers([vmAnswer]);
                    viewModel.textUpdatedByCollaborator({ id: 'smth' }, answer.id, text);
                    expect(vmAnswer.text()).toBe('');
                });
            });

            describe('when answer is in edit mdode', function () {
                it('should not update answer', function () {
                    viewModel.answers([vmAnswer]);
                    viewModel.selectedAnswer(vmAnswer);
                    viewModel.textUpdatedByCollaborator(question, answer.id, text);
                    expect(vmAnswer.text()).toBe('');
                });
            });

            it('should update answer text', function () {
                viewModel.answers([vmAnswer]);
                viewModel.selectedAnswer(null);
                viewModel.textUpdatedByCollaborator(question, answer.id, text);
                expect(vmAnswer.text()).toBe(text);
            });
        });

    });
})