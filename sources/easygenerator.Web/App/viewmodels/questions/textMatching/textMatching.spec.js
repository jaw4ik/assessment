define(function (require) {
    "use strict";

    var viewModel = require('viewmodels/questions/textMatching/textMatching'),
        notify = require('notify'),
        getTextMatchingAnswersById = require('viewmodels/questions/textMatching/queries/getTextMatchingAnswersById'),
        addTextMatchingAnswer = require('viewmodels/questions/textMatching/commands/addAnswer'),
        removeTextMatchingAnswer = require('viewmodels/questions/textMatching/commands/removeAnswer'),
        TextMatchingAnswer = require('viewmodels/questions/textMatching/textMatchingAnswer'),
        http = require('plugins/http'),
        localizationManager = require('localization/localizationManager');
    

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
                spyOn(http, 'post');
                spyOn(localizationManager, 'localize').and.callFake(function (arg) {
                    return arg;
                });
            });

            it('should return promise', function () {
                var promise = viewModel.initialize(objectiveId, question);
                expect(promise).toBePromise();
            });

            it('should set objectiveId', function () {
                viewModel.initialize(objectiveId, question);

                expect(viewModel.objectiveId).toBe(objectiveId);
            });

            it('should set questionId', function () {
                viewModel.initialize(objectiveId, question);

                expect(viewModel.questionId).toBe(question.id);
            });

            it('should set isExpanded in true', function () {
                viewModel.initialize(objectiveId, question);

                expect(viewModel.isExpanded()).toBeTruthy();
            });

            it('should get answers', function () {
                viewModel.initialize(objectiveId, question);

                expect(getTextMatchingAnswersById.execute).toHaveBeenCalledWith(question.id);
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

            describe('when answers is initialize', function() {
                beforeEach(function() {
                    dfd.resolve();
                });

                it('should return object', function (done) {
                    var promise = viewModel.initialize(objectiveId, question);
                    promise.then(function (result) {
                        expect(result).toBeObject();
                        done();
                    });
                });

                describe('and result object', function () {
                    it('should contain \'textMatchingEditor\' viewCaption', function (done) {
                        var promise = viewModel.initialize(objectiveId, question);
                        promise.then(function (result) {
                            expect(result.viewCaption).toBe('textMatchingEditor');
                            done();
                        });
                    });

                    it('should have hasQuestionView property with true value', function (done) {
                        var promise = viewModel.initialize(objectiveId, question);
                        promise.then(function (result) {
                            expect(result.hasQuestionView).toBeTruthy();
                            done();
                        });
                    });

                    it('should have hasQuestionContent property with true value', function (done) {
                        var promise = viewModel.initialize(objectiveId, question);
                        promise.then(function (result) {
                            expect(result.hasQuestionContent).toBeTruthy();
                            done();
                        });
                    });

                    it('should have hasFeedback property with true value', function (done) {
                        var promise = viewModel.initialize(objectiveId, question);
                        promise.then(function (result) {
                            expect(result.hasFeedback).toBeTruthy();
                            done();
                        });
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

        describe('answerCreatedByCollaborator:', function () {
            var questionId = 'questionId',
                answerId = 'answerId';

            it('should be function', function () {
                expect(viewModel.answerCreatedByCollaborator).toBeFunction();
            });

            describe('when answer is created in current question', function () {
                beforeEach(function () {
                    viewModel.questionId = questionId;
                });

                it('should add new answer', function () {
                    viewModel.answers([]);
                    viewModel.answerCreatedByCollaborator(questionId, answerId, 'some key', 'some value');
                    expect(viewModel.answers().length).toBe(1);
                    expect(viewModel.answers()[0].id).toBe(answerId);
                });
            });

            describe('when answer is created not in current question', function () {
                beforeEach(function () {
                    viewModel.questionId = 'otherId';
                });

                it('should not add new answer', function () {
                    viewModel.answers([]);
                    viewModel.answerCreatedByCollaborator(questionId, answerId, 'some key', 'some value');
                    expect(viewModel.answers().length).toBe(0);
                });
            });
        });

        describe('answerKeyChangedByCollaborator:', function () {

            it('should be function', function () {
                expect(viewModel.answerKeyChangedByCollaborator).toBeFunction();
            });

            describe('when it is not current question', function () {
                var answer = { id: 'answerId', key: ko.observable('key') },
                        questionId = 'questionId';

                it('should not update key', function () {
                    viewModel.answers([answer]);
                    viewModel.questionId = 'otherId';

                    viewModel.answerKeyChangedByCollaborator(questionId, answer.id, 'test');
                    expect(viewModel.answers()[0].key()).toBe('key');
                });
            });

            describe('when it is current question', function () {
                var answer,
                    questionId = 'questionId';

                beforeEach(function () {
                    answer = new TextMatchingAnswer('id', 'key', 'value');
                    viewModel.questionId = questionId;
                    spyOn(answer, 'changeOriginalKey');
                });

                describe('and answer is found', function () {
                    beforeEach(function () {
                        viewModel.answers([answer]);
                    });

                    it('should change original key for answer', function () {
                        viewModel.answerKeyChangedByCollaborator(questionId, answer.id, 'test');
                        expect(answer.changeOriginalKey).toHaveBeenCalled();
                    });

                    describe('and answer key is in editing', function () {
                        beforeEach(function () {
                            answer.key.hasFocus = ko.observable(true);
                        });

                        it('should not update key', function () {
                            viewModel.answerKeyChangedByCollaborator(questionId, answer.id, 'test');
                            expect(viewModel.answers()[0].key()).toBe('key');
                        });
                    });

                    describe('and answer key is not in editing', function () {
                        beforeEach(function () {
                            answer.key.hasFocus = ko.observable(false);
                        });

                        it('should update key', function () {
                            viewModel.answerKeyChangedByCollaborator(questionId, answer.id, 'test');
                            expect(viewModel.answers()[0].key()).toBe('test');
                        });
                    });
                });
            });

        });

        describe('answerValueChangedByCollaborator:', function () {

            it('should be function', function () {
                expect(viewModel.answerValueChangedByCollaborator).toBeFunction();
            });

            describe('when it is not current question', function () {
                var answer = { id: 'answerId', value: ko.observable('value') },
                        questionId = 'questionId';

                it('should not update value', function () {
                    viewModel.answers([answer]);
                    viewModel.questionId = 'otherId';

                    viewModel.answerValueChangedByCollaborator(questionId, answer.id, 'test');
                    expect(viewModel.answers()[0].value()).toBe('value');
                });
            });

            describe('when it is current question', function () {
                var answer,
                    questionId = 'questionId';

                beforeEach(function () {
                    answer = new TextMatchingAnswer('id', 'key', 'value');
                    viewModel.questionId = questionId;
                    spyOn(answer, 'changeOriginalValue');
                });

                describe('and answer is found', function () {
                    beforeEach(function () {
                        viewModel.answers([answer]);
                    });

                    it('should change original value for answer', function () {
                        viewModel.answerValueChangedByCollaborator(questionId, answer.id, 'test');
                        expect(answer.changeOriginalValue).toHaveBeenCalled();
                    });

                    describe('and answer value is in editing', function () {
                        beforeEach(function () {
                            answer.value.hasFocus = ko.observable(true);
                        });

                        it('should not update value', function () {
                            viewModel.answerValueChangedByCollaborator(questionId, answer.id, 'test');
                            expect(viewModel.answers()[0].value()).toBe('value');
                        });
                    });

                    describe('and answer value is not in editing', function () {
                        beforeEach(function () {
                            answer.value.hasFocus = ko.observable(false);
                        });

                        it('should update value', function () {
                            viewModel.answerValueChangedByCollaborator(questionId, answer.id, 'test');
                            expect(viewModel.answers()[0].value()).toBe('test');
                        });
                    });
                });
            });

        });

        describe('answerDeletedByCollaborator:', function () {

            it('should be function', function () {
                expect(viewModel.answerDeletedByCollaborator).toBeFunction();
            });

            describe('when it is current question', function () {
                var answer,
                    questionId = 'questionId';

                beforeEach(function () {
                    answer = new TextMatchingAnswer('id', 'key', 'value');
                    viewModel.questionId = questionId;
                });

                describe('and answer is found', function () {
                    beforeEach(function () {
                        viewModel.answers([answer]);
                    });

                    it('should delete answer from list', function () {
                        viewModel.answerDeletedByCollaborator(questionId, answer.id);
                        expect(viewModel.answers().length).toBe(0);
                    });

                    describe('and answer key is in editing', function () {
                        beforeEach(function () {
                            answer.key.hasFocus = ko.observable(true);
                            spyOn(notify, 'error');
                        });

                        it('should not delete answer from list', function () {
                            viewModel.answerDeletedByCollaborator(questionId, answer.id);
                            expect(viewModel.answers().length).toBe(1);
                        });

                        it('should mark answer as isDeleted', function () {
                            viewModel.answerDeletedByCollaborator(questionId, answer.id);
                            expect(answer.isDeleted).toBeTruthy();
                        });

                        it('should show error notification', function () {
                            viewModel.answerDeletedByCollaborator(questionId, answer.id);
                            expect(notify.error).toHaveBeenCalled();
                        });
                    });

                    describe('and answer value is in editing', function () {
                        beforeEach(function () {
                            answer.value.hasFocus = ko.observable(true);
                            spyOn(notify, 'error');
                        });

                        it('should not delete answer from list', function () {
                            viewModel.answerDeletedByCollaborator(questionId, answer.id);
                            expect(viewModel.answers().length).toBe(1);
                        });

                        it('should mark answer as isDeleted', function () {
                            viewModel.answerDeletedByCollaborator(questionId, answer.id);
                            expect(answer.isDeleted).toBeTruthy();
                        });

                        it('should show error notification', function () {
                            viewModel.answerDeletedByCollaborator(questionId, answer.id);
                            expect(notify.error).toHaveBeenCalled();
                        });
                    });
                });
            });

            describe('when it is not current question', function () {
                var answer,
                    questionId = 'questionId';

                beforeEach(function () {
                    answer = new TextMatchingAnswer('id', 'key', 'value');
                    viewModel.answers([answer]);
                    viewModel.questionId = 'otherId';
                });

                it('should not delete answer from list', function () {
                    viewModel.answerDeletedByCollaborator(questionId, answer.id);
                    expect(viewModel.answers().length).toBe(1);
                });
            });
        });

        describe('endEditAnswer:', function () {
            it('should be function', function () {
                expect(viewModel.endEditAnswer).toBeFunction();
            });

            describe('when answer is marked as deleted', function () {

                it('should delete answer from list', function () {
                    var answer = new TextMatchingAnswer('id', 'key', 'value');
                    answer.isDeleted = true;
                    viewModel.answers([answer]);
                    viewModel.endEditAnswer(answer);
                    expect(viewModel.answers().length).toBe(0);
                });

            });

            describe('when answer is not marked as deleted', function () {

                it('should not delete answer from list', function () {
                    var answer = new TextMatchingAnswer('id', 'key', 'value');
                    answer.isDeleted = false;
                    viewModel.answers([answer]);
                    viewModel.endEditAnswer(answer);
                    expect(viewModel.answers().length).toBe(1);
                });

            });
        });

        describe('showDeleteButton:', function () {
            it('should be computed', function() {
                expect(viewModel.showDeleteButton).toBeComputed();
            });

            describe('when answers count more than 2', function() {
                it('should be true', function() {
                    viewModel.answers([new TextMatchingAnswer('id1', 'key', 'value'),
                        new TextMatchingAnswer('id2', 'key', 'value'),
                        new TextMatchingAnswer('id3', 'key', 'value')]);
                    expect(viewModel.showDeleteButton()).toBeTruthy();
                });
            });

            describe('when answers count is 2', function () {
                it('should be false', function () {
                    viewModel.answers([new TextMatchingAnswer('id1', 'key', 'value'),
                        new TextMatchingAnswer('id2', 'key', 'value')]);
                    expect(viewModel.showDeleteButton()).toBeFalsy();
                });
            });
        });
    });
});