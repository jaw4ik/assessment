define(function (require) {
    "use strict";

    var
        ctor = require('viewmodels/questions/multipleChoice/multipleChoiceAnswers'),
        eventTracker = require('eventTracker'),
        repository = require('repositories/answerRepository'),
        notify = require('notify')
    ;

    describe('viewModel [multipleChoiceAnswers]', function () {

        var viewModel;
        var questionId = 'questionId';

        beforeEach(function () {
            spyOn(notify, 'saved');
            spyOn(eventTracker, 'publish');
            spyOn(notify, 'error');
        });

        describe('showDeleteButton:', function () {

            var answer;

            beforeEach(function () {
                viewModel = ctor(questionId, []);
                answer = { id: ko.observable('answerId'), text: ko.observable('test') };
            });

            it('should be computed', function () {
                expect(viewModel.showDeleteButton).toBeComputed();
            });

            describe('when answers length == 2', function () {
                it('should return false', function () {
                    viewModel.answers.push(answer);
                    viewModel.answers.push(answer);
                    expect(viewModel.showDeleteButton()).toBeFalsy();
                });
            });

            describe('when answers length > 2', function () {
                it('should return true', function () {
                    viewModel.answers.push(answer);
                    viewModel.answers.push(answer);
                    viewModel.answers.push(answer);
                    expect(viewModel.showDeleteButton()).toBeTruthy();
                });
            });

        });

        describe('addAnswer:', function () {

            beforeEach(function () {
                viewModel = ctor(questionId, []);
            });

            it('should be function', function () {
                expect(viewModel.addAnswer).toBeFunction();
            });

            it('should send event \'Add answer option\'', function () {
                viewModel.addAnswer();
                expect(eventTracker.publish).toHaveBeenCalledWith('Add answer option');
            });

            it('should add empty answer', function () {
                viewModel.addAnswer();
                expect(viewModel.answers().length).toEqual(1);
                expect(viewModel.answers()[0].id).toBeObservable();
                expect(viewModel.answers()[0].id()).toEqual("");
                expect(viewModel.answers()[0].text).toBeObservable();
                expect(viewModel.answers()[0].text()).toEqual("");
                expect(viewModel.answers()[0].isCorrect).toBeObservable();
                expect(viewModel.answers()[0].isCorrect()).toBeFalsy();
                expect(viewModel.answers()[0].hasFocus).toBeObservable();
                expect(viewModel.answers()[0].hasFocus()).toBeTruthy();
            });

            it('should select added answer', function (done) {
                viewModel.selectedAnswer(null);

                viewModel.addAnswer().fin(function () {
                    expect(viewModel.selectedAnswer()).toBe(viewModel.answers()[0]);
                    done();
                });
            });
        });

        describe('toggleCorrectness:', function () {
            var answer = { id: ko.observable('answerId'), text: ko.observable(''), isCorrect: ko.observable(false), original: { correctness: false }, isDeleted: ko.observable(false) };
            var multipleChoiceChangeCorrectAnswerDefer;
            beforeEach(function () {
                viewModel = ctor(questionId, []);
                multipleChoiceChangeCorrectAnswerDefer = Q.defer();
                spyOn(repository, 'multipleChoiceChangeCorrectAnswer').and.returnValue(multipleChoiceChangeCorrectAnswerDefer.promise);
            });

            it('should be function', function () {
                expect(viewModel.toggleCorrectness).toBeFunction();
            });

            describe('when current correct answer equal answer which change correctness', function () {

                it('should not change correctness', function () {
                    viewModel.answers([answer]);
                    answer.isCorrect(true);
                    viewModel.toggleCorrectness(answer);
                    expect(eventTracker.publish).not.toHaveBeenCalledWith('Change answer option correctness');
                });

            });

            describe('when current correct answer not equal answer which change correctness', function () {

                beforeEach(function () {
                    answer.isCorrect(false);
                });

                it('should send event \'Change answer option correctness\'', function () {
                    viewModel.toggleCorrectness(answer);
                    expect(eventTracker.publish).toHaveBeenCalledWith('Change answer option correctness');
                });

                it('should update answer correctness in the viewModel', function () {
                    viewModel.toggleCorrectness(answer);

                    expect(answer.isCorrect()).toBeTruthy();
                });

                it('should return promise', function() {
                    expect(viewModel.toggleCorrectness(answer)).toBePromise();
                });

                describe('and when answer id is not empty', function () {

                    beforeEach(function() {
                        answer.id('foo');
                    });

                    it('should update correctness', function(done) {
                        viewModel.toggleCorrectness(answer).fin(function () {
                            expect(repository.multipleChoiceChangeCorrectAnswer).toHaveBeenCalledWith(questionId, answer.id());
                            done();
                        });
                    });

                });

                describe('and when answer id is empty', function() {
                    
                    beforeEach(function () {
                        answer.id('');
                    });

                    it('should not update correctness', function (done) {
                        multipleChoiceChangeCorrectAnswerDefer.reject();
                        viewModel.toggleCorrectness(answer).fin(function () {
                            expect(repository.multipleChoiceChangeCorrectAnswer).not.toHaveBeenCalled();
                            done();
                        });
                    });

                    describe('and answer is set later', function() {

                        it('should update correctness', function (done) {
                            viewModel.toggleCorrectness(answer).fin(function () {
                                answer.id('foo');
                                expect(repository.multipleChoiceChangeCorrectAnswer).toHaveBeenCalledWith(questionId, answer.id());
                                done();
                            });
                        });

                    });

                });

            });
            
        });

        describe('selectAnswer:', function () {
            var answer = { id: ko.observable('answerId'), text: ko.observable('test'), isCorrect: ko.observable(false), original: { text: 'old', correctness: true }, isDeleted: ko.observable(false) };

            beforeEach(function () {
                viewModel = ctor(questionId, []);
            });

            it('should be function', function () {
                expect(viewModel.selectAnswer).toBeFunction();
            });

            it('should return promise', function () {
                viewModel.selectedAnswer(null);
                var result = viewModel.selectAnswer(answer);

                expect(result).toBePromise();
            });

            it('should set selectedAnswer', function (done) {
                viewModel.selectedAnswer(null);

                viewModel.selectAnswer(answer).fin(function () {
                    expect(viewModel.selectedAnswer()).toBe(answer);
                    done();
                });
            });

            describe('when previos selected answer is not changed', function () {

                var updateText;

                beforeEach(function () {
                    updateText = Q.defer();
                    spyOn(repository, 'updateText').and.returnValue(updateText.promise);
                    updateText.resolve(new Date());
                });

                it('should not update answer text', function (done) {
                    viewModel.selectedAnswer(answer);

                    viewModel.selectAnswer(answer).fin(function () {
                        expect(repository.updateText).not.toHaveBeenCalled();
                        done();
                    });
                });
            });

            describe('when previos selected answer is changed', function () {

                describe('when previous selected answer is not null', function () {
                    var updateText;

                    beforeEach(function () {
                        updateText = Q.defer();
                        spyOn(repository, 'updateText').and.returnValue(updateText.promise);
                        updateText.resolve(new Date());

                        answer.original.correctness = true;
                    });

                    it('should update answer', function (done) {
                        viewModel.selectedAnswer(answer);

                        viewModel.selectAnswer(null).fin(function () {
                            expect(repository.updateText).toHaveBeenCalled();
                            done();
                        });
                    });
                });
            });

        });

        describe('multiplechoiceDeleteByCollaborator:', function () {
            var answer = { id: 'id', text: 'text', isCorrect: true },
                answer1 = { id: 'id1', text: 'text', isCorrect: false },
                question = { id: questionId },
                vmAnswer = { id: ko.observable(answer.id), isDeleted: ko.observable(false), isCorrect: ko.observable(false) },
                vmAnswer1 = { id: ko.observable(answer1.id), isDeleted: ko.observable(false), isCorrect: ko.observable(false), original: { correctness: false } };

            beforeEach(function () {
                viewModel = ctor(questionId, []);
            });

            it('should be function', function () {
                expect(viewModel.multiplechoiceDeleteByCollaborator).toBeFunction();
            });

            describe('when question is not current question', function () {
                it('should not delete answer', function () {
                    viewModel.answers([vmAnswer]);
                    viewModel.multiplechoiceDeleteByCollaborator({ id: 'smth' }, answer.id);
                    expect(viewModel.answers().length).toEqual(1);
                });
            });

            describe('when answer option is in edit mode', function () {
                it('should not delete answer', function () {
                    viewModel.answers([vmAnswer]);
                    viewModel.selectedAnswer(vmAnswer);
                    viewModel.multiplechoiceDeleteByCollaborator(question, answer.id);
                    expect(viewModel.answers().length).toEqual(1);
                });

                it('should mark answer as deleted', function () {
                    vmAnswer.isDeleted(false);
                    viewModel.answers([vmAnswer]);
                    viewModel.selectedAnswer(vmAnswer);
                    viewModel.multiplechoiceDeleteByCollaborator(question, answer.id);
                    expect(vmAnswer.isDeleted).toBeTruthy();
                });

                it('should show notification', function () {
                    viewModel.answers([vmAnswer]);
                    viewModel.selectedAnswer(vmAnswer);
                    viewModel.multiplechoiceDeleteByCollaborator(question, answer.id);
                    expect(notify.error).toHaveBeenCalled();
                });

                describe('when answer correct', function () {

                    it('should set answer to incorrect', function () {
                        vmAnswer.isCorrect(true);
                        viewModel.answers([vmAnswer, vmAnswer1]);
                        viewModel.selectedAnswer(vmAnswer);
                        viewModel.multiplechoiceDeleteByCollaborator(question, answer.id);
                        expect(vmAnswer.isCorrect()).toBeFalsy();
                    });

                    it('should set correctness in answer which is not marked as deleted', function () {
                        vmAnswer.isCorrect(true);
                        vmAnswer1.isCorrect(false);
                        viewModel.answers([vmAnswer, vmAnswer1]);
                        viewModel.selectedAnswer(vmAnswer);
                        viewModel.multiplechoiceDeleteByCollaborator(question, answer.id);
                        expect(vmAnswer1.isCorrect()).toBeTruthy();
                    });

                });
            });

            it('should remove answer', function () {
                viewModel.selectedAnswer(null);
                viewModel.answers([vmAnswer]);
                viewModel.multiplechoiceDeleteByCollaborator(question, answer.id);
                expect(viewModel.answers().length).toEqual(0);
            });

        });

        describe('multiplechoiceCorrectnessUpdatedByCollaborator:', function () {
            var text = 'text',
              answer = { id: 'id', text: text, isCorrect: true },
              answer1 = { id: 'id1', text: text, isCorrect: false },
              question = { id: questionId },
            vmAnswer = {
                id: ko.observable(answer.id), isDeleted: ko.observable(false), isCorrect: ko.observable(true), original: { correctness: false }
            },
            vmAnswer1 = {
                id: ko.observable(answer1.id), isDeleted: ko.observable(false), isCorrect: ko.observable(false), original: { correctness: false }
            };

            beforeEach(function () {
                viewModel = ctor(questionId, []);
            });

            it('should be function', function () {
                expect(viewModel.multiplechoiceCorrectnessUpdatedByCollaborator).toBeFunction();
            });

            describe('when question is not current question', function () {

                it('should not update answer', function () {
                    viewModel.answers([vmAnswer, vmAnswer1]);
                    viewModel.multiplechoiceCorrectnessUpdatedByCollaborator({ id: 'smth' }, answer.id, false);
                    expect(vmAnswer.isCorrect()).toBeTruthy();
                });

            });

            describe('when answer is founded in current answers list', function () {

                describe('and when current correct answer not equal answer to update', function () {

                    it('should update answer', function () {
                        vmAnswer.isCorrect(false);
                        vmAnswer1.isCorrect(true);
                        viewModel.answers([vmAnswer, vmAnswer1]);
                        viewModel.multiplechoiceCorrectnessUpdatedByCollaborator({ id: questionId }, answer.id, true);
                        expect(vmAnswer.isCorrect()).toBeTruthy();
                        expect(vmAnswer1.isCorrect()).toBeFalsy();
                    });

                });

                describe('and when current correct answer equal answer to update', function () {

                    it('should not update answer', function () {
                        vmAnswer.isCorrect(true);
                        viewModel.answers([vmAnswer, vmAnswer1]);
                        viewModel.multiplechoiceCorrectnessUpdatedByCollaborator({ id: 'smth' }, answer.id, false);
                        expect(vmAnswer.isCorrect()).toBeTruthy();
                    });

                });

            });

            describe('when answer is not founded in current answers list', function () {

                it('should not update answer', function () {
                    vmAnswer.isCorrect(true);
                    viewModel.answers([]);
                    viewModel.multiplechoiceCorrectnessUpdatedByCollaborator({ id: questionId }, answer.id, false);
                    expect(vmAnswer.isCorrect()).toBeTruthy();
                });

            });

            describe('when answer is in edit mdode', function () {

                it('should not update answer', function () {
                    viewModel.answers([vmAnswer, vmAnswer1]);
                    viewModel.selectedAnswer(vmAnswer);
                    viewModel.multiplechoiceCorrectnessUpdatedByCollaborator(question, answer.id, false);
                    expect(vmAnswer.isCorrect()).toBeTruthy();
                });

                it('should mark answer as deleted', function () {
                    vmAnswer.isDeleted(false);
                    viewModel.answers([vmAnswer, vmAnswer1]);
                    viewModel.selectedAnswer(vmAnswer);
                    viewModel.multiplechoiceCorrectnessUpdatedByCollaborator(question, answer.id);
                    expect(vmAnswer.isDeleted).toBeTruthy();
                });

            });

        });

        describe('clearSelection:', function () {

            beforeEach(function () {
                viewModel = ctor(questionId, []);
            });

            it('should be function', function () {
                expect(viewModel.clearSelection).toBeFunction();
            });

            it('should return promise', function () {
                var result = viewModel.clearSelection();
                expect(result).toBePromise();
            });

            it('should set selectedAnswer to null', function (done) {
                var answer = { id: ko.observable('answerId'), text: ko.observable('test'), isCorrect: ko.observable(false), original: { text: 'test', correctness: false } };
                viewModel.selectedAnswer(answer);

                viewModel.clearSelection().fin(function () {
                    expect(viewModel.selectedAnswer()).toBe(null);
                    done();
                });
            });
        });

        describe('removeAnswer:', function () {

            var removeAnswer;
            var answer,
                answer1;

            beforeEach(function () {
                viewModel = ctor(questionId, []);
                removeAnswer = Q.defer();
                spyOn(repository, 'removeAnswer').and.returnValue(removeAnswer.promise);
            });

            it('should be function', function () {
                expect(viewModel.removeAnswer).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.removeAnswer()).toBePromise();
            });

            it('should send event \'Delete answer option\'', function () {
                viewModel.removeAnswer();
                expect(eventTracker.publish).toHaveBeenCalledWith('Delete answer option');
            });

            describe('when answer id is set', function () {

                beforeEach(function () {
                    answer = { id: ko.observable('answerId'), text: ko.observable('test'), isCorrect: ko.observable(false), original: { correctness: false }, isDeleted: ko.observable(false) };
                    answer1 = { id: ko.observable('answerId1'), text: ko.observable('test1'), isCorrect: ko.observable(true), original: { correctness: false }, isDeleted: ko.observable(false) };
                });

                describe('when answer is deleted by collaborator', function () {
                    it('should not remove answer from repository', function (done) {
                        answer.isDeleted(true);
                        viewModel.removeAnswer(answer).fin(function () {
                            expect(repository.removeAnswer).not.toHaveBeenCalled();
                            done();
                        });
                    });
                });

                it('should remove answer from the repository', function (done) {
                    viewModel.removeAnswer(answer).fin(function () {
                        expect(repository.removeAnswer).toHaveBeenCalledWith(questionId, answer.id());
                        done();
                    });
                });

                it('should remove answer from the viewModel', function (done) {
                    viewModel.answers([answer]);

                    viewModel.removeAnswer(answer).fin(function () {
                        expect(viewModel.answers().length).toEqual(0);
                        done();
                    });
                });

                it('should show notification', function (done) {
                    removeAnswer.resolve({ modifiedOn: new Date() });
                    viewModel.removeAnswer(answer).fin(function () {
                        expect(notify.saved).toHaveBeenCalled();
                        done();
                    });
                });

                describe('when answer is correct', function () {

                    it('should set first answer to correct', function (done) {
                        viewModel.answers([answer, answer1]);
                        answer.isCorrect(true);
                        removeAnswer.resolve({ modifiedOn: new Date() });
                        viewModel.removeAnswer(answer).fin(function () {
                            expect(answer1.isCorrect()).toBeTruthy();
                            done();
                        });
                    });

                });

            });

            describe('when answer id is not set initially', function () {
                var answerWithoutId;
                beforeEach(function () {
                    answerWithoutId = { id: ko.observable(''), text: ko.observable('test'), isCorrect: ko.observable(false), original: { correctness: false }, isDeleted: ko.observable(false) };
                });

                it('should not remove answer from the viewModel', function (done) {
                    viewModel.answers([answerWithoutId]);

                    viewModel.removeAnswer(answerWithoutId).fin(function () {
                        expect(viewModel.answers().length).toEqual(1);
                        done();
                    });
                });

                it('should not show notification', function (done) {
                    viewModel.answers([answerWithoutId]);
                    removeAnswer.resolve({ modifiedOn: new Date() });

                    viewModel.removeAnswer(answerWithoutId).fin(function () {
                        expect(notify.saved).not.toHaveBeenCalled();
                        done();
                    });
                });

                describe('and answer id is set later', function () {

                    it('should remove answer from the repository', function (done) {
                        viewModel.answers([answerWithoutId]);

                        viewModel.removeAnswer(answerWithoutId).fin(function () {
                            answerWithoutId.id('answerId');
                            expect(repository.removeAnswer).toHaveBeenCalledWith(questionId, answer.id());
                            done();
                        });
                    });

                    it('should remove answer from the viewModel', function (done) {
                        viewModel.answers([answerWithoutId]);

                        viewModel.removeAnswer(answerWithoutId).fin(function () {
                            answerWithoutId.id('answerId');
                            expect(viewModel.answers().length).toEqual(0);
                            done();
                        });
                    });

                    it('should show notification', function (done) {
                        viewModel.answers([answerWithoutId]);
                        removeAnswer.resolve({ modifiedOn: new Date() });
                        answerWithoutId.id('answerId');

                        viewModel.removeAnswer(answerWithoutId).fin(function () {
                            expect(notify.saved).toHaveBeenCalled();
                            done();
                        });
                    });

                });
            });
        });

        describe('updateText:', function () {

            var addAnswer;
            var updateText;
            var removeAnswer;

            beforeEach(function () {
                viewModel = ctor(questionId, []);

                addAnswer = Q.defer();
                updateText = Q.defer();
                removeAnswer = Q.defer();

                spyOn(repository, 'addAnswer').and.returnValue(addAnswer.promise);
                spyOn(repository, 'updateText').and.returnValue(updateText.promise);
                spyOn(repository, 'removeAnswer').and.returnValue(removeAnswer.promise);
            });

            it('should be function', function () {
                expect(viewModel.updateText).toBeFunction();
            });

            describe('when answer is marked as deleted', function () {
                var answer;
                beforeEach(function () {
                    answer = { id: ko.observable('answerId'), text: ko.observable(''), isCorrect: ko.observable(false), original: {}, isDeleted: ko.observable(true) }
                });

                it('should delete answer', function (done) {
                    viewModel.answers([answer]);

                    viewModel.updateText(answer).fin(function () {
                        expect(viewModel.answers().length).toBe(0);
                        done();
                    });
                });
            });

            describe('when text is empty', function () {
                var answer = { id: ko.observable('answerId'), text: ko.observable(''), isCorrect: ko.observable(false), original: { correctness: false }, isDeleted: ko.observable(false) };
                var answer1 = { id: ko.observable('answerId1'), text: ko.observable('22'), isCorrect: ko.observable(false), original: { correctness: false }, isDeleted: ko.observable(false) };
                var answer2 = { id: ko.observable('answerId2'), text: ko.observable('222'), isCorrect: ko.observable(false), original: { correctness: false }, isDeleted: ko.observable(false) };

                describe('and length of answer option equal 2', function () {

                    it('should not update text', function () {
                        viewModel.answers([answer, answer1]);
                        viewModel.updateText(answer).fin(function () {
                            expect(repository.updateText).not.toHaveBeenCalled();
                            done();
                        });
                    });

                });

                describe('and id is not empty', function () {

                    it('should remove answer from the repository', function (done) {

                        answer.text('');
                        viewModel.answers([answer, answer1, answer2]);

                        viewModel.updateText(answer).fin(function () {
                            expect(repository.removeAnswer).toHaveBeenCalledWith(questionId, answer.id());
                            done();
                        });
                    });

                    it('should show notification', function (done) {
                        answer.text('');
                        viewModel.answers([answer, answer1, answer2]);
                        removeAnswer.resolve({ modifiedOn: new Date() });

                        viewModel.updateText(answer).fin(function () {
                            expect(notify.saved).toHaveBeenCalled();
                            done();
                        });
                    });

                    it('should set first answer to correct', function (done) {
                        answer.text('');
                        answer.isCorrect(true);
                        viewModel.answers([answer, answer1, answer2]);
                        removeAnswer.resolve({ modifiedOn: new Date() });

                        viewModel.updateText(answer).fin(function () {
                            expect(answer1.isCorrect()).toBeTruthy();
                            done();
                        });
                    });

                });

                describe('and id is empty', function () {

                    it('should set first answer to correct', function (done) {
                        answer.text('');
                        answer.id('');
                        answer.isCorrect(true);
                        viewModel.answers([answer, answer1, answer2]);
                        removeAnswer.resolve({ modifiedOn: new Date() });

                        viewModel.updateText(answer).fin(function () {
                            expect(answer1.isCorrect()).toBeTruthy();
                            done();
                        });
                    });

                });

                it('should remove answer from the viewModel', function (done) {
                    answer.text('');
                    viewModel.answers([answer, answer1, answer2]);

                    viewModel.updateText(answer).fin(function () {
                        expect(viewModel.answers().length).toEqual(2);
                        done();
                    });
                });

            });

            describe('when text is not empty', function () {

                describe('and id is not empty', function () {
                    var answer = { id: ko.observable('answerId'), text: ko.observable('text'), isCorrect: ko.observable(false), original: { correctness: false }, isDeleted: ko.observable(false) };
                    var answer1 = { id: ko.observable('answerId1'), text: ko.observable('22'), isCorrect: ko.observable(false), original: { correctness: false }, isDeleted: ko.observable(false) };
                    var answer2 = { id: ko.observable('answerId2'), text: ko.observable('222'), isCorrect: ko.observable(false), original: { correctness: false }, isDeleted: ko.observable(false) };

                    describe('when text is not modified', function () {
                        beforeEach(function () {
                            answer.original.text = 'text';
                        });

                        describe('and correctness is not modified', function () {
                            beforeEach(function () {
                                answer.original.correctness = false;
                            });

                            it('should not update answer in the repository', function (done) {
                                updateText.resolve();

                                viewModel.updateText(answer).fin(function () {
                                    expect(repository.updateText).not.toHaveBeenCalledWith();
                                    done();
                                });
                            });
                        });

                        describe('and correctness is modified', function () {
                            beforeEach(function () {
                                answer.original.correctness = true;
                                answer.text('text1');
                                answer.id('boo');
                            });

                            it('should update answer in the repository', function (done) {
                                updateText.resolve();
                                viewModel.updateText(answer).fin(function () {
                                    expect(repository.updateText).toHaveBeenCalledWith(questionId, answer.id(), answer.text());
                                    done();
                                });
                            });

                            it('should show notification', function (done) {
                                updateText.resolve({ modifiedOn: new Date() });

                                viewModel.updateText(answer).fin(function () {
                                    expect(notify.saved).toHaveBeenCalled();
                                    done();
                                });
                            });
                        });

                    });

                    describe('when text is modified', function () {
                        beforeEach(function () {
                            answer.original.text = 'text old';
                        });

                        describe('and correctness is not modified', function () {
                            beforeEach(function () {
                                answer.original.correctness = false;
                            });

                            it('should update answer in the repository11', function (done) {
                                updateText.resolve();

                                viewModel.updateText(answer).fin(function () {
                                    expect(repository.updateText).toHaveBeenCalledWith(questionId, answer.id(), answer.text());
                                    done();
                                });
                            });
                        });

                        describe('and correctness is modified', function () {
                            beforeEach(function () {
                                answer.original.correctness = true;
                            });

                            it('should update answer in the repository', function (done) {
                                updateText.resolve();

                                viewModel.updateText(answer).fin(function () {
                                    expect(repository.updateText).toHaveBeenCalledWith(questionId, answer.id(), answer.text());
                                    done();
                                });
                            });
                        });


                        it('should show notification', function (done) {
                            updateText.resolve({ modifiedOn: new Date() });

                            viewModel.updateText(answer).fin(function () {
                                expect(notify.saved).toHaveBeenCalled();
                                done();
                            });
                        });
                    });
                });

                describe('and id is empty', function () {

                    var id = 'id',
                        answer;

                    beforeEach(function () {
                        answer = { id: ko.observable(''), text: ko.observable('text'), isCorrect: ko.observable(true), isDeleted: ko.observable(false) };
                    });

                    it('should add answer to the repository', function (done) {
                        viewModel.updateText(answer).fin(function () {
                            expect(repository.addAnswer).toHaveBeenCalledWith(questionId, { text: answer.text(), isCorrect: true });
                            done();
                        });
                    });

                    it('should update answer id in the viewModel', function (done) {
                        addAnswer.resolve({ id: id, createdOn: new Date() });

                        viewModel.updateText(answer).fin(function () {
                            expect(answer.id()).toEqual(id);
                            done();
                        });
                    });

                    it('should show notification', function (done) {
                        addAnswer.resolve({ id: id, createdOn: new Date() });

                        viewModel.updateText(answer).fin(function () {
                            expect(notify.saved).toHaveBeenCalled();
                            done();
                        });
                    });
                });
            });
        });

    });
})