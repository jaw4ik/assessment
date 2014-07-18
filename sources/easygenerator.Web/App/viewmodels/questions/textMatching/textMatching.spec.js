define(function (require) {
    "use strict";

    var viewModel = require('viewmodels/questions/textMatching/textMatching'),
        notify = require('notify'),
        getTextMatchingAnswersById = require('viewmodels/questions/textMatching/queries/getTextMatchingAnswersById'),
        addTextMatchingAnswer = require('viewmodels/questions/textMatching/commands/addAnswer'),
        removeTextMatchingAnswer = require('viewmodels/questions/textMatching/commands/removeAnswer');
    

    describe('question [textMatching]', function () {
        beforeEach(function() {
            spyOn(notify, 'saved');
        });

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });
        
        describe('initialize:', function () {
            var objectiveId = 'objectiveId';
            var question = { id: 'questionId'};
            var dfd;

            beforeEach(function () {
                dfd = Q.defer();
                spyOn(getTextMatchingAnswersById, 'execute').and.returnValue(dfd.promise);
            });

            it('should return promise', function () {
                var promise = viewModel.initialize(objectiveId, question);
                expect(promise).toBePromise();
            });

            it('should initialize field', function () {
                viewModel.initialize(objectiveId, question);
                expect(viewModel.objectiveId).toBe(objectiveId);
                expect(viewModel.questionId).toBe(question.id);
                expect(viewModel.isExpanded()).toBeTruthy();
            });

            describe('when textMatching does not have answers', function () {

                beforeEach(function () {
                    dfd.resolve(undefined);
                });

                it('should set an empty answers collection', function (done) {
                    viewModel.answers([{}, {}, {}]);
                    viewModel.initialize(objectiveId, question).fin(function () {
                        expect(viewModel.answers().length).toEqual(0);
                        done();
                    });
                });

            });

            describe('when textMatching has answers', function () {
                var answer1 = { Id: 'answerId1', Key: 'key1', Value: 'value1', CreatedOn: new Date(2014, 7, 10) },
                    answer2 = { Id: 'answerId2', Key: 'key2', Value: 'value2', CreatedOn: new Date(2014, 7, 8) }

                beforeEach(function() {
                    viewModel.answers([]);
                    dfd.resolve({ answers: [answer1, answer2] });
                });

                it('should set answers collection', function (done) {
                    viewModel.initialize(objectiveId, question).fin(function () {
                        expect(viewModel.answers().length).toEqual(2);
                        done();
                    });
                });

                it('should sort answers by CreatedOn', function(done) {
                    viewModel.initialize(objectiveId, question).fin(function () {
                        expect(viewModel.answers()[0].id).toBe('answerId2');
                        expect(viewModel.answers()[0].key()).toBe('key2');
                        expect(viewModel.answers()[0].value()).toBe('value2');
                        expect(viewModel.answers()[1].id).toBe('answerId1');
                        expect(viewModel.answers()[1].key()).toBe('key1');
                        expect(viewModel.answers()[1].value()).toBe('value1');
                        done();
                    });
                });
            });
        });

        describe('answers:', function() {
            it('should be observable array', function() {
                expect(viewModel.answers).toBeObservableArray();
            });
        });

        describe('addAnswer:', function() {
            var dfd,
                answer = { Id: 'answerId', Key: 'key', Value: 'value' };

            beforeEach(function () {
                dfd = Q.defer();
                spyOn(addTextMatchingAnswer, 'execute').and.returnValue(dfd.promise);
            });

            it('should be function', function () {
                expect(viewModel.addAnswer).toBeFunction();
            });

            describe('when answer was created', function() {
                beforeEach(function() {
                    dfd.resolve(answer);
                });

                it('should show notification', function(done) {
                    viewModel.answers([]);

                    viewModel.addAnswer().fin(function () {
                        expect(notify.saved).toHaveBeenCalled();
                        done();
                    });
                });

                it('should add new answer to answers', function(done) {
                    viewModel.answers([]);

                    viewModel.addAnswer().fin(function () {
                        expect(viewModel.answers().length).toBe(1);
                        done();
                    });
                });
            });
        });

        describe('removeAnswer:', function () {
            var dfd,
                answer = { id: 'answerId'};

            beforeEach(function () {
                dfd = Q.defer();
                spyOn(removeTextMatchingAnswer, 'execute').and.returnValue(dfd.promise);
            });

            it('should be function', function () {
                expect(viewModel.removeAnswer).toBeFunction();
            });

            describe('when answer was removed', function () {
                beforeEach(function () {
                    dfd.resolve();
                });

                it('should show notification', function (done) {
                    viewModel.answers([answer]);

                    viewModel.removeAnswer(answer).fin(function () {
                        expect(notify.saved).toHaveBeenCalled();
                        done();
                    });
                });

                it('should remove answer from answers', function (done) {
                    viewModel.answers([answer]);

                    viewModel.removeAnswer(answer).fin(function () {
                        expect(viewModel.answers().length).toBe(0);
                        done();
                    });
                });
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
    });
});