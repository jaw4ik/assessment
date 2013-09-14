define(['repositories/questionRepository', 'repositories/objectiveRepository', 'durandal/system'],
    function (questionRepository, objectiveRepository, system) {
        "use strict";

        var
            httpWrapper = require('httpWrapper');

        describe('[questionRepository]', function () {

            var post;

            beforeEach(function () {
                post = Q.defer();
                spyOn(httpWrapper, 'post').andReturn(post.promise);
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

                            var dataContext = require('dataContext');

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
                                            createdOn: utils.getDateFromString(response.CreatedOn),
                                            modifiedOn: utils.getDateFromString(response.CreatedOn),
                                            explanations: [],
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
                                        expect(objective.modifiedOn).toEqual(utils.getDateFromString(response.CreatedOn));
                                    });
                                });

                                it('should resolve promise with question id', function () {
                                    var promise = questionRepository.addQuestion(objective.id, {});

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise).toBeResolvedWith(response.Id);
                                    });
                                });

                            });

                        });

                    });

                });

            });

            describe('update:', function () {
                var getObjectiveDeferred;
                beforeEach(function () {
                    getObjectiveDeferred = Q.defer();
                    spyOn(objectiveRepository, 'getById').andReturn(getObjectiveDeferred.promise);
                });

                describe('when objectiveId is undefined', function () {
                    it('should throw exception', function () {
                        var f = function () {
                            questionRepository.update();
                        };
                        expect(f).toThrow();
                    });
                });

                describe('when objectiveId is null', function () {
                    it('should throw exception', function () {
                        var f = function () {
                            questionRepository.update(null);
                        };
                        expect(f).toThrow();
                    });
                });

                describe('when question is null', function () {
                    it('should throw exception', function () {
                        var f = function () {
                            questionRepository.update(1, null);
                        };
                        expect(f).toThrow();
                    });
                });

                describe('when question is undefined', function () {
                    it('should throw exception', function () {
                        var f = function () {
                            questionRepository.update(1);
                        };
                        expect(f).toThrow();
                    });
                });

                it('should return promise', function () {
                    var promise = questionRepository.update(1, { id: 0, title: 'lalala' });
                    expect(promise).toBePromise();
                });

                describe('when objective does not exist', function () {
                    it('should reject promise', function () {
                        var promise = questionRepository.update(-1, { id: 0, title: 'lalala' });
                        getObjectiveDeferred.resolve(null);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise.inspect().state).toEqual('rejected');
                        });
                    });
                });

                describe('when question does not exist', function () {
                    var objective = { id: 1, questions: [] };

                    it('should reject promise', function () {
                        var promise = questionRepository.update(-1, { id: 0, title: 'lalala' });
                        getObjectiveDeferred.resolve(objective);

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

                    it('should resolve promise with updated entry', function () {
                        var promise = questionRepository.update(objective.id, { id: 0, title: 'smth' });
                        getObjectiveDeferred.resolve(objective);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise.inspect().state).toEqual('fulfilled');
                            expect(promise.inspect().value.id).toEqual(question.id);
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

                        var dataContext = require('dataContext');

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
                                    expect(dataContext.objectives[0].questions[0].modifiedOn).toEqual(utils.getDateFromString(response.ModifiedOn));
                                });
                            });

                            it('should resolve promise with modification date', function () {
                                var promise = questionRepository.updateTitle(questionId, questionTitle);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeResolvedWith(utils.getDateFromString(response.ModifiedOn));
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