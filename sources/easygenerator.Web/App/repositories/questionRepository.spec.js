﻿define(['repositories/questionRepository', 'repositories/objectiveRepository', 'durandal/system'],
    function (questionRepository, objectiveRepository, system) {
        "use strict";

        var
            httpWrapper = require('httpWrapper'),
            dataContext = require('dataContext'),
            constants = require('constants'),
            app = require('durandal/app')
        ;

        describe('[questionRepository]', function () {

            var post;

            beforeEach(function () {
                post = Q.defer();
                spyOn(httpWrapper, 'post').andReturn(post.promise);
                spyOn(app, 'trigger');
            });

            describe('addQuestion:', function () {

                it('should be function', function () {
                    expect(questionRepository.addQuestion).toBeFunction();
                });

                it('should return promise', function () {
                    expect(questionRepository.addQuestion()).toBePromise();
                });

                describe('when objectiveId is not a string', function () {

                    it('should reject promise', function () {
                        var promise = questionRepository.addQuestion(undefined, {});

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Objective id is not a string');
                        });
                    });

                });

                describe('when question data is not an object', function () {

                    it('should reject promise', function () {
                        var promise = questionRepository.addQuestion('', undefined);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Question data is not an object');
                        });
                    });

                });

                describe('when objective id is a string and question data is an object', function () {

                    it('should send request to server to api/question/create', function () {
                        var objectiveId = 'objectiveId';
                        var question = { title: 'title', description: 'description' };
                        httpWrapper.post.reset();
                        post.reject();

                        var promise = questionRepository.addQuestion(objectiveId, question);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(httpWrapper.post).toHaveBeenCalledWith('api/question/create', {
                                objectiveId: objectiveId,
                                title: question.title
                            });
                        });
                    });


                    describe('and request to server was not successful', function () {

                        it('should reject promise', function () {
                            var reason = 'reason';
                            var promise = questionRepository.addQuestion('', {});

                            post.reject(reason);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith(reason);
                            });
                        });

                    });

                    describe('and request to server was successful', function () {

                        describe('and response is not an object', function () {

                            it('should reject promise', function () {
                                var promise = questionRepository.addQuestion('', {});

                                post.resolve();

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                });
                            });

                        });

                        describe('and response does not have an id of created question', function () {

                            it('should reject promise', function () {
                                var promise = questionRepository.addQuestion('', {});

                                post.resolve({ CreatedOn: '' });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Question Id is not a string');
                                });
                            });

                        });

                        describe('and response does not have a question creation date', function () {

                            it('should reject promise', function () {
                                var promise = questionRepository.addQuestion('', {});

                                post.resolve({ Id: '' });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Question creation date is not a string');
                                });
                            });

                        });

                        describe('and response has id and creation date', function () {

                            var response = {
                                Id: 'questionId',
                                CreatedOn: "/Date(1378106938845)/"
                            };

                            beforeEach(function () {
                                post.resolve(response);
                            });

                            describe('and objective does not exist in dataContext', function () {

                                it('should reject promise', function () {
                                    dataContext.objectives = [];

                                    var promise = questionRepository.addQuestion('', {});

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise).toBeRejectedWith('Objective does not exist in dataContext');
                                    });
                                });

                            });

                            describe('and objective exists in dataContext', function () {

                                var objective = {
                                    id: 'objectiveId',
                                    questions: []
                                };

                                beforeEach(function () {
                                    objective.questions = [];
                                    dataContext.objectives = [objective];
                                });

                                it('should add question to objective', function () {
                                    var question = { title: 'title' };
                                    var promise = questionRepository.addQuestion(objective.id, question);

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(objective.questions.length).toEqual(1);
                                        expect(objective.questions[0]).toEqual({
                                            id: response.Id,
                                            title: question.title,
                                            createdOn: new Date(response.CreatedOn),
                                            modifiedOn: new Date(response.CreatedOn),
                                            learningContents: [],
                                            answerOptions: []
                                        });
                                    });
                                });

                                it('should update objective modification date', function () {
                                    var promise = questionRepository.addQuestion(objective.id, {});

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(objective.modifiedOn).toEqual(new Date(response.CreatedOn));
                                    });
                                });

                                it('should trigger event \'question:created\'', function () {
                                    var question = { title: 'title' };
                                    var promise = questionRepository.addQuestion(objective.id, question);

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.created, objective.id, {
                                            id: response.Id,
                                            title: question.title,
                                            createdOn: new Date(response.CreatedOn),
                                            modifiedOn: new Date(response.CreatedOn),
                                            learningContents: [],
                                            answerOptions: []
                                        });
                                    });
                                });

                                it('should resolve promise with question', function () {
                                    var promise = questionRepository.addQuestion(objective.id, {});

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        var createdQuestion = promise.inspect().value;
                                        expect(createdQuestion.id).toEqual(response.Id);
                                        expect(createdQuestion.createdOn).toEqual(new Date(response.CreatedOn));
                                    });
                                });

                            });

                        });

                    });

                });

            });

            describe('removeQuestions:', function () {

                it('should be function', function () {
                    expect(questionRepository.removeQuestions).toBeFunction();
                });

                it('should return promise', function () {
                    expect(questionRepository.removeQuestions()).toBePromise();
                });

                describe('when objective id is not a string', function () {

                    it('should reject promise', function () {
                        var promise = questionRepository.removeQuestions(undefined, {});

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Objective id is not a string');
                        });
                    });

                });

                describe('when questions are not an array', function () {

                    it('should reject promise', function () {
                        var promise = questionRepository.removeQuestions('', {});

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Questions to remove are not an array');
                        });
                    });

                });

                describe('when all arguments are valid', function () {
                    var objective;
                    var questionIds;

                    beforeEach(function () {
                        objective = { id: "SomeObjectiveId" };
                        questionIds = ["SomeQuestionId1", "SomeQuestionId2"];
                    });

                    it('should send request to server to api/question/delete', function () {
                        httpWrapper.post.reset();
                        post.reject();

                        var promise = questionRepository.removeQuestions(objective.id, questionIds);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(httpWrapper.post).toHaveBeenCalledWith('api/question/delete', {
                                objectiveId: objective.id,
                                questions: ['SomeQuestionId1', 'SomeQuestionId2']
                            });
                        });
                    });

                    describe('and request to server was not successful', function () {

                        it('should reject promise', function () {
                            var reason = 'reason';
                            var promise = questionRepository.removeQuestions(objective.id, questionIds);

                            post.reject(reason);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith(reason);
                            });
                        });

                    });

                    describe('and request to server was successful', function () {

                        describe('and response is not an object', function () {

                            it('should reject promise', function () {
                                var promise = questionRepository.removeQuestions(objective.id, questionIds);

                                post.resolve();

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                });
                            });

                        });

                        describe('and response does not have modification date', function () {

                            it('should reject promise', function () {
                                var promise = questionRepository.removeQuestions(objective.id, questionIds);

                                post.resolve({});

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Response does not have modification date');
                                });
                            });

                        });

                        describe('and response has modification date', function () {

                            var response = { ModifiedOn: "/Date(1378106938845)/" };

                            beforeEach(function () {
                                post.resolve(response);
                            });

                            describe('and objective does not exist in dataContext', function () {

                                beforeEach(function () {
                                    dataContext.objectives = [];
                                });

                                it('should reject promise', function () {
                                    var promise = questionRepository.removeQuestions(objective.id, questionIds);

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise).toBeRejectedWith('Objective does not exist in dataContext');
                                    });
                                });

                            });

                            describe('and objective exists in dataContext', function () {

                                beforeEach(function () {
                                    dataContext.objectives = [{ id: objective.id, questions: [{ id: "SomeQuestionId1" }, { id: "SomeQuestionId2" }] }];
                                });

                                it('should remove questions from objective', function () {
                                    var promise = questionRepository.removeQuestions(objective.id, questionIds);

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(dataContext.objectives[0].questions.length).toEqual(0);
                                    });
                                });

                                it('should update objective modification date', function () {
                                    var promise = questionRepository.removeQuestions(objective.id, questionIds);

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(dataContext.objectives[0].modifiedOn).toEqual(new Date(response.ModifiedOn));
                                    });
                                });

                                it('should trigger event \'questions:deleted\'', function () {
                                    var promise = questionRepository.removeQuestions(objective.id, questionIds);

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.deleted, objective.id, questionIds);
                                    });
                                });

                                it('should resolve promise with modification date', function () {
                                    var promise = questionRepository.removeQuestions(objective.id, questionIds);

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise).toBeResolvedWith(new Date(response.ModifiedOn));
                                    });
                                });
                            });
                        });
                    });
                });
            });

            describe('updateTitle:', function () {

                it('should be function', function () {
                    expect(questionRepository.updateTitle).toBeFunction();
                });

                it('should return promise', function () {
                    expect(questionRepository.updateTitle()).toBePromise();
                });

                describe('when question id is not a string', function () {

                    it('should reject promise', function () {
                        var promise = questionRepository.updateTitle(undefined, '');

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Question id is not a string');
                        });
                    });

                });

                describe('when title is not a string', function () {

                    it('should reject promise', function () {
                        var promise = questionRepository.updateTitle('', undefined);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Question title not a string');
                        });
                    });

                });

                it('should send request to server to api/question/updateTitle', function () {
                    var questionId = 'questionId';
                    var questionTitle = 'questionTitle';

                    httpWrapper.post.reset();
                    post.reject();

                    var promise = questionRepository.updateTitle(questionId, questionTitle);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(httpWrapper.post).toHaveBeenCalledWith('api/question/updateTitle', {
                            questionId: questionId,
                            title: questionTitle
                        });
                    });
                });

                describe('and request to server was not successful', function () {

                    it('should reject promise', function () {
                        var reason = 'reason';
                        var promise = questionRepository.updateTitle('', '');

                        post.reject(reason);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith(reason);
                        });
                    });

                });

                describe('and request to server was successful', function () {

                    describe('and response is not an object', function () {

                        it('should reject promise', function () {
                            var promise = questionRepository.updateTitle('', '');

                            post.resolve();

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith('Response is not an object');
                            });
                        });

                    });

                    describe('and response does not have question modification date', function () {

                        it('should reject promise', function () {
                            var promise = questionRepository.updateTitle('', '');

                            post.resolve({});

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith('Response does not have modification date');
                            });
                        });

                    });

                    describe('and response has modification date', function () {

                        var response = { ModifiedOn: "/Date(1378106938845)/" };

                        beforeEach(function () {
                            post.resolve(response);
                        });

                        describe('and question does not exist in dataContext', function () {

                            beforeEach(function () {
                                dataContext.objectives = [];
                            });

                            it('should reject promise', function () {
                                var promise = questionRepository.updateTitle('', '');

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Question does not exist in dataContext');
                                });
                            });

                        });

                        describe('and question exists in dataContext', function () {

                            var questionId = 'questionId';
                            var questionTitle = 'questionTitle';

                            beforeEach(function () {
                                dataContext.objectives = [{ id: '', questions: [{ id: questionId }] }];
                            });

                            it('should update title and modification date', function () {
                                var promise = questionRepository.updateTitle(questionId, questionTitle);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(dataContext.objectives[0].questions[0].title).toEqual(questionTitle);
                                    expect(dataContext.objectives[0].questions[0].modifiedOn).toEqual(new Date(response.ModifiedOn));
                                });
                            });

                            it('should trigger event \'question:titleUpdated\'', function () {
                                var promise = questionRepository.updateTitle(questionId, questionTitle);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.titleUpdated, dataContext.objectives[0].questions[0]);
                                });
                            });

                            it('should resolve promise with modification date', function () {
                                var promise = questionRepository.updateTitle(questionId, questionTitle);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeResolvedWith(new Date(response.ModifiedOn));
                                });
                            });

                        });

                    });

                });


            });

            describe('updateContent:', function () {

                it('should be function', function () {
                    expect(questionRepository.updateContent).toBeFunction();
                });

                it('should return promise', function () {
                    expect(questionRepository.updateContent()).toBePromise();
                });

                describe('when question id is not a string', function () {

                    it('should reject promise', function () {
                        var promise = questionRepository.updateContent(undefined, '');

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Question id is not a string');
                        });
                    });

                });

                it('should send request to server to api/question/updateContent', function () {
                    var questionId = 'questionId';
                    var questionContent = 'questionContent';

                    httpWrapper.post.reset();
                    post.reject();

                    var promise = questionRepository.updateContent(questionId, questionContent);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(httpWrapper.post).toHaveBeenCalledWith('api/question/updateContent', {
                            questionId: questionId,
                            content: questionContent
                        });
                    });
                });

                describe('and request to server was not successful', function () {

                    it('should reject promise', function () {
                        var reason = 'reason';
                        var promise = questionRepository.updateContent('', '');

                        post.reject(reason);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith(reason);
                        });
                    });

                });

                describe('and request to server was successful', function () {

                    describe('and response is not an object', function () {

                        it('should reject promise', function () {
                            var promise = questionRepository.updateContent('', '');

                            post.resolve();

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith('Response is not an object');
                            });
                        });

                    });

                    describe('and response does not have question modification date', function () {

                        it('should reject promise', function () {
                            var promise = questionRepository.updateContent('', '');

                            post.resolve({});

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith('Response does not have modification date');
                            });
                        });

                    });

                    describe('and response has modification date', function () {

                        var response = { ModifiedOn: "/Date(1378106938845)/" };

                        beforeEach(function () {
                            post.resolve(response);
                        });

                        describe('and question does not exist in dataContext', function () {

                            beforeEach(function () {
                                dataContext.objectives = [];
                            });

                            it('should reject promise', function () {
                                var promise = questionRepository.updateContent('', '');

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Question does not exist in dataContext');
                                });
                            });

                        });

                        describe('and question exists in dataContext', function () {

                            var questionId = 'questionId';
                            var questionContent = 'questionContent';

                            beforeEach(function () {
                                dataContext.objectives = [{ id: '', questions: [{ id: questionId }] }];
                            });

                            it('should update title and modification date', function () {

                                var promise = questionRepository.updateContent(questionId, questionContent);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(dataContext.objectives[0].questions[0].content).toEqual(questionContent);
                                    expect(dataContext.objectives[0].questions[0].modifiedOn).toEqual(new Date(response.ModifiedOn));
                                });
                            });

                            it('should resolve promise with modification date', function () {
                                var promise = questionRepository.updateContent(questionId, questionContent);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeResolvedWith(new Date(response.ModifiedOn));
                                });
                            });

                        });

                    });

                });


            });

            describe('getById:', function () {
                var getObjectiveDeferred;
                beforeEach(function () {
                    getObjectiveDeferred = Q.defer();
                    spyOn(objectiveRepository, 'getById').andReturn(getObjectiveDeferred.promise);
                });

                describe('when objectiveId is undefined', function () {
                    it('should throw exception', function () {
                        var f = function () {
                            questionRepository.getById();
                        };
                        expect(f).toThrow();
                    });
                });

                describe('when objectiveId is null', function () {
                    it('should throw exception', function () {
                        var f = function () {
                            questionRepository.getById(null);
                        };
                        expect(f).toThrow();
                    });
                });

                describe('when questionId is null', function () {
                    it('should throw exception', function () {
                        var f = function () {
                            questionRepository.getById(1, null);
                        };
                        expect(f).toThrow();
                    });
                });

                describe('when questionId is undefined', function () {
                    it('should throw exception', function () {
                        var f = function () {
                            questionRepository.getById(1);
                        };
                        expect(f).toThrow();
                    });
                });

                it('should return promise', function () {
                    var promise = questionRepository.getById(1, 0);
                    expect(promise).toBePromise();
                });

                describe('when objective does not exist', function () {
                    it('should reject promise', function () {
                        var promise = questionRepository.getById(-1, 0);
                        getObjectiveDeferred.resolve(null);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise.inspect().state).toEqual('rejected');
                        });
                    });
                });

                describe('when objective exists', function () {
                    var question = { id: 0, title: 'lalal' };
                    var objective = { id: 1, questions: [question] };

                    it('should resolve promise with question value', function () {
                        var promise = questionRepository.getById(objective.id, question.id);
                        getObjectiveDeferred.resolve(objective);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise.inspect().state).toEqual('fulfilled');
                            expect(promise.inspect().value).toEqual(question);
                        });
                    });
                });
            });
        });
    });