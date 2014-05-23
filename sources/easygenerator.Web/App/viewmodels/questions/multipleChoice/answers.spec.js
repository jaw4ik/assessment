define(function (require) {
    "use strict";

    var
        ctor = require('viewmodels/questions/multipleChoice/answers'),
        repository = require('repositories/answerRepository'),
        eventTracker = require('eventTracker'),
        notify = require('notify')
    ;

    describe('viewModel [answers]', function () {

        var viewModel;
        var questionId = 'questionId';

        beforeEach(function () {
            spyOn(notify, 'saved');
            spyOn(eventTracker, 'publish');
        });

        describe('answers:', function () {

            beforeEach(function () {
                viewModel = ctor(questionId, []);
            });

            it('should be observable array', function () {
                expect(viewModel.answers).toBeObservable();
            });

        });

        describe('selectedAnswer:', function () {

            beforeEach(function () {
                viewModel = ctor(questionId, []);
            });

            it('should be observable', function () {
                expect(viewModel.selectedAnswer).toBeObservable();
            });
        });

        describe('selectAnswer:', function () {
            var answer = { id: ko.observable('answerId'), text: ko.observable('test'), isCorrect: ko.observable(false), original: { text: 'old', correctness: true } };

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

                var updateAnswer;

                beforeEach(function () {
                    updateAnswer = Q.defer();
                    spyOn(repository, 'updateAnswer').and.returnValue(updateAnswer.promise);
                    updateAnswer.resolve(new Date());
                });

                it('should not update answer', function (done) {
                    viewModel.selectedAnswer(answer);

                    viewModel.selectAnswer(answer).fin(function () {
                        expect(repository.updateAnswer).not.toHaveBeenCalled();
                        done();
                    });
                });
            });

            describe('when previos selected answer is changed', function () {

                describe('when previous selected answer is not null', function () {
                    var updateAnswer;

                    beforeEach(function () {
                        updateAnswer = Q.defer();
                        spyOn(repository, 'updateAnswer').and.returnValue(updateAnswer.promise);
                        updateAnswer.resolve(new Date());

                        answer.original.correctness = true;
                    });

                    it('should update answer', function (done) {
                        viewModel.selectedAnswer(answer);

                        viewModel.selectAnswer(null).fin(function () {
                            expect(repository.updateAnswer).toHaveBeenCalled();
                            done();
                        });
                    });
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

            it('should return promise', function () {
                expect(repository.removeAnswer()).toBePromise();
            });

            it('should send event \'Delete answer option\'', function () {
                viewModel.removeAnswer();
                expect(eventTracker.publish).toHaveBeenCalledWith('Delete answer option');
            });

            describe('when answer id is set', function () {

                beforeEach(function () {
                    answer = { id: ko.observable('answerId'), text: ko.observable('test') };
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

            });

            describe('when answer id is not set initially', function () {
                var answerWithoutId;
                beforeEach(function () {
                    answerWithoutId = { id: ko.observable(''), text: ko.observable('test') };
                });

                it('should not remove answer from the repository', function (done) {
                    viewModel.answers([answerWithoutId]);

                    viewModel.removeAnswer(answerWithoutId).fin(function () {
                        expect(repository.removeAnswer).not.toHaveBeenCalled();
                        done();
                    });
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

            describe('when text is empty', function () {
                var answer = { id: ko.observable('answerId'), text: ko.observable(''), isCorrect: ko.observable(false), original: {} };

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
                    var answer = { id: ko.observable('answerId'), text: ko.observable('text'), isCorrect: ko.observable(false), original: {} };

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

                    var id = 'id';

                    it('should add answer to the repository', function (done) {
                        var answer = { id: ko.observable(''), text: ko.observable('text'), isCorrect: ko.observable(true) };

                        viewModel.updateAnswer(answer).fin(function () {
                            expect(repository.addAnswer).toHaveBeenCalledWith(questionId, { text: answer.text(), isCorrect: true });
                            done();
                        });
                    });

                    it('should update answer id in the viewModel', function (done) {
                        var answer = { id: ko.observable(''), text: ko.observable('text') };
                        addAnswer.resolve({ id: id, createdOn: new Date() });

                        viewModel.updateAnswer(answer).fin(function () {
                            expect(answer.id()).toEqual(id);
                            done();
                        });
                    });

                    it('should show notification', function (done) {
                        var answer = { id: ko.observable(''), text: ko.observable('text') };
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

    });
})