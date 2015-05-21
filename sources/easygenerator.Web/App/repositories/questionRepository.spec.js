define(['repositories/questionRepository'],
    function (questionRepository) {
        "use strict";

        var
            app = require('durandal/app'),
            dataContext = require('dataContext'),
            constants = require('constants'),
            httpWrapper = require('http/httpWrapper'),
            objectiveRepository = require('repositories/objectiveRepository'),
            QuestionModel = require('models/question'),
            questionModelMapper = require('mappers/questionModelMapper');

        var questionType = 0,
            questionId = 'questionId';

        describe('[questionRepository]', function () {

            var post;

            beforeEach(function () {
                post = Q.defer();
                spyOn(httpWrapper, 'post').and.returnValue(post.promise);
                spyOn(app, 'trigger');
            });

            it('should be object', function () {
                expect(questionRepository).toBeObject();
            });

            describe('addQuestion:', function () {

                it('should be function', function () {
                    expect(questionRepository.addQuestion).toBeFunction();
                });

                it('should return promise', function () {
                    expect(questionRepository.addQuestion()).toBePromise();
                });

                describe('when objectiveId is undefined', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.addQuestion(undefined, {});

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Objective id is not a string');
                            done();
                        });
                    });

                });

                describe('when objectiveId is null', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.addQuestion(null, {});

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Objective id is not a string');
                            done();
                        });
                    });

                });

                describe('when objectiveId is not a string', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.addQuestion({}, {});

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Objective id is not a string');
                            done();
                        });
                    });

                });

                describe('when question data is undefined', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.addQuestion('', undefined);
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question data is not an object');
                            done();
                        });
                    });

                });

                describe('when question data is null', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.addQuestion('', null);
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question data is not an object');
                            done();
                        });
                    });

                });

                describe('when question data is not an object', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.addQuestion('', '');
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question data is not an object');
                            done();
                        });
                    });

                });

                describe('when objective id is a string and question data is an object', function () {

                    it('should send request to server to api/question/{type}/create', function (done) {
                        var objectiveId = 'objectiveId';
                        var question = { title: 'title', description: 'description' };
                        post.reject();

                        var promise = questionRepository.addQuestion(objectiveId, question, questionType);

                        promise.fin(function () {
                            expect(httpWrapper.post).toHaveBeenCalledWith('api/question/' + questionType + '/create', {
                                objectiveId: objectiveId,
                                title: question.title,
                            });
                            done();
                        });
                    });

                    describe('and request to server was not successful', function () {

                        it('should reject promise', function (done) {
                            var reason = 'reason';
                            var promise = questionRepository.addQuestion('', {});

                            post.reject(reason);

                            promise.fin(function () {
                                expect(promise).toBeRejectedWith(reason);
                                done();
                            });
                        });

                    });

                    describe('and request to server was successful', function () {

                        describe('and response is undefined', function () {

                            it('should reject promise', function (done) {
                                var promise = questionRepository.addQuestion('', {});

                                post.resolve(undefined);

                                promise.fin(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                    done();
                                });
                            });

                        });

                        describe('and response is null', function () {

                            it('should reject promise', function (done) {
                                var promise = questionRepository.addQuestion('', {});

                                post.resolve(null);

                                promise.fin(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                    done();
                                });
                            });

                        });

                        describe('and response is not an object', function () {

                            it('should reject promise', function (done) {
                                var promise = questionRepository.addQuestion('', {});

                                post.resolve('');

                                promise.fin(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                    done();
                                });
                            });

                        });

                        describe('and response does not have an id of created question', function () {

                            it('should reject promise', function (done) {
                                var promise = questionRepository.addQuestion('', {});

                                post.resolve({ CreatedOn: '' });

                                promise.fin(function () {
                                    expect(promise).toBeRejectedWith('Question Id is not a string');
                                    done();
                                });
                            });

                        });

                        describe('and response does not have a question creation date', function () {

                            it('should reject promise', function (done) {
                                var promise = questionRepository.addQuestion('', {});

                                post.resolve({ Id: '' });

                                promise.fin(function () {
                                    expect(promise).toBeRejectedWith('Question creation date is not a string');
                                    done();
                                });
                            });

                        });

                        describe('and response has id and creation date', function () {

                            var createdOnDate = new Date();
                            var response = {
                                Id: questionId,
                                CreatedOn: createdOnDate.toISOString()
                            };

                            beforeEach(function () {
                                post.resolve(response);
                            });

                            describe('and objective does not exist in dataContext', function () {

                                it('should reject promise', function (done) {
                                    dataContext.objectives = [];

                                    var promise = questionRepository.addQuestion('', {});

                                    promise.fin(function () {
                                        expect(promise).toBeRejectedWith('Objective does not exist in dataContext');
                                        done();
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

                                it('should add question to objective', function (done) {
                                    var question = { title: 'title' };
                                    var promise = questionRepository.addQuestion(objective.id, question, questionType);

                                    promise.fin(function () {
                                        expect(objective.questions.length).toEqual(1);
                                        expect(objective.questions[0]).toEqual(new QuestionModel({
                                            id: response.Id,
                                            createdOn: new Date(createdOnDate.toISOString()),
                                            modifiedOn: new Date(createdOnDate.toISOString()),
                                            title: question.title,
                                            content: undefined,
                                            type: questionType
                                        }));
                                        done();
                                    });
                                });

                                it('should update objective modification date', function (done) {
                                    var promise = questionRepository.addQuestion(objective.id, {});

                                    promise.fin(function () {
                                        expect(objective.modifiedOn).toEqual(new Date(createdOnDate.toISOString()));
                                        done();
                                    });
                                });

                                it('should trigger event \'question:created\'', function (done) {
                                    var question = { title: 'title' };
                                    var promise = questionRepository.addQuestion(objective.id, question, questionType);
                                    promise.fin(function () {
                                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.created, objective.id, new QuestionModel({
                                            id: response.Id,
                                            title: question.title,
                                            content: undefined,
                                            createdOn: new Date(createdOnDate.toISOString()),
                                            modifiedOn: new Date(createdOnDate.toISOString()),
                                            type: questionType
                                        }));
                                        done();
                                    });
                                });

                                it('should resolve promise with question', function (done) {
                                    var promise = questionRepository.addQuestion(objective.id, {});

                                    promise.fin(function () {
                                        var createdQuestion = promise.inspect().value;
                                        expect(createdQuestion.id).toEqual(response.Id);
                                        expect(createdQuestion.createdOn).toEqual(new Date(createdOnDate.toISOString()));
                                        done();
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

                describe('when objective id is undefined', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.removeQuestions(undefined, {});

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Objective id is not a string');
                            done();
                        });
                    });

                });

                describe('when objective id is null', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.removeQuestions(null, {});

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Objective id is not a string');
                            done();
                        });
                    });

                });

                describe('when objective id is not a string', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.removeQuestions({}, {});

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Objective id is not a string');
                            done();
                        });
                    });

                });

                describe('when questions are null', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.removeQuestions('', null);
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Questions to remove are not an array');
                            done();
                        });
                    });

                });

                describe('when questions are undefined', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.removeQuestions('', undefined);
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Questions to remove are not an array');
                            done();
                        });
                    });

                });

                describe('when questions are not an array', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.removeQuestions('', {});
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Questions to remove are not an array');
                            done();
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

                    it('should send request to server to api/question/delete', function (done) {
                        post.reject();

                        var promise = questionRepository.removeQuestions(objective.id, questionIds);
                        promise.fin(function () {
                            expect(httpWrapper.post).toHaveBeenCalledWith('api/question/delete', {
                                objectiveId: objective.id,
                                questions: ['SomeQuestionId1', 'SomeQuestionId2']
                            });
                            done();
                        });
                    });

                    describe('and request to server was not successful', function () {

                        it('should reject promise', function (done) {
                            var reason = 'reason';
                            var promise = questionRepository.removeQuestions(objective.id, questionIds);

                            post.reject(reason);
                            promise.fin(function () {
                                expect(promise).toBeRejectedWith(reason);
                                done();
                            });
                        });

                    });

                    describe('and request to server was successful', function () {

                        describe('and response is null', function () {

                            it('should reject promise', function (done) {
                                var promise = questionRepository.removeQuestions(objective.id, questionIds);

                                post.resolve(null);
                                promise.fin(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                    done();
                                });
                            });

                        });

                        describe('and response is undefined', function () {

                            it('should reject promise', function (done) {
                                var promise = questionRepository.removeQuestions(objective.id, questionIds);

                                post.resolve(undefined);
                                promise.fin(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                    done();
                                });
                            });

                        });

                        describe('and response is not an object', function () {

                            it('should reject promise', function (done) {
                                var promise = questionRepository.removeQuestions(objective.id, questionIds);

                                post.resolve('');
                                promise.fin(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                    done();
                                });
                            });

                        });

                        describe('and response does not have modification date', function () {

                            it('should reject promise', function (done) {
                                var promise = questionRepository.removeQuestions(objective.id, questionIds);

                                post.resolve({});
                                promise.fin(function () {
                                    expect(promise).toBeRejectedWith('Response does not have modification date');
                                    done();
                                });
                            });

                        });

                        describe('and response has modification date', function () {

                            var createdOnDate = new Date();
                            var response = { ModifiedOn: createdOnDate.toISOString() };

                            beforeEach(function () {
                                post.resolve(response);
                            });

                            describe('and objective does not exist in dataContext', function () {

                                beforeEach(function () {
                                    dataContext.objectives = [];
                                });

                                it('should reject promise', function (done) {
                                    var promise = questionRepository.removeQuestions(objective.id, questionIds);
                                    promise.fin(function () {
                                        expect(promise).toBeRejectedWith('Objective does not exist in dataContext');
                                        done();
                                    });
                                });

                            });

                            describe('and objective exists in dataContext', function () {

                                beforeEach(function () {
                                    dataContext.objectives = [{ id: objective.id, questions: [{ id: "SomeQuestionId1" }, { id: "SomeQuestionId2" }] }];
                                });

                                it('should remove questions from objective', function (done) {
                                    var promise = questionRepository.removeQuestions(objective.id, questionIds);
                                    promise.fin(function () {
                                        expect(dataContext.objectives[0].questions.length).toEqual(0);
                                        done();
                                    });
                                });

                                it('should update objective modification date', function (done) {
                                    var promise = questionRepository.removeQuestions(objective.id, questionIds);
                                    promise.fin(function () {
                                        expect(dataContext.objectives[0].modifiedOn).toEqual(new Date(response.ModifiedOn));
                                        done();
                                    });
                                });

                                it('should trigger event \'questions:deleted\'', function (done) {
                                    var promise = questionRepository.removeQuestions(objective.id, questionIds);
                                    promise.fin(function () {
                                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.deleted, objective.id, questionIds);
                                        done();
                                    });
                                });

                                it('should resolve promise with modification date', function (done) {
                                    var promise = questionRepository.removeQuestions(objective.id, questionIds);
                                    promise.fin(function () {
                                        expect(promise).toBeResolvedWith(new Date(response.ModifiedOn));
                                        done();
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

                describe('when question id is null', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.updateTitle(null, '');
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question id is not a string');
                            done();
                        });
                    });

                });

                describe('when question id is undefined', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.updateTitle(undefined, '');
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question id is not a string');
                            done();
                        });
                    });

                });

                describe('when question id is not a string', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.updateTitle({}, '');
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question id is not a string');
                            done();
                        });
                    });

                });

                describe('when title is null', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.updateTitle('', null);
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question title not a string');
                            done();
                        });
                    });

                });

                describe('when title is undefined', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.updateTitle('', undefined);
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question title not a string');
                            done();
                        });
                    });

                });

                describe('when title is not a string', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.updateTitle('', {});
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question title not a string');
                            done();
                        });
                    });

                });

                describe('when all arguments are valid', function () {

                    it('should send request to server to api/question/updateTitle', function (done) {
                        var questionTitle = 'questionTitle';

                        post.reject();

                        var promise = questionRepository.updateTitle(questionId, questionTitle);
                        promise.fin(function () {
                            expect(httpWrapper.post).toHaveBeenCalledWith('api/question/updateTitle', {
                                questionId: questionId,
                                title: questionTitle
                            });
                            done();
                        });
                    });

                    describe('and request to server was not successful', function () {

                        it('should reject promise', function (done) {
                            var reason = 'reason';
                            var promise = questionRepository.updateTitle('', '');

                            post.reject(reason);
                            promise.fin(function () {
                                expect(promise).toBeRejectedWith(reason);
                                done();
                            });
                        });

                    });

                    describe('and request to server was successful', function () {

                        describe('and response is undefined', function () {

                            it('should reject promise', function (done) {
                                var promise = questionRepository.updateTitle('', '');

                                post.resolve(undefined);
                                promise.fin(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                    done();
                                });
                            });

                        });

                        describe('and response is null', function () {

                            it('should reject promise', function (done) {
                                var promise = questionRepository.updateTitle('', '');

                                post.resolve(null);
                                promise.fin(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                    done();
                                });
                            });

                        });

                        describe('and response is not an object', function () {

                            it('should reject promise', function (done) {
                                var promise = questionRepository.updateTitle('', '');

                                post.resolve('');
                                promise.fin(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                    done();
                                });
                            });

                        });

                        describe('and response does not have question modification date', function () {

                            it('should reject promise', function (done) {
                                var promise = questionRepository.updateTitle('', '');

                                post.resolve({});
                                promise.fin(function () {
                                    expect(promise).toBeRejectedWith('Response does not have modification date');
                                    done();
                                });
                            });

                        });

                        describe('and response has modification date', function () {

                            var createdOnDate = new Date();
                            var response = { ModifiedOn: createdOnDate.toISOString() };

                            beforeEach(function () {
                                post.resolve(response);
                            });

                            describe('and question does not exist in dataContext', function () {

                                beforeEach(function () {
                                    dataContext.objectives = [];
                                });

                                it('should reject promise', function (done) {
                                    var promise = questionRepository.updateTitle('', '');
                                    promise.fin(function () {
                                        expect(promise).toBeRejectedWith('Question does not exist in dataContext');
                                        done();
                                    });
                                });

                            });

                            describe('and question exists in dataContext', function () {

                                var questionTitle = 'questionTitle';

                                beforeEach(function () {
                                    dataContext.objectives = [{ id: '', questions: [{ id: questionId }] }];
                                });

                                it('should update title and modification date', function (done) {
                                    var promise = questionRepository.updateTitle(questionId, questionTitle);
                                    promise.fin(function () {
                                        expect(dataContext.objectives[0].questions[0].title).toEqual(questionTitle);
                                        expect(dataContext.objectives[0].questions[0].modifiedOn).toEqual(new Date(response.ModifiedOn));
                                        done();
                                    });
                                });

                                it('should trigger event \'question:titleUpdated\'', function (done) {
                                    var promise = questionRepository.updateTitle(questionId, questionTitle);
                                    promise.fin(function () {
                                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.titleUpdated, dataContext.objectives[0].questions[0]);
                                        done();
                                    });
                                });

                                it('should resolve promise with modification date', function (done) {
                                    var promise = questionRepository.updateTitle(questionId, questionTitle);
                                    promise.fin(function () {
                                        expect(promise).toBeResolvedWith(new Date(response.ModifiedOn));
                                        done();
                                    });
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

                describe('when question id is undefined', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.updateContent(undefined, '');
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question id is not a string');
                            done();
                        });
                    });

                });

                describe('when question id is null', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.updateContent(null, '');
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question id is not a string');
                            done();
                        });
                    });

                });

                describe('when question id is not a string', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.updateContent({}, '');
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question id is not a string');
                            done();
                        });
                    });

                });

                describe('when all arguments are valid', function () {

                    it('should send request to server to api/question/updateContent', function (done) {
                        var questionContent = 'questionContent';

                        post.reject();

                        var promise = questionRepository.updateContent(questionId, questionContent);
                        promise.fin(function () {
                            expect(httpWrapper.post).toHaveBeenCalledWith('api/question/updateContent', {
                                questionId: questionId,
                                content: questionContent
                            });
                            done();
                        });
                    });

                    describe('and request to server was not successful', function () {

                        it('should reject promise', function (done) {
                            var reason = 'reason';
                            var promise = questionRepository.updateContent('', '');

                            post.reject(reason);
                            promise.fin(function () {
                                expect(promise).toBeRejectedWith(reason);
                                done();
                            });
                        });

                    });

                    describe('and request to server was successful', function () {

                        describe('and response is undefined', function () {

                            it('should reject promise', function (done) {
                                var promise = questionRepository.updateContent('', '');

                                post.resolve(undefined);
                                promise.fin(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                    done();
                                });
                            });

                        });

                        describe('and response is null', function () {

                            it('should reject promise', function (done) {
                                var promise = questionRepository.updateContent('', '');

                                post.resolve(null);
                                promise.fin(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                    done();
                                });
                            });

                        });

                        describe('and response is not an object', function () {

                            it('should reject promise', function (done) {
                                var promise = questionRepository.updateContent('', '');

                                post.resolve('');
                                promise.fin(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                    done();
                                });
                            });

                        });

                        describe('and response does not have question modification date', function () {

                            it('should reject promise', function (done) {
                                var promise = questionRepository.updateContent('', '');

                                post.resolve({});
                                promise.fin(function () {
                                    expect(promise).toBeRejectedWith('Response does not have modification date');
                                    done();
                                });
                            });

                        });

                        describe('and response has modification date', function () {


                            var createdOnDate = new Date();
                            var response = { ModifiedOn: createdOnDate.toISOString() };

                            beforeEach(function () {
                                post.resolve(response);
                            });

                            describe('and question does not exist in dataContext', function () {

                                beforeEach(function () {
                                    dataContext.objectives = [];
                                });

                                it('should reject promise', function (done) {
                                    var promise = questionRepository.updateContent('', '');
                                    promise.fin(function () {
                                        expect(promise).toBeRejectedWith('Question does not exist in dataContext');
                                        done();
                                    });
                                });

                            });

                            describe('and question exists in dataContext', function () {

                                var questionContent = 'questionContent';

                                beforeEach(function () {
                                    dataContext.objectives = [{ id: '', questions: [{ id: questionId }] }];
                                });

                                it('should update title and modification date', function (done) {

                                    var promise = questionRepository.updateContent(questionId, questionContent);
                                    promise.fin(function () {
                                        expect(dataContext.objectives[0].questions[0].content).toEqual(questionContent);
                                        expect(dataContext.objectives[0].questions[0].modifiedOn).toEqual(new Date(response.ModifiedOn));
                                        done();
                                    });
                                });

                                it('should resolve promise with modification date', function (done) {
                                    var promise = questionRepository.updateContent(questionId, questionContent);
                                    promise.fin(function () {
                                        expect(promise).toBeResolvedWith(new Date(response.ModifiedOn));
                                        done();
                                    });
                                });

                            });

                        });

                    });

                });

            });

            describe('updateLearningContentsOrder:', function () {

                it('should be function', function () {
                    expect(questionRepository.updateLearningContentsOrder).toBeFunction();
                });

                it('should return promise', function () {
                    expect(questionRepository.updateLearningContentsOrder()).toBePromise();
                });

                describe('when question id is undefined', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.updateLearningContentsOrder(undefined, []);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question id (string) was expected');
                            done();
                        });
                    });

                });

                describe('when question id is null', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.updateLearningContentsOrder(null, []);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question id (string) was expected');
                            done();
                        });
                    });

                });

                describe('when question id is not a string', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.updateLearningContentsOrder({}, []);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question id (string) was expected');
                            done();
                        });
                    });

                });

                describe('when learning contents is undefined', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.updateLearningContentsOrder('id', undefined);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('learningContents is not array');
                            done();
                        });
                    });

                });

                describe('when learning contents is null', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.updateLearningContentsOrder('id', null);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('learningContents is not array');
                            done();
                        });
                    });

                });

                describe('when learning contents is not an array', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.updateLearningContentsOrder('id', {});

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('learningContents is not array');
                            done();
                        });
                    });

                });

                it('should send request to \'api/question/updateLearningContentsOrder\'', function (done) {
                    var question = 'id',
                        learningContent = 'loid';

                    var promise = questionRepository.updateLearningContentsOrder(question, [{ id: learningContent }]);

                    promise.fin(function () {
                        expect(httpWrapper.post).toHaveBeenCalledWith('api/question/updateLearningContentsOrder', { questionId: question, learningContents: [learningContent] });
                        done();
                    });

                    post.reject('lomai menya polnostju');
                });

                describe('when learning contents order successfully updated on server', function () {

                    describe('and response is not an object', function () {

                        it('should reject promise', function (done) {
                            var question = 'id',
                                learningContent = 'loid';

                            var promise = questionRepository.updateLearningContentsOrder(question, [{ id: learningContent }]);
                            promise.fin(function () {
                                expect(promise).toBeRejectedWith('Response is not an object');
                                done();
                            });

                            post.resolve('lomai menya polnostju');
                        });

                    });

                    describe('and response has no modification date', function () {

                        it('should reject promise', function (done) {
                            var question = 'id',
                                learningContent = 'loid';

                            var promise = questionRepository.updateLearningContentsOrder(question, [{ id: learningContent }]);

                            promise.fin(function () {
                                expect(promise).toBeRejectedWith('Response does not have modification date');
                                done();
                            });

                            post.resolve({});
                        });

                    });

                    describe('and question not found in dataContext', function () {

                        it('should reject promise', function (done) {
                            var question = 'id',
                                learningContent = 'loid',
                                modifiedOn = new Date();

                            dataContext.objectives = [];

                            var promise = questionRepository.updateLearningContentsOrder(question, [{ id: learningContent }]);

                            promise.fin(function () {
                                expect(promise).toBeRejectedWith('Question does not exist in dataContext');
                                done();
                            });

                            post.resolve({ ModifiedOn: modifiedOn.toISOString() });
                        });

                    });

                    it('should resolve promise with modification date', function (done) {
                        var objective = 'Oid',
                            question = 'id',
                            learningContent = 'loid',
                            learningContent2 = 'loid2',
                            modifiedOn = new Date();

                        dataContext.objectives = [{ id: objective, questions: [{ id: question }] }];

                        var promise = questionRepository.updateLearningContentsOrder(question, [{ id: learningContent }, {id: learningContent2}]);

                        promise.fin(function () {
                            expect(promise).toBeResolvedWith(modifiedOn);
                            done();
                        });

                        post.resolve({ ModifiedOn: modifiedOn.toISOString() });
                    });

                });

            });

            describe('getById:', function () {
                var getObjectiveDeferred;
                beforeEach(function () {
                    getObjectiveDeferred = Q.defer();
                    spyOn(objectiveRepository, 'getById').and.returnValue(getObjectiveDeferred.promise);
                });

                describe('when objectiveId is undefined', function () {
                    it('should throw exception', function () {
                        var f = function () {
                            questionRepository.getById(undefined);
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

                describe('when all arguments are valid', function () {

                    it('should return promise', function () {
                        var promise = questionRepository.getById(1, 0);
                        expect(promise).toBePromise();
                    });

                    describe('when objective does not exist', function () {
                        it('should reject promise', function (done) {
                            var promise = questionRepository.getById(-1, 0);
                            getObjectiveDeferred.resolve(null);
                            promise.fin(function () {
                                expect(promise).toBeRejectedWith('Objective does not exist');
                                done();
                            });
                        });
                    });

                    describe('when objective exists', function () {
                        var question = { id: 0, title: 'lalal' };
                        var objective = { id: 1, questions: [] };


                        describe('when question does not exist', function () {
                            beforeEach(function () {
                                objective.questions = [];
                            });

                            it('should reject promise', function (done) {
                                var promise = questionRepository.getById(0, 0);
                                getObjectiveDeferred.resolve(objective);
                                promise.fin(function () {
                                    expect(promise).toBeRejectedWith('Question does not exist');
                                    done();
                                });
                            });
                        });

                        describe('when question exists', function () {
                            beforeEach(function () {
                                objective.questions = [question];
                            });

                            it('should resolve promise with question', function (done) {
                                var promise = questionRepository.getById(0, 0);
                                getObjectiveDeferred.resolve(objective);
                                promise.fin(function () {
                                    expect(promise).toBeResolvedWith(question);
                                    done();
                                });
                            });
                        });
                    });

                });

            });

            describe('updateFillInTheBlank:', function () {

                it('should be function', function () {
                    expect(questionRepository.updateFillInTheBlank).toBeFunction();
                });

                it('should return promise', function () {
                    expect(questionRepository.updateFillInTheBlank()).toBePromise();
                });

                describe('when question id is undefined', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.updateFillInTheBlank(undefined, '');
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question id is not a string');
                            done();
                        });
                    });

                });

                describe('when question id is null', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.updateFillInTheBlank(null, '');
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question id is not a string');
                            done();
                        });
                    });

                });

                describe('when question id is not a string', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.updateFillInTheBlank({}, '');
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question id is not a string');
                            done();
                        });
                    });

                });

                describe('when all arguments are valid', function () {

                    it('should send request to server to api/question/fillintheblank/update', function (done) {
                        var fillInTheBlank = 'fillInTheBlank';
                        var answersCollection = [];

                        post.reject();

                        var promise = questionRepository.updateFillInTheBlank(questionId, fillInTheBlank, answersCollection);
                        promise.fin(function () {
                            expect(httpWrapper.post).toHaveBeenCalledWith('api/question/fillintheblank/update', {
                                questionId: questionId,
                                fillInTheBlank: fillInTheBlank,
                                answersCollection: answersCollection
                            });
                            done();
                        });
                    });

                    describe('and request to server was not successful', function () {

                        it('should reject promise', function (done) {
                            var reason = 'reason';
                            var promise = questionRepository.updateFillInTheBlank('', '');

                            post.reject(reason);
                            promise.fin(function () {
                                expect(promise).toBeRejectedWith(reason);
                                done();
                            });
                        });

                    });

                    describe('and request to server was successful', function () {

                        describe('and response is undefined', function () {

                            it('should reject promise', function (done) {
                                var promise = questionRepository.updateFillInTheBlank('', '');

                                post.resolve(undefined);
                                promise.fin(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                    done();
                                });
                            });

                        });

                        describe('and response is null', function () {

                            it('should reject promise', function (done) {
                                var promise = questionRepository.updateFillInTheBlank('', '');

                                post.resolve(null);
                                promise.fin(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                    done();
                                });
                            });

                        });

                        describe('and response is not an object', function () {

                            it('should reject promise', function (done) {
                                var promise = questionRepository.updateFillInTheBlank('', '');

                                post.resolve('');
                                promise.fin(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                    done();
                                });
                            });

                        });

                        describe('and response is an object', function () {

                            describe('and response does not have question modification date', function () {

                                it('should reject promise', function (done) {
                                    var promise = questionRepository.updateFillInTheBlank('', '');

                                    post.resolve({});
                                    promise.fin(function () {
                                        expect(promise).toBeRejectedWith('Response does not have modification date');
                                        done();
                                    });
                                });

                            });

                            describe('and response has modification date', function () {

                                var createdOnDate = new Date();
                                var response = { ModifiedOn: createdOnDate.toISOString() };

                                beforeEach(function () {
                                    post.resolve(response);
                                });

                                describe('and question does not exist in dataContext', function () {

                                    beforeEach(function () {
                                        dataContext.objectives = [];
                                    });

                                    it('should reject promise', function (done) {
                                        var promise = questionRepository.updateFillInTheBlank('', '', {});
                                        promise.fin(function () {
                                            expect(promise).toBeRejectedWith('Question does not exist in dataContext');
                                            done();
                                        });
                                    });

                                });

                                describe('and question exists in dataContext', function () {

                                    var questionContent = 'questionContent';

                                    beforeEach(function () {
                                        dataContext.objectives = [{ id: '', questions: [{ id: questionId }] }];
                                    });

                                    it('should update content and modification date', function (done) {

                                        var promise = questionRepository.updateFillInTheBlank(questionId, questionContent, {});
                                        promise.fin(function () {
                                            expect(dataContext.objectives[0].questions[0].content).toEqual(questionContent);
                                            expect(dataContext.objectives[0].questions[0].modifiedOn).toEqual(new Date(response.ModifiedOn));
                                            done();
                                        });
                                    });

                                    it('should resolve promise with modification date', function (done) {
                                        var promise = questionRepository.updateFillInTheBlank(questionId, questionContent, {});
                                        promise.fin(function () {
                                            expect(promise).toBeResolvedWith(new Date(response.ModifiedOn));
                                            done();
                                        });
                                    });

                                });

                            });

                        });

                    });

                });

            });

            describe('getFillInTheBlank:', function () {

                it('should be function', function () {
                    expect(questionRepository.getFillInTheBlank).toBeFunction();
                });

                it('should return promise', function () {
                    expect(questionRepository.getFillInTheBlank()).toBePromise();
                });

                describe('when question id is undefined', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.getFillInTheBlank(undefined);
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question id is not a string');
                            done();
                        });
                    });

                });

                describe('when question id is null', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.getFillInTheBlank(null);
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question id is not a string');
                            done();
                        });
                    });

                });

                describe('when question id is not a string', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.getFillInTheBlank({}, '');
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question id is not a string');
                            done();
                        });
                    });

                });

                it('should send request to server to api/question/fillintheblank', function (done) {
                    post.reject();

                    var promise = questionRepository.getFillInTheBlank(questionId);
                    promise.fin(function () {
                        expect(httpWrapper.post).toHaveBeenCalledWith('api/question/fillintheblank', {
                            questionId: questionId
                        });
                        done();
                    });
                });

                describe('when request to server was not successful', function () {

                    it('should reject promise', function (done) {
                        var reason = 'reason';
                        var promise = questionRepository.getFillInTheBlank(questionId);

                        post.reject(reason);
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith(reason);
                            done();
                        });
                    });

                });

                describe('when response is undefined', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.getFillInTheBlank(questionId);

                        post.resolve(undefined);
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });
                    });

                });

                describe('when response is null', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.getFillInTheBlank(questionId);

                        post.resolve(null);
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });
                    });

                });

                describe('when response is not an object', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.getFillInTheBlank(questionId);

                        post.resolve('');
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });
                    });

                });

            });

            describe('getQuestionFeedback:', function () {

                it('should be function', function () {
                    expect(questionRepository.getQuestionFeedback).toBeFunction();
                });

                it('should return promise', function () {
                    expect(questionRepository.getQuestionFeedback()).toBePromise();
                });

                describe('when question id is undefined', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.getQuestionFeedback(undefined);
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question id is not a string');
                            done();
                        });
                    });

                });

                describe('when question id is not a string', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.getQuestionFeedback({});
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question id is not a string');
                            done();
                        });
                    });

                });

                describe('when question id is valid', function () {

                    it('should send request to server to api/question/getQuestionFeedback', function (done) {
                        post.reject();

                        var promise = questionRepository.getQuestionFeedback(questionId);
                        promise.fin(function () {
                            expect(httpWrapper.post).toHaveBeenCalledWith('api/question/getQuestionFeedback', {
                                questionId: questionId
                            });
                            done();
                        });
                    });

                    describe('and request to server was not successful', function () {

                        it('should reject promise', function (done) {
                            var reason = 'reason';
                            var promise = questionRepository.getQuestionFeedback(questionId);

                            post.reject(reason);
                            promise.fin(function () {
                                expect(promise).toBeRejectedWith(reason);
                                done();
                            });
                        });

                    });

                    describe('and request to server was successful', function () {

                        describe('and response is undefined', function () {

                            it('should reject promise', function (done) {
                                var promise = questionRepository.getQuestionFeedback(questionId);

                                post.resolve(undefined);
                                promise.fin(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                    done();
                                });
                            });

                        });

                        describe('and response is null', function () {

                            it('should reject promise', function (done) {
                                var promise = questionRepository.getQuestionFeedback(questionId);

                                post.resolve(null);
                                promise.fin(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                    done();
                                });
                            });

                        });

                        describe('and response is not an object', function () {

                            it('should reject promise', function (done) {
                                var promise = questionRepository.getQuestionFeedback(questionId);

                                post.resolve('');
                                promise.fin(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                    done();
                                });
                            });

                        });

                        describe('and response is an object', function () {

                            describe('and response does not have question modification date', function () {

                                it('should reject promise', function (done) {
                                    var promise = questionRepository.getQuestionFeedback(questionId);

                                    post.resolve({});
                                    promise.fin(function () {
                                        expect(promise).toBeRejectedWith('Response does not have modification date');
                                        done();
                                    });
                                });

                            });

                            describe('and response has modification date', function () {

                                var createdOnDate = new Date();
                                var response = {
                                    ModifiedOn: createdOnDate.toISOString(),
                                    CorrectFeedbackText: 'correct text',
                                    IncorrectFeedbackText: 'incorrect text'
                                };

                                beforeEach(function () {
                                    post.resolve(response);
                                });

                                describe('and question does not exist in dataContext', function () {

                                    beforeEach(function () {
                                        dataContext.objectives = [];
                                    });

                                    it('should reject promise', function (done) {
                                        var promise = questionRepository.getQuestionFeedback(questionId);
                                        promise.fin(function () {
                                            expect(promise).toBeRejectedWith('Question does not exist in dataContext');
                                            done();
                                        });
                                    });

                                });

                                describe('and question exists in dataContext', function () {

                                    beforeEach(function () {
                                        dataContext.objectives = [{ id: '', questions: [{ id: questionId, feedback: {} }] }];
                                    });

                                    it('should update modification date', function (done) {
                                        var promise = questionRepository.getQuestionFeedback(questionId);
                                        promise.fin(function () {
                                            expect(dataContext.objectives[0].questions[0].modifiedOn).toEqual(new Date(response.ModifiedOn));
                                            done();
                                        });
                                    });

                                    it('should resolve promise with feedback texts', function (done) {
                                        var promise = questionRepository.getQuestionFeedback(questionId);
                                        promise.fin(function () {
                                            expect(promise).toBeResolvedWith({
                                                correctFeedbackText: response.CorrectFeedbackText,
                                                incorrectFeedbackText: response.IncorrectFeedbackText
                                            });
                                            done();
                                        });
                                    });

                                });

                            });

                        });

                    });

                });

            });

            describe('updateCorrectFeedback:', function () {

                it('should be function', function () {
                    expect(questionRepository.updateCorrectFeedback).toBeFunction();
                });

                it('should return promise', function () {
                    expect(questionRepository.updateCorrectFeedback()).toBePromise();
                });

                var feedbackText;
                describe('when question id is undefined', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.updateCorrectFeedback(undefined, feedbackText);
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question id is not a string');
                            done();
                        });
                    });

                });

                describe('when question id is not a string', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.updateCorrectFeedback({}, feedbackText);
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question id is not a string');
                            done();
                        });
                    });

                });

                describe('when all arguments are valid', function () {

                    beforeEach(function () {
                        feedbackText = 'correct feedback text';
                    });

                    it('should send request to server to api/question/updateCorrectFeedback', function (done) {
                        post.reject();

                        var promise = questionRepository.updateCorrectFeedback(questionId, feedbackText);
                        promise.fin(function () {
                            expect(httpWrapper.post).toHaveBeenCalledWith('api/question/updateCorrectFeedback', {
                                questionId: questionId,
                                feedbackText: feedbackText
                            });
                            done();
                        });
                    });

                    describe('and request to server was not successful', function () {

                        it('should reject promise', function (done) {
                            var reason = 'reason';
                            var promise = questionRepository.updateCorrectFeedback(questionId, feedbackText);

                            post.reject(reason);
                            promise.fin(function () {
                                expect(promise).toBeRejectedWith(reason);
                                done();
                            });
                        });

                    });

                    describe('and request to server was successful', function () {

                        describe('and response is undefined', function () {

                            it('should reject promise', function (done) {
                                var promise = questionRepository.updateCorrectFeedback(questionId, feedbackText);

                                post.resolve(undefined);
                                promise.fin(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                    done();
                                });
                            });

                        });

                        describe('and response is null', function () {

                            it('should reject promise', function (done) {
                                var promise = questionRepository.updateCorrectFeedback(questionId, feedbackText);

                                post.resolve(null);
                                promise.fin(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                    done();
                                });
                            });

                        });

                        describe('and response is not an object', function () {

                            it('should reject promise', function (done) {
                                var promise = questionRepository.updateCorrectFeedback(questionId, feedbackText);

                                post.resolve('');
                                promise.fin(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                    done();
                                });
                            });

                        });

                        describe('and response is an object', function () {

                            describe('and response does not have question modification date', function () {

                                it('should reject promise', function (done) {
                                    var promise = questionRepository.updateCorrectFeedback(questionId, feedbackText);

                                    post.resolve({});
                                    promise.fin(function () {
                                        expect(promise).toBeRejectedWith('Response does not have modification date');
                                        done();
                                    });
                                });

                            });

                            describe('and response has modification date', function () {

                                var createdOnDate = new Date();
                                var response = { ModifiedOn: createdOnDate.toISOString() };

                                beforeEach(function () {
                                    post.resolve(response);
                                });

                                describe('and question does not exist in dataContext', function () {

                                    beforeEach(function () {
                                        dataContext.objectives = [];
                                    });

                                    it('should reject promise', function (done) {
                                        var promise = questionRepository.updateCorrectFeedback(questionId, feedbackText);
                                        promise.fin(function () {
                                            expect(promise).toBeRejectedWith('Question does not exist in dataContext');
                                            done();
                                        });
                                    });

                                });

                                describe('and question exists in dataContext', function () {

                                    beforeEach(function () {
                                        dataContext.objectives = [{ id: '', questions: [{ id: questionId, feedback: {} }] }];
                                    });

                                    it('should update modification date', function (done) {
                                        var promise = questionRepository.updateCorrectFeedback(questionId, feedbackText);
                                        promise.fin(function () {
                                            expect(dataContext.objectives[0].questions[0].modifiedOn).toEqual(new Date(response.ModifiedOn));
                                            done();
                                        });
                                    });

                                    it('should resolve promise with modification date', function (done) {
                                        var promise = questionRepository.updateCorrectFeedback(questionId, feedbackText);
                                        promise.fin(function () {
                                            expect(promise).toBeResolvedWith(new Date(response.ModifiedOn));
                                            done();
                                        });
                                    });

                                });

                            });

                        });

                    });

                });

            });

            describe('updateIncorrectFeedback:', function () {

                it('should be function', function () {
                    expect(questionRepository.updateIncorrectFeedback).toBeFunction();
                });

                it('should return promise', function () {
                    expect(questionRepository.updateIncorrectFeedback()).toBePromise();
                });

                var feedbackText;
                describe('when question id is undefined', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.updateIncorrectFeedback(undefined, feedbackText);
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question id is not a string');
                            done();
                        });
                    });

                });

                describe('when question id is not a string', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.updateIncorrectFeedback({}, feedbackText);
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question id is not a string');
                            done();
                        });
                    });

                });

                describe('when all arguments are valid', function () {

                    beforeEach(function () {
                        feedbackText = 'incorrect feedback text';
                    });

                    it('should send request to server to api/question/updateIncorrectFeedback', function (done) {
                        post.reject();

                        var promise = questionRepository.updateIncorrectFeedback(questionId, feedbackText);
                        promise.fin(function () {
                            expect(httpWrapper.post).toHaveBeenCalledWith('api/question/updateIncorrectFeedback', {
                                questionId: questionId,
                                feedbackText: feedbackText
                            });
                            done();
                        });
                    });

                    describe('and request to server was not successful', function () {

                        it('should reject promise', function (done) {
                            var reason = 'reason';
                            var promise = questionRepository.updateIncorrectFeedback(questionId, feedbackText);

                            post.reject(reason);
                            promise.fin(function () {
                                expect(promise).toBeRejectedWith(reason);
                                done();
                            });
                        });

                    });

                    describe('and request to server was successful', function () {

                        describe('and response is undefined', function () {

                            it('should reject promise', function (done) {
                                var promise = questionRepository.updateIncorrectFeedback(questionId, feedbackText);

                                post.resolve(undefined);
                                promise.fin(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                    done();
                                });
                            });

                        });

                        describe('and response is null', function () {

                            it('should reject promise', function (done) {
                                var promise = questionRepository.updateIncorrectFeedback(questionId, feedbackText);

                                post.resolve(null);
                                promise.fin(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                    done();
                                });
                            });

                        });

                        describe('and response is not an object', function () {

                            it('should reject promise', function (done) {
                                var promise = questionRepository.updateIncorrectFeedback(questionId, feedbackText);

                                post.resolve('');
                                promise.fin(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                    done();
                                });
                            });

                        });

                        describe('and response is an object', function () {

                            describe('and response does not have question modification date', function () {

                                it('should reject promise', function (done) {
                                    var promise = questionRepository.updateIncorrectFeedback(questionId, feedbackText);

                                    post.resolve({});
                                    promise.fin(function () {
                                        expect(promise).toBeRejectedWith('Response does not have modification date');
                                        done();
                                    });
                                });

                            });

                            describe('and response has modification date', function () {

                                var createdOnDate = new Date();
                                var response = { ModifiedOn: createdOnDate.toISOString() };

                                beforeEach(function () {
                                    post.resolve(response);
                                });

                                describe('and question does not exist in dataContext', function () {

                                    beforeEach(function () {
                                        dataContext.objectives = [];
                                    });

                                    it('should reject promise', function (done) {
                                        var promise = questionRepository.updateIncorrectFeedback(questionId, feedbackText);
                                        promise.fin(function () {
                                            expect(promise).toBeRejectedWith('Question does not exist in dataContext');
                                            done();
                                        });
                                    });

                                });

                                describe('and question exists in dataContext', function () {

                                    beforeEach(function () {
                                        dataContext.objectives = [{ id: '', questions: [{ id: questionId, feedback: {} }] }];
                                    });

                                    it('should update modification date', function (done) {
                                        var promise = questionRepository.updateIncorrectFeedback(questionId, feedbackText);
                                        promise.fin(function () {
                                            expect(dataContext.objectives[0].questions[0].modifiedOn).toEqual(new Date(response.ModifiedOn));
                                            done();
                                        });
                                    });

                                    it('should resolve promise with modification date', function (done) {
                                        var promise = questionRepository.updateIncorrectFeedback(questionId, feedbackText);
                                        promise.fin(function () {
                                            expect(promise).toBeResolvedWith(new Date(response.ModifiedOn));
                                            done();
                                        });
                                    });

                                });

                            });

                        });

                    });

                });

            });

            describe('copyQuestion:', function () {

                it('should be function', function () {
                    expect(questionRepository.copyQuestion).toBeFunction();
                });

                it('should return promise', function () {
                    expect(questionRepository.copyQuestion()).toBePromise();
                });

                describe('when questionId is undefined', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.copyQuestion(undefined);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question id is not a string');
                            done();
                        });
                    });

                });

                describe('when questionId is null', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.copyQuestion(null);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question id is not a string');
                            done();
                        });
                    });

                });

                describe('when questionId is not a string', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.copyQuestion({});

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question id is not a string');
                            done();
                        });
                    });

                });

                describe('when objectiveId is undefined', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.copyQuestion('', undefined);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Objective id is not a string');
                            done();
                        });
                    });

                });

                describe('when objectiveId is null', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.copyQuestion('', null);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Objective id is not a string');
                            done();
                        });
                    });

                });

                describe('when objectiveId is not a string', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.copyQuestion('', {});

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Objective id is not a string');
                            done();
                        });
                    });

                });

                it('should send request to server to api/question/copy', function (done) {
                    var objectiveId = 'objectiveId';
                    post.reject();

                    var promise = questionRepository.copyQuestion(questionId, objectiveId);

                    promise.fin(function () {
                        expect(httpWrapper.post).toHaveBeenCalledWith('api/question/copy', {
                            questionId: questionId,
                            objectiveId: objectiveId
                        });
                        done();
                    });
                });

                describe('when request to server was not successful', function () {

                    it('should reject promise', function (done) {
                        var reason = 'reason';
                        var promise = questionRepository.copyQuestion('questionId', 'objectiveId');

                        post.reject(reason);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith(reason);
                            done();
                        });
                    });

                });

                describe('when response is undefined', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.copyQuestion('questionId', 'objectiveId');

                        post.resolve(undefined);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });
                    });

                });

                describe('when response is null', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.copyQuestion('questionId', 'objectiveId');

                        post.resolve(null);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });
                    });

                });

                describe('when response is not an object', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.copyQuestion('questionId', 'objectiveId');

                        post.resolve('');

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });
                    });

                });

                describe('when response is correct', function () {

                    var createdOnDate = new Date(),
                        response = {},
                        mappedQuestion = {
                            createdOn: createdOnDate.toISOString()
                        },
                        objective = {
                            id: 'objectiveId',
                            questions: []
                        };

                    beforeEach(function () {
                        post.resolve(response);
                        dataContext.objectives = [objective];
                        spyOn(questionModelMapper, 'map').and.returnValue(mappedQuestion);
                    });

                    describe('and destination objective does not exist in dataContext', function () {

                        it('should reject promise', function (done) {
                            dataContext.objectives = [];

                            var promise = questionRepository.copyQuestion('questionId', 'objectiveId');

                            promise.fin(function () {
                                expect(promise).toBeRejectedWith('Objective does not exist in dataContext');
                                done();
                            });
                        });

                    });

                    it('should get question model from response', function (done) {
                        var promise = questionRepository.copyQuestion('questionId', 'objectiveId');

                        promise.fin(function () {
                            expect(questionModelMapper.map).toHaveBeenCalledWith(response);
                            done();
                        });
                    });

                    it('should add copied question to objective', function (done) {
                        objective.questions = [];

                        var promise = questionRepository.copyQuestion(questionId, objective.id);

                        promise.fin(function () {
                            expect(objective.questions.length).toEqual(1);
                            expect(objective.questions[0]).toEqual(mappedQuestion);
                            done();
                        });
                    });

                    it('should update objective modification date', function (done) {
                        objective.ModifiedOn = null;

                        var promise = questionRepository.copyQuestion(questionId, objective.id);

                        promise.fin(function () {
                            expect(objective.modifiedOn).toEqual(mappedQuestion.createdOn);
                            done();
                        });
                    });

                    it('should trigger event \'question:created\'', function (done) {
                        var promise = questionRepository.copyQuestion(questionId, objective.id);

                        promise.fin(function () {
                            expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.created, objective.id, mappedQuestion);
                            done();
                        });
                    });

                    it('should resolve promise with copied question', function (done) {
                        var promise = questionRepository.copyQuestion(questionId, objective.id);

                        promise.fin(function () {
                            expect(promise.inspect().value).toBe(mappedQuestion);
                            done();
                        });
                    });

                });

            });

            describe('moveQuestion:', function () {
                var sourceObjectiveId = 'sourceObjectiveId';
                var destinationObjectiveId = 'destinationObjectiveId';


                it('should be function', function () {
                    expect(questionRepository.moveQuestion).toBeFunction();
                });

                it('should return promise', function () {
                    expect(questionRepository.moveQuestion()).toBePromise();
                });


                describe('when questionId is undefined', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.moveQuestion(undefined);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question id is not a string');
                            done();
                        });
                    });

                });

                describe('when questionId is null', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.moveQuestion(null);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question id is not a string');
                            done();
                        });
                    });

                });

                describe('when questionId is not a string', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.moveQuestion({});

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question id is not a string');
                            done();
                        });
                    });

                });

                describe('when sourceObjectiveId is undefined', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.moveQuestion('', undefined);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Source objective id is not a string');
                            done();
                        });
                    });

                });

                describe('when sourceObjectiveId is null', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.moveQuestion('', null);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Source objective id is not a string');
                            done();
                        });
                    });

                });

                describe('when sourceObjectiveId is not a string', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.moveQuestion('', {});

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Source objective id is not a string');
                            done();
                        });
                    });

                });

                describe('when destinationObjectiveId is undefined', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.moveQuestion('', '', undefined);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Destination objective id is not a string');
                            done();
                        });
                    });

                });

                describe('when destinationObjectiveId is null', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.moveQuestion('', '', null);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Destination objective id is not a string');
                            done();
                        });
                    });

                });

                describe('when destinationObjectiveId is not a string', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.moveQuestion('', '', {});

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Destination objective id is not a string');
                            done();
                        });
                    });

                });

                it('should send request to server to api/question/move', function (done) {
                    post.reject();

                    var promise = questionRepository.moveQuestion(questionId, sourceObjectiveId, destinationObjectiveId);

                    promise.fin(function () {
                        expect(httpWrapper.post).toHaveBeenCalledWith('api/question/move', {
                            questionId: questionId,
                            objectiveId: destinationObjectiveId
                        });
                        done();
                    });
                });

                describe('when request to server was not successful', function () {

                    it('should reject promise', function (done) {
                        var reason = 'reason';
                        var promise = questionRepository.moveQuestion(questionId, sourceObjectiveId, destinationObjectiveId);

                        post.reject(reason);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith(reason);
                            done();
                        });
                    });

                });

                describe('when response is undefined', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.moveQuestion(questionId, sourceObjectiveId, destinationObjectiveId);

                        post.resolve(undefined);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });
                    });

                });

                describe('when response is null', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.moveQuestion(questionId, sourceObjectiveId, destinationObjectiveId);

                        post.resolve(null);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });
                    });

                });

                describe('when response is not an object', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.moveQuestion(questionId, sourceObjectiveId, destinationObjectiveId);

                        post.resolve('');

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });
                    });

                });

                describe('when response does not have a question creation date', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.moveQuestion(questionId, sourceObjectiveId, destinationObjectiveId);

                        post.resolve({});

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response does not have modification date');
                            done();
                        });
                    });

                });

                describe('when response is correct', function () {
                    var modifiedOnDate = new Date(),
                        response = {
                            ModifiedOn: modifiedOnDate.toISOString()
                        },
                        question = {
                            id: questionId
                        },
                        sourceObjective = {
                            id: sourceObjectiveId,
                            questions: []
                        },
                        destinationObjective = {
                            id: destinationObjectiveId,
                            questions: []
                        };

                    beforeEach(function () {
                        post.resolve(response);
                        sourceObjective.questions = [question];
                        dataContext.objectives = [sourceObjective, destinationObjective];
                    });

                    describe('and source objective does not exist in dataContext', function () {

                        it('should reject promise', function (done) {
                            dataContext.objectives = [];

                            var promise = questionRepository.moveQuestion(questionId, sourceObjectiveId, destinationObjectiveId);

                            promise.fin(function () {
                                expect(promise).toBeRejectedWith('Source objective does not exist in dataContext');
                                done();
                            });
                        });

                    });

                    describe('and destination objective does not exist in dataContext', function () {

                        it('should reject promise', function (done) {
                            dataContext.objectives = [sourceObjective];

                            var promise = questionRepository.moveQuestion(questionId, sourceObjectiveId, destinationObjectiveId);

                            promise.fin(function () {
                                expect(promise).toBeRejectedWith('Destination objective does not exist in dataContext');
                                done();
                            });
                        });

                    });

                    describe('and source objective does not contain question', function() {

                        it('should reject promise', function (done) {
                            sourceObjective.questions = [];

                            var promise = questionRepository.moveQuestion(questionId, sourceObjectiveId, destinationObjectiveId);

                            promise.fin(function () {
                                expect(promise).toBeRejectedWith('Source objective does not contain moved question');
                                done();
                            });
                        });

                    });

                    it('should remove question from source objective', function(done) {
                        var promise = questionRepository.moveQuestion(questionId, sourceObjectiveId, destinationObjectiveId);

                        promise.fin(function () {
                            expect(sourceObjective.questions.length).toBe(0);
                            done();
                        });
                    });

                    it('should update modification date of source objective', function (done) {
                        sourceObjective.modifiedOn = null;

                        var promise = questionRepository.moveQuestion(questionId, sourceObjectiveId, destinationObjectiveId);

                        promise.fin(function () {
                            expect(sourceObjective.modifiedOn).toEqual(new Date(response.ModifiedOn));
                            done();
                        });
                    });

                    it('should add question to destination objective', function (done) {
                        destinationObjective.questions = [];

                        var promise = questionRepository.moveQuestion(questionId, sourceObjectiveId, destinationObjectiveId);

                        promise.fin(function () {
                            expect(destinationObjective.questions.length).toBe(1);
                            done();
                        });
                    });

                    it('should update modification date of destination objective', function (done) {
                        destinationObjective.modifiedOn = null;

                        var promise = questionRepository.moveQuestion(questionId, sourceObjectiveId, destinationObjectiveId);

                        promise.fin(function () {
                            expect(destinationObjective.modifiedOn).toEqual(new Date(response.ModifiedOn));
                            done();
                        });
                    });

                    it('should trigger event \'questions:deleted\'', function (done) {
                        var promise = questionRepository.moveQuestion(questionId, sourceObjectiveId, destinationObjectiveId);

                        promise.fin(function () {
                            expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.deleted, sourceObjective.id, [question.id]);
                            done();
                        });
                    });
                    it('should trigger event \'question:created\'', function (done) {
                        var promise = questionRepository.moveQuestion(questionId, sourceObjectiveId, destinationObjectiveId);

                        promise.fin(function () {
                            expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.created, destinationObjective.id, question);
                            done();
                        });
                    });

                });

            });

        });
    });