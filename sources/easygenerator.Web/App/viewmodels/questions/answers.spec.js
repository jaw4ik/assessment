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
            viewModel = ctor(questionId, []);

            spyOn(notify, 'saved');
            spyOn(notify, 'error');
            spyOn(eventTracker, 'publish');
        });

        describe('answers:', function () {

            it('should be observable array', function () {
                expect(viewModel.answers).toBeObservable();
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

       describe('beginEditText:', function () {

            it('should be function', function () {
                expect(viewModel.beginEditText).toBeFunction();
            });

            it('should set text isEditing to true', function () {
                var answer = {
                    id: ko.observable('answerId'),
                    text: ko.observable('')
                };
                answer.text.isEditing = ko.observable(false);

                viewModel.beginEditText(answer);
                expect(answer.text.isEditing()).toBeTruthy();
            });

        });

        describe('endEditText:', function () {

            it('should be function', function () {
                expect(viewModel.endEditText).toBeFunction();
            });

            it('should send event \'Edit answer option\'', function () {
                var answer = {
                    id: ko.observable('answerId'),
                    text: ko.observable('')
                };
                answer.text.isEditing = ko.observable(true);

                viewModel.endEditText(answer);
                expect(eventTracker.publish).toHaveBeenCalledWith('Edit answer option');
            });

            it('should set isEditing to false', function () {
                var answer = {
                    id: ko.observable('answerId'),
                    text: ko.observable('')
                };
                answer.text.isEditing = ko.observable(true);

                viewModel.endEditText(answer);
                expect(answer.text.isEditing()).toBeFalsy();
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

        describe('addedByCollaborator:', function () {
            var answer = { id: 'id', text: 'text', isCorrect: true },
                question = { id: questionId };

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
                answer = {
                    id: 'id',
                    text: text,
                    isCorrect: true
                },
                question = { id: questionId },
            vmAnswer = {
                id: ko.observable(answer.id),
                isDeleted: ko.observable(false),
                hasFocus: ko.observable(false),
                text: ko.observable(''),
                original: { text: '' }
            };

            it('should be function', function () {
                expect(viewModel.textUpdatedByCollaborator).toBeFunction();
            });

            describe('when question is not current question', function () {
                it('should not update answer', function () {
                    vmAnswer.hasFocus(false);
                    viewModel.answers([vmAnswer]);
                    
                    viewModel.textUpdatedByCollaborator({ id: 'smth' }, answer.id, text);
                    expect(vmAnswer.text()).toBe('');
                });
            });

            describe('when answer is in edit mode', function () {
                it('should not update answer', function () {
                    vmAnswer.hasFocus(true);
                    viewModel.answers([vmAnswer]);

                    viewModel.textUpdatedByCollaborator(question, answer.id, text);
                    expect(vmAnswer.text()).toBe('');
                });

                it('should update original answer', function () {
                    vmAnswer.hasFocus(true);
                    viewModel.answers([vmAnswer]);
                    viewModel.textUpdatedByCollaborator(question, answer.id, text);
                    expect(vmAnswer.original.text).toBe(text);
                });
            });

            it('should update answer text', function () {
                vmAnswer.hasFocus(false);
                viewModel.answers([vmAnswer]);
                viewModel.textUpdatedByCollaborator(question, answer.id, text);
                expect(vmAnswer.text()).toBe(text);
            });

            it('should update original answer text', function () {
                vmAnswer.hasFocus(false);
                viewModel.answers([vmAnswer]);
                viewModel.textUpdatedByCollaborator(question, answer.id, text);
                expect(vmAnswer.original.text).toBe(text);
            });
        });

        describe('doAddAnswer:', function () {

            it('should be function', function () {
                expect(viewModel.doAddAnswer).toBeFunction();
            });

            describe('when there is no parameter', function() {
                it('should add empty answer', function () {
                    viewModel.answers([]);

                    viewModel.doAddAnswer();

                    expect(viewModel.answers().length).toEqual(1);
                    expect(viewModel.answers()[0].id).toBeObservable();
                    expect(viewModel.answers()[0].id()).toEqual("");
                    expect(viewModel.answers()[0].text).toBeObservable();
                    expect(viewModel.answers()[0].text()).toEqual("");
                    expect(viewModel.answers()[0].isCorrect).toBeObservable();
                    expect(viewModel.answers()[0].isCorrect()).toBeFalsy();
                    expect(viewModel.answers()[0].hasFocus).toBeObservable();
                    expect(viewModel.answers()[0].hasFocus()).toBeFalsy();
                    expect(viewModel.answers()[0].text.isEditing).toBeObservable();
                    expect(viewModel.answers()[0].text.isEditing()).toBeFalsy();
                });
            });

            describe('when object is passed as parameter', function () {
                var newAnswer;

                beforeEach(function () {
                    newAnswer = {id: "id", text: "answer text", isCorrect: true};
                });

                it('should add new answer with defined text and correctness', function () {
                    viewModel.answers([]);

                    viewModel.doAddAnswer(newAnswer);

                    expect(viewModel.answers().length).toEqual(1);
                    expect(viewModel.answers()[0].id).toBeObservable();
                    expect(viewModel.answers()[0].id()).toEqual(newAnswer.id);
                    expect(viewModel.answers()[0].text).toBeObservable();
                    expect(viewModel.answers()[0].text()).toEqual(newAnswer.text);
                    expect(viewModel.answers()[0].isCorrect).toBeObservable();
                    expect(viewModel.answers()[0].isCorrect()).toEqual(newAnswer.isCorrect);
                    expect(viewModel.answers()[0].hasFocus).toBeObservable();
                    expect(viewModel.answers()[0].hasFocus()).toBeFalsy();
                    expect(viewModel.answers()[0].text.isEditing).toBeObservable();
                    expect(viewModel.answers()[0].text.isEditing()).toBeFalsy();
                });
            });
        });
    });
})