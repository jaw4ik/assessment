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
            spyOn(notify, 'info');
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

            beforeEach(function () {
                viewModel = ctor(questionId, []);
            });

            var removeAnswer;

            beforeEach(function () {
                removeAnswer = Q.defer();
                spyOn(repository, 'removeAnswer').andReturn(removeAnswer.promise);
            });

            it('should be function', function () {
                expect(viewModel.removeAnswer).toBeFunction();
            });

            it('should send event \'Delete answer option\'', function () {
                viewModel.removeAnswer({});
                expect(eventTracker.publish).toHaveBeenCalledWith('Delete answer option');
            });

            it('should remove answer from the repository', function () {
                var answer = { id: ko.observable('answerId'), text: ko.observable('') };
                viewModel.answers([answer]);

                viewModel.removeAnswer(answer);

                expect(repository.removeAnswer).toHaveBeenCalledWith(questionId, answer.id());
            });

            it('should remove answer from the viewModel', function () {
                var answer = {};
                viewModel.answers([answer]);

                viewModel.removeAnswer(answer);

                expect(viewModel.answers().length).toEqual(0);
            });

            it('should show notification', function () {
                var promise = removeAnswer.promise.fin(function () { });
                var answer = {};
                viewModel.answers([answer]);
                removeAnswer.resolve({ modifiedOn: new Date() });

                viewModel.removeAnswer(answer);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(notify.info).toHaveBeenCalled();
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

            describe('when text is empty', function () {

                describe('and id is not empty', function () {

                    it('should remove answer from the repository', function () {
                        var answer = { id: ko.observable('answerId'), text: ko.observable(''), hasFocus: ko.observable(true) };
                        viewModel.answers([answer]);

                        viewModel.endEditText(answer);

                        expect(repository.removeAnswer).toHaveBeenCalledWith(questionId, answer.id());
                    });

                    it('should show notification', function () {
                        var promise = removeAnswer.promise.fin(function () { });
                        var answer = { id: ko.observable('answerId'), text: ko.observable(''), hasFocus: ko.observable(true) };
                        viewModel.answers([answer]);
                        removeAnswer.resolve({ modifiedOn: new Date() });

                        viewModel.endEditText(answer);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(notify.info).toHaveBeenCalled();
                        });
                    });

                });

                it('should remove answer from the viewModel', function () {
                    var answer = { id: ko.observable('answerId'), text: ko.observable(''), hasFocus: ko.observable(true) };
                    viewModel.answers([answer]);

                    viewModel.endEditText(answer);

                    expect(viewModel.answers().length).toEqual(0);
                });

            });
        });

        describe('updateText:', function () {

            var addAnswer;
            var updateAnswerText;

            beforeEach(function () {
                viewModel = ctor(questionId, []);

                addAnswer = Q.defer();
                updateAnswerText = Q.defer();

                spyOn(repository, 'addAnswer').andReturn(addAnswer.promise);
                spyOn(repository, 'updateText').andReturn(updateAnswerText.promise);
            });

            it('should be function', function () {
                expect(viewModel.updateText).toBeFunction();
            });

            describe('when text is not empty', function () {

                describe('and id is not empty', function () {

                    var answer = { id: ko.observable('answerId'), text: ko.observable('text') };

                    describe('and text is not modified', function () {

                        it('should not update answer text in the repository', function () {
                            answer.originalText = 'text';
                            viewModel.updateText(answer);
                            expect(repository.updateText).not.toHaveBeenCalledWith(questionId, answer.id(), answer.text());
                        });

                    });

                    describe('and text is modified', function () {

                        beforeEach(function () {
                            answer.originalText = '';
                        });

                        it('should update answer text in the repository', function () {
                            var promise = updateAnswerText.promise.fin(function () { });
                            updateAnswerText.resolve(new Date());
                            viewModel.updateText(answer);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(repository.updateText).toHaveBeenCalledWith(questionId, answer.id(), answer.text());
                            });
                        });

                        it('should show notification', function () {
                            var promise = updateAnswerText.promise.fin(function () { });
                            updateAnswerText.resolve({ modifiedOn: new Date() });
                            viewModel.updateText(answer);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(notify.info).toHaveBeenCalled();
                            });
                        });

                    });

                });

                describe('and id is empty', function () {

                    var id = 'id';

                    it('should add answer to the repository', function () {
                        var answer = { id: ko.observable(''), text: ko.observable('text') };

                        viewModel.updateText(answer);
                        expect(repository.addAnswer).toHaveBeenCalledWith(questionId, { text: answer.text(), isCorrect: false });
                    });

                    it('should update answer id in the viewModel', function () {
                        var answer = { id: ko.observable(''), text: ko.observable('text') };
                        var promise = addAnswer.promise.fin(function () { });
                        addAnswer.resolve({ id: id, createdOn: new Date() });

                        viewModel.updateText(answer);

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

                        viewModel.updateText(answer);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(notify.info).toHaveBeenCalled();
                        });
                    });

                });

            });

        });

        describe('toggleCorrectness', function () {

            var updateCorrectness;

            beforeEach(function () {
                viewModel = ctor(questionId, []);

                updateCorrectness = Q.defer();
                spyOn(repository, 'updateCorrectness').andReturn(updateCorrectness.promise);
            });

            it('should be function', function () {
                expect(viewModel.toggleCorrectness).toBeFunction();
            });

            it('should send event \'Change answer option correctness\'', function () {
                var answer = { id: ko.observable('answerId'), isCorrect: ko.observable(false) };
                viewModel.toggleCorrectness(answer);
                expect(eventTracker.publish).toHaveBeenCalledWith('Change answer option correctness');
            });

            it('should update answer correctness in the repository', function () {
                var answer = { id: ko.observable('answerId'), isCorrect: ko.observable(false) };

                viewModel.toggleCorrectness(answer);

                expect(repository.updateCorrectness).toHaveBeenCalledWith(questionId, answer.id(), true);
            });

            it('should update answer correctness in the viewModel', function () {
                var answer = { id: ko.observable('answerId'), isCorrect: ko.observable(false) };

                viewModel.toggleCorrectness(answer);

                expect(answer.isCorrect()).toBeTruthy();
            });

            it('should show notification', function () {
                var promise = updateCorrectness.promise.fin(function () { });
                var answer = { id: ko.observable('answerId'), isCorrect: ko.observable(false) };
                notify.info.reset();
                updateCorrectness.resolve({ modifiedOn: new Date() });

                viewModel.toggleCorrectness(answer);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(notify.info).toHaveBeenCalled();
                });
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