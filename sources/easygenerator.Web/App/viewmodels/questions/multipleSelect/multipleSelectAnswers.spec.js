import ctor from './multipleSelectAnswers';

import eventTracker from 'eventTracker';
import repository from 'repositories/answerRepository';
import notify from 'notify';

describe('viewModel [multipleSelectAnswers]', function () {

    var viewModel;
    var questionId = 'questionId';

    beforeEach(function () {
        spyOn(notify, 'saved');
        spyOn(notify, 'error');
        spyOn(eventTracker, 'publish');
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
    });

    describe('removeAnswer:', function () {

        var removeAnswer;
        var answer;

        beforeEach(function () {
            viewModel = ctor(questionId, []);
            removeAnswer = Q.defer();
            spyOn(repository, 'removeAnswer').and.returnValue(removeAnswer.promise);
        });

        it('should be function', function () {
            expect(viewModel.removeAnswer).toBeFunction();
        });

        it('should send event \'Delete answer option\'', function () {
            answer = {
                id: ko.observable('answerId'),
                text: ko.observable('test'),
                isDeleted: ko.observable(false)
            };

            viewModel.removeAnswer(answer);
            expect(eventTracker.publish).toHaveBeenCalledWith('Delete answer option');
        });

        describe('when answer id is set', function () {
            beforeEach(function () {
                answer = {
                    id: ko.observable('answerId'),
                    text: ko.observable('test'),
                    isDeleted: ko.observable(false)
                };
            });

            describe('when answer is deleted by collaborator', function () {
                it('should not remove answer from repository', function () {
                    answer.isDeleted(true);
                    viewModel.removeAnswer(answer);
                    expect(repository.removeAnswer).not.toHaveBeenCalled();
                });
            });
                
            it('should remove answer from the repository', function () {
                viewModel.removeAnswer(answer);
                expect(repository.removeAnswer).toHaveBeenCalledWith(questionId, answer.id());
            });

            it('should remove answer from the viewModel', function () {
                viewModel.answers([answer]);
                viewModel.removeAnswer(answer);
                expect(viewModel.answers().length).toEqual(0);
            });

            it('should show notification', function (done) {
                removeAnswer.resolve({ modifiedOn: new Date() });

                viewModel.removeAnswer(answer);
                removeAnswer.promise.fin(function () {
                    expect(notify.saved).toHaveBeenCalled();
                    done();
                });
            });

        });

        describe('when answer id is not set initially', function () {
            var answerWithoutId;
            beforeEach(function () {
                answerWithoutId = {
                    id: ko.observable(''),
                    text: ko.observable('test'),
                    isDeleted: ko.observable(false)
                };
            });

            it('should not remove answer from the repository', function () {
                viewModel.answers([answerWithoutId]);

                viewModel.removeAnswer(answerWithoutId);
                expect(repository.removeAnswer).not.toHaveBeenCalled();
            });

            it('should not remove answer from the viewModel', function () {
                viewModel.answers([answerWithoutId]);

                viewModel.removeAnswer(answerWithoutId);
                expect(viewModel.answers().length).toEqual(1);
            });

            it('should not show notification', function (done) {
                viewModel.answers([answerWithoutId]);
                removeAnswer.resolve({ modifiedOn: new Date() });

                viewModel.removeAnswer(answerWithoutId);
                removeAnswer.promise.fin(function () {
                    expect(notify.saved).not.toHaveBeenCalled();
                    done();
                });
            });

            describe('and answer id is set later', function () {

                it('should remove answer from the repository', function () {
                    viewModel.answers([answerWithoutId]);
                    answerWithoutId.id('answerId');

                    viewModel.removeAnswer(answerWithoutId);
                    expect(repository.removeAnswer).toHaveBeenCalledWith(questionId, answer.id());
                });

                it('should remove answer from the viewModel', function () {
                    viewModel.answers([answerWithoutId]);
                    answerWithoutId.id('answerId');

                    viewModel.removeAnswer(answerWithoutId);
                    expect(viewModel.answers().length).toEqual(0);
                });

                it('should show notification', function (done) {
                    viewModel.answers([answerWithoutId]);
                    removeAnswer.resolve({ modifiedOn: new Date() });
                    answerWithoutId.id('answerId');

                    viewModel.removeAnswer(answerWithoutId);
                    removeAnswer.promise.fin(function () {
                        expect(notify.saved).toHaveBeenCalled();
                        done();
                    });
                });

            });
        });
    });

    describe('updateAnswer:', function () {

        var addAnswer;
        var updateAnswer;
        var removeAnswer;

        beforeEach(function () {
            viewModel = ctor(questionId, []);

            addAnswer = Q.defer();
            updateAnswer = Q.defer();
            removeAnswer = Q.defer();

            spyOn(repository, 'addAnswer').and.returnValue(addAnswer.promise);
            spyOn(repository, 'updateAnswer').and.returnValue(updateAnswer.promise);
            spyOn(repository, 'removeAnswer').and.returnValue(removeAnswer.promise);
        });

        it('should be function', function () {
            expect(viewModel.updateAnswer).toBeFunction();
        });

        describe('when answer is marked as deleted', function () {
            var answer;
            beforeEach(function () {
                answer = { id: ko.observable('answerId'), text: ko.observable(''), isCorrect: ko.observable(false), original: {}, isDeleted: ko.observable(true) }
            });

            it('should delete answer', function (done) {
                viewModel.answers([answer]);

                viewModel.updateAnswer(answer).fin(function () {
                    expect(viewModel.answers().length).toBe(0);
                    done();
                });
            });
        });

        describe('when text is empty', function () {
            var answer = { id: ko.observable('answerId'), text: ko.observable(''), isCorrect: ko.observable(false), original: {}, isDeleted: ko.observable(false) };

            describe('and id is not empty', function () {

                it('should remove answer from the repository', function (done) {
                    viewModel.answers([answer]);

                    viewModel.updateAnswer(answer).fin(function () {
                        expect(repository.removeAnswer).toHaveBeenCalledWith(questionId, answer.id());
                        done();
                    });
                });

                it('should show notification', function (done) {
                    viewModel.answers([answer]);
                    removeAnswer.resolve({ modifiedOn: new Date() });

                    viewModel.updateAnswer(answer).fin(function () {
                        expect(notify.saved).toHaveBeenCalled();
                        done();
                    });
                });

            });

            it('should remove answer from the viewModel', function (done) {
                viewModel.answers([answer]);

                viewModel.updateAnswer(answer).fin(function () {
                    expect(viewModel.answers().length).toEqual(0);
                    done();
                });
            });

        });

        describe('when text is not empty', function () {

            describe('and id is not empty', function () {
                var answer = { id: ko.observable('answerId'), text: ko.observable('text'), isCorrect: ko.observable(false), original: {}, isDeleted: ko.observable(false) };

                describe('when text is not modified', function () {
                    beforeEach(function () {
                        answer.original.text = 'text';
                    });

                    describe('and correctness is not modified', function () {
                        beforeEach(function () {
                            answer.original.correctness = false;
                        });

                        it('should not update answer in the repository', function (done) {
                            updateAnswer.resolve();

                            viewModel.updateAnswer(answer).fin(function () {
                                expect(repository.updateAnswer).not.toHaveBeenCalledWith();
                                done();
                            });
                        });
                    });

                    describe('and correctness is modified', function () {
                        beforeEach(function () {
                            answer.original.correctness = true;
                        });

                        it('should update answer in the repository', function (done) {
                            updateAnswer.resolve();

                            viewModel.updateAnswer(answer).fin(function () {
                                expect(repository.updateAnswer).toHaveBeenCalledWith(questionId, answer.id(), answer.text(), false);
                                done();
                            });
                        });

                        it('should show notification', function (done) {
                            updateAnswer.resolve({ modifiedOn: new Date() });

                            viewModel.updateAnswer(answer).fin(function () {
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
                            updateAnswer.resolve();

                            viewModel.updateAnswer(answer).fin(function () {
                                expect(repository.updateAnswer).toHaveBeenCalledWith(questionId, answer.id(), answer.text(), false);
                                done();
                            });
                        });
                    });

                    describe('and correctness is modified', function () {
                        beforeEach(function () {
                            answer.original.correctness = true;
                        });

                        it('should update answer in the repository', function (done) {
                            updateAnswer.resolve();

                            viewModel.updateAnswer(answer).fin(function () {
                                expect(repository.updateAnswer).toHaveBeenCalledWith(questionId, answer.id(), answer.text(), false);
                                done();
                            });
                        });
                    });


                    it('should show notification', function (done) {
                        updateAnswer.resolve({ modifiedOn: new Date() });

                        viewModel.updateAnswer(answer).fin(function () {
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
                    viewModel.updateAnswer(answer).fin(function () {
                        expect(repository.addAnswer).toHaveBeenCalledWith(questionId, { text: answer.text(), isCorrect: true });
                        done();
                    });
                });

                it('should update answer id in the viewModel', function (done) {
                    addAnswer.resolve({ id: id, createdOn: new Date() });

                    viewModel.updateAnswer(answer).fin(function () {
                        expect(answer.id()).toEqual(id);
                        done();
                    });
                });

                it('should show notification', function (done) {
                    addAnswer.resolve({ id: id, createdOn: new Date() });

                    viewModel.updateAnswer(answer).fin(function () {
                        expect(notify.saved).toHaveBeenCalled();
                        done();
                    });
                });
            });
        });
    });

    describe('toggleCorrectness:', function () {

        var answer;
        beforeEach(function () {
            viewModel = ctor(questionId, []);
            answer = { id: ko.observable('answerId'), isCorrect: ko.observable(false) };
        });

        it('should be function', function () {
            expect(viewModel.toggleCorrectness).toBeFunction();
        });

        it('should send event \'Change answer option correctness\'', function () {
            viewModel.toggleCorrectness(answer);
            expect(eventTracker.publish).toHaveBeenCalledWith('Change answer option correctness');
        });

        it('should update answer correctness in the viewModel', function () {
            viewModel.toggleCorrectness(answer);

            expect(answer.isCorrect()).toBeTruthy();
        });
    });

    describe('deletedByCollaborator:', function () {
        var answer = { id: 'id', text: 'text', isCorrect: true },
            question = { id: questionId },
            vmAnswer = {
                id: ko.observable(answer.id),
                isDeleted: ko.observable(false),
                hasFocus: ko.observable(false)
            };

        beforeEach(function () {
            viewModel = ctor(questionId, []);
        });

        it('should be function', function () {
            expect(viewModel.deletedByCollaborator).toBeFunction();
        });

        describe('when question is not current question', function () {
            it('should not delete answer', function () {
                viewModel.answers([vmAnswer]);
                viewModel.deletedByCollaborator({ id: 'smth' }, answer.id);
                expect(viewModel.answers().length).toEqual(1);
            });
        });

        describe('when answer option is in edit mode', function () {
            beforeEach(function() {
                vmAnswer.hasFocus(true);
            });

            it('should not delete answer', function () {
                viewModel.answers([vmAnswer]);
                viewModel.deletedByCollaborator(question, answer.id);
                expect(viewModel.answers().length).toEqual(1);
            });

            it('should mark answer as deleted', function () {
                vmAnswer.isDeleted(false);
                viewModel.answers([vmAnswer]);
                viewModel.deletedByCollaborator(question, answer.id);
                expect(vmAnswer.isDeleted).toBeTruthy();
            });

            it('should show notification', function () {
                viewModel.answers([vmAnswer]);
                viewModel.deletedByCollaborator(question, answer.id);
                expect(notify.error).toHaveBeenCalled();
            });
        });

        it('should remove answer', function () {
            vmAnswer.hasFocus(false);
            viewModel.answers([vmAnswer]);
            viewModel.deletedByCollaborator(question, answer.id);
            expect(viewModel.answers().length).toEqual(0);
        });

    });

    describe('answerCorrectnessUpdatedByCollaborator:', function () {
        var text = 'text',
            answer = { id: 'id', text: text, isCorrect: true },
            question = { id: questionId },
            vmAnswer = {
                id: ko.observable(answer.id),
                isDeleted: ko.observable(false),
                isCorrect: ko.observable(true),
                hasFocus: ko.observable(false),
                original: { isCorect: true }
            };

        beforeEach(function () {
            viewModel = ctor(questionId, []);
        });

        it('should be function', function () {
            expect(viewModel.answerCorrectnessUpdatedByCollaborator).toBeFunction();
        });

        describe('when question is not current question', function () {
            it('should not update answer', function () {
                viewModel.answers([vmAnswer]);
                viewModel.answerCorrectnessUpdatedByCollaborator({ id: 'smth' }, answer.id, false);
                expect(vmAnswer.isCorrect()).toBeTruthy();
            });
        });

        describe('when answer is in edit mdode', function () {
            beforeEach(function() {
                vmAnswer.hasFocus(true);
            });

            it('should not update answer', function () {
                viewModel.answers([vmAnswer]);
                viewModel.answerCorrectnessUpdatedByCollaborator(question, answer.id, false);
                expect(vmAnswer.isCorrect()).toBeTruthy();
            });

            it('should update original correctness', function () {
                vmAnswer.original.isCorect = true;
                viewModel.answers([vmAnswer]);
                viewModel.answerCorrectnessUpdatedByCollaborator(question, answer.id, false);
                expect(vmAnswer.original.isCorrect).toBeFalsy();
            });
        });

        it('should update answer text', function () {
            vmAnswer.hasFocus(false);
            viewModel.answers([vmAnswer]);

            viewModel.answerCorrectnessUpdatedByCollaborator(question, answer.id, false);
            expect(vmAnswer.isCorrect()).toBeFalsy();
        });

        it('should update original correctness', function () {
            vmAnswer.original.isCorect = true;
            vmAnswer.hasFocus(false);
            viewModel.answers([vmAnswer]);

            viewModel.answerCorrectnessUpdatedByCollaborator(question, answer.id, false);
            expect(vmAnswer.original.isCorrect).toBeFalsy();
        });
    });

});
