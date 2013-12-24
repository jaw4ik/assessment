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

            it('should be function', function() {
                expect(viewModel.selectAnswer).toBeFunction();
            });
            
            it('should return promise', function () {
                viewModel.selectedAnswer(null);
                var result = viewModel.selectAnswer(answer);

                expect(result).toBePromise();
            });

            it('should set selectedAnswer', function () {
                viewModel.selectedAnswer(null);
                var promise = viewModel.selectAnswer(answer);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.selectedAnswer()).toBe(answer);
                });
            });

            describe('when previos selected answer is not changed', function() {
                
                var updateAnswer;

                beforeEach(function () {
                    updateAnswer = Q.defer();
                    spyOn(repository, 'updateAnswer').andReturn(updateAnswer.promise);
                    updateAnswer.resolve(new Date());
                });

                it('should not update answer', function () {
                    viewModel.selectedAnswer(answer);
                    var promise = viewModel.selectAnswer(answer);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(repository.updateAnswer).not.toHaveBeenCalled();
                    });
                });
            });

            describe('when previos selected answer is changed', function () {

                describe('when previous selected answer is not null', function () {
                    var updateAnswer;

                    beforeEach(function () {
                        updateAnswer = Q.defer();
                        spyOn(repository, 'updateAnswer').andReturn(updateAnswer.promise);
                        updateAnswer.resolve(new Date());

                        answer.original.correctness = true;
                    });

                    it('should update answer', function () {
                        viewModel.selectedAnswer(answer);
                        var promise = viewModel.selectAnswer(null);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(repository.updateAnswer).toHaveBeenCalled();
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

            it('should set selectedAnswer to null', function() {
                var answer = { id: ko.observable('answerId'), text: ko.observable('test'), isCorrect: ko.observable(false), original: { text: 'test', correctness: false } };
                viewModel.selectedAnswer(answer);
                
                var promise = viewModel.clearSelection();
                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.selectedAnswer()).toBe(null);
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

            it('should select added answer', function() {
                viewModel.selectedAnswer(null);
                var promise = viewModel.addAnswer();
                
                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.selectedAnswer()).toBe(viewModel.answers()[0]);
                });
            });
        });

        describe('removeAnswer:', function () {

            var removeAnswer;
            var answer;

            beforeEach(function () {
                viewModel = ctor(questionId, []);
                removeAnswer = Q.defer();
                spyOn(repository, 'removeAnswer').andReturn(removeAnswer.promise);
            });

            it('should be function', function () {
                expect(viewModel.removeAnswer).toBeFunction();
            });

            it('should return promise', function() {
                expect(repository.removeAnswer()).toBePromise();
            });

            it('should send event \'Delete answer option\'', function () {
                viewModel.removeAnswer();
                expect(eventTracker.publish).toHaveBeenCalledWith('Delete answer option');
            });

            describe('when answer id is set', function () {

                beforeEach(function () {
                    answer = { id: ko.observable('answerId'), text: ko.observable('test') }
                });

                it('should remove answer from the repository', function () {
                    var promise = viewModel.removeAnswer(answer);
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(repository.removeAnswer).toHaveBeenCalledWith(questionId, answer.id());
                    });
                });

                it('should remove answer from the viewModel', function () {
                    viewModel.answers([answer]);
                    var promise = viewModel.removeAnswer(answer);
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.answers().length).toEqual(0);
                    });
                });

                it('should show notification', function () {
                    var promise = removeAnswer.promise.fin(function () { });
                    removeAnswer.resolve({ modifiedOn: new Date() });

                    viewModel.removeAnswer(answer);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(notify.saved).toHaveBeenCalled();
                    });
                });

            });

            describe('when answer id is not set initially', function () {
                var answerWithoutId;
                beforeEach(function () {
                    answerWithoutId = { id: ko.observable(''), text: ko.observable('test') };
                });

                it('should not remove answer from the repository', function () {
                    viewModel.answers([answerWithoutId]);

                    var promise = viewModel.removeAnswer(answerWithoutId);
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(repository.removeAnswer).not.toHaveBeenCalled();
                    });
                });

                it('should not remove answer from the viewModel', function () {
                    viewModel.answers([answerWithoutId]);

                    var promise = viewModel.removeAnswer(answerWithoutId);
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.answers().length).toEqual(1);
                    });
                });

                it('should not show notification', function () {
                    var promise = removeAnswer.promise.fin(function () { });
                    viewModel.answers([answerWithoutId]);
                    removeAnswer.resolve({ modifiedOn: new Date() });

                    viewModel.removeAnswer(answerWithoutId);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(notify.saved).not.toHaveBeenCalled();
                    });
                });

                describe('and answer id is set later', function () {

                    it('should remove answer from the repository', function () {
                        viewModel.answers([answerWithoutId]);

                        var promise = viewModel.removeAnswer(answerWithoutId);
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            answerWithoutId.id('answerId');
                            expect(repository.removeAnswer).toHaveBeenCalledWith(questionId, answer.id());
                        });
                    });

                    it('should remove answer from the viewModel', function () {
                        viewModel.answers([answerWithoutId]);

                        var promise = viewModel.removeAnswer(answerWithoutId);
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            answerWithoutId.id('answerId');
                            expect(viewModel.answers().length).toEqual(0);
                        });
                    });

                    it('should show notification', function () {
                        var promise = removeAnswer.promise.fin(function () { });
                        viewModel.answers([answerWithoutId]);
                        removeAnswer.resolve({ modifiedOn: new Date() });

                        viewModel.removeAnswer(answerWithoutId);
                        answerWithoutId.id('answerId');

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(notify.saved).toHaveBeenCalled();
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
                spyOn(repository, 'removeAnswer').andReturn(removeAnswer.promise);
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

            beforeEach(function () {
                viewModel = ctor(questionId, []);

                addAnswer = Q.defer();
                updateAnswer = Q.defer();

                spyOn(repository, 'addAnswer').andReturn(addAnswer.promise);
                spyOn(repository, 'updateAnswer').andReturn(updateAnswer.promise);
            });

            it('should be function', function () {
                expect(viewModel.updateAnswer).toBeFunction();
            });

            describe('when text is empty', function () {
                var answer = { id: ko.observable('answerId'), text: ko.observable(''), isCorrect: ko.observable(false), original: {} };

                describe('and id is not empty', function () {
                    var removeAnswer;

                    beforeEach(function() {
                        removeAnswer = Q.defer();
                        spyOn(repository, 'removeAnswer').andReturn(removeAnswer.promise);
                    });

                    it('should remove answer from the repository', function () {
                        viewModel.answers([answer]);
                        var promise = viewModel.updateAnswer(answer);
                        
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(repository.removeAnswer).toHaveBeenCalledWith(questionId, answer.id());
                        });
                    });

                    it('should show notification', function () {
                        var promise = removeAnswer.promise.fin(function () { });
                        viewModel.answers([answer]);
                        removeAnswer.resolve({ modifiedOn: new Date() });

                        viewModel.updateAnswer(answer);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(notify.saved).toHaveBeenCalled();
                        });
                    });

                });

                it('should remove answer from the viewModel', function () {
                    viewModel.answers([answer]);
                    var promise = viewModel.updateAnswer(answer);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.answers().length).toEqual(0);
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
                        
                        describe('and correctness is not modified', function() {
                            beforeEach(function() {
                                answer.original.correctness = false;
                            });
                            
                            it('should not update answer in the repository', function () {
                                updateAnswer.resolve();
                                var promise = viewModel.updateAnswer(answer);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(repository.updateAnswer).not.toHaveBeenCalledWith();
                                });
                            });
                        });

                        describe('and correctness is modified', function () {
                            beforeEach(function () {
                                answer.original.correctness = true;
                            });

                            it('should update answer in the repository', function () {
                                updateAnswer.resolve();
                                var promise = viewModel.updateAnswer(answer);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(repository.updateAnswer).toHaveBeenCalledWith(questionId, answer.id(), answer.text(), false);
                                });
                            });

                            it('should show notification', function () {
                                var promise = updateAnswer.promise.fin(function () { });
                                updateAnswer.resolve({ modifiedOn: new Date() });
                                viewModel.updateAnswer(answer);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(notify.saved).toHaveBeenCalled();
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

                            it('should update answer in the repository', function () {
                                updateAnswer.resolve();
                                var promise = viewModel.updateAnswer(answer);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(repository.updateAnswer).toHaveBeenCalledWith(questionId, answer.id(), answer.text(), false);
                                });
                            });
                        });

                        describe('and correctness is modified', function () {
                            beforeEach(function () {
                                answer.original.correctness = true;
                            });

                            it('should update answer in the repository', function () {
                                updateAnswer.resolve();
                                var promise = viewModel.updateAnswer(answer);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(repository.updateAnswer).toHaveBeenCalledWith(questionId, answer.id(), answer.text(), false);
                                });
                            });
                        });


                        it('should show notification', function () {
                            var promise = updateAnswer.promise.fin(function () { });
                            updateAnswer.resolve({ modifiedOn: new Date() });
                            viewModel.updateAnswer(answer);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(notify.saved).toHaveBeenCalled();
                            });
                        });
                    });
                });

                describe('and id is empty', function () {

                    var id = 'id';

                    it('should add answer to the repository', function () {
                        var answer = { id: ko.observable(''), text: ko.observable('text'), isCorrect: ko.observable(true) };

                        var promise = viewModel.updateAnswer(answer);
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(repository.addAnswer).toHaveBeenCalledWith(questionId, { text: answer.text(), isCorrect: true });
                        });
                    });

                    it('should update answer id in the viewModel', function () {
                        var answer = { id: ko.observable(''), text: ko.observable('text') };
                        var promise = addAnswer.promise.fin(function () { });
                        addAnswer.resolve({ id: id, createdOn: new Date() });

                        viewModel.updateAnswer(answer);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(answer.id()).toEqual(id);
                        });
                    });

                    it('should show notification', function () {
                        var answer = { id: ko.observable(''), text: ko.observable('text') };
                        var promise = addAnswer.promise.fin(function () { });
                        addAnswer.resolve({ id: id, createdOn: new Date() });

                        viewModel.updateAnswer(answer);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(notify.saved).toHaveBeenCalled();
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