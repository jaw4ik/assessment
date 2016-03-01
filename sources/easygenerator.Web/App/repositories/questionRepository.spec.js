import questionRepository from './questionRepository';

import sectionRepository from './sectionRepository';
import app from 'durandal/app';
import dataContext from 'dataContext';
import constants from 'constants';
import apiHttpWrapper from 'http/apiHttpWrapper';
import QuestionModel from 'models/question';
import questionModelMapper from 'mappers/questionModelMapper';

var questionType = 0,
    questionId = 'questionId';

describe('[questionRepository]', function () {

    var post;

    beforeEach(function () {
        post = Q.defer();
        spyOn(apiHttpWrapper, 'post').and.returnValue(post.promise);
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

        describe('when sectionId is undefined', function () {

            it('should reject promise', function (done) {
                var promise = questionRepository.addQuestion(undefined, {});

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section id is not a string');
                    done();
                });
            });

        });

        describe('when sectionId is null', function () {

            it('should reject promise', function (done) {
                var promise = questionRepository.addQuestion(null, {});

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section id is not a string');
                    done();
                });
            });

        });

        describe('when sectionId is not a string', function () {

            it('should reject promise', function (done) {
                var promise = questionRepository.addQuestion({}, {});

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section id is not a string');
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

        describe('when section id is a string and question data is an object', function () {

            it('should send request to server to api/question/{type}/create', function (done) {
                var sectionId = 'sectionId';
                var question = { title: 'title', description: 'description' };
                post.reject();

                var promise = questionRepository.addQuestion(sectionId, question, questionType);

                promise.fin(function () {
                    expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/question/' + questionType + '/create', {
                        sectionId: sectionId,
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

                    describe('and section does not exist in dataContext', function () {

                        it('should reject promise', function (done) {
                            dataContext.sections = [];

                            var promise = questionRepository.addQuestion('', {});

                            promise.fin(function () {
                                expect(promise).toBeRejectedWith('Section does not exist in dataContext');
                                done();
                            });
                        });

                    });

                    describe('and section exists in dataContext', function () {

                        var section = {
                            id: 'sectionId',
                            questions: []
                        };

                        beforeEach(function () {
                            section.questions = [];
                            dataContext.sections = [section];
                        });

                        it('should add question to section', function (done) {
                            var question = { title: 'title' };
                            var promise = questionRepository.addQuestion(section.id, question, questionType);

                            promise.fin(function () {
                                expect(section.questions.length).toEqual(1);
                                expect(section.questions[0]).toEqual(new QuestionModel({
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

                        it('should update section modification date', function (done) {
                            var promise = questionRepository.addQuestion(section.id, {});

                            promise.fin(function () {
                                expect(section.modifiedOn).toEqual(new Date(createdOnDate.toISOString()));
                                done();
                            });
                        });

                        it('should trigger event \'question:created\'', function (done) {
                            var question = { title: 'title' };
                            var promise = questionRepository.addQuestion(section.id, question, questionType);
                            promise.fin(function () {
                                expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.created, section.id, new QuestionModel({
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
                            var promise = questionRepository.addQuestion(section.id, {});

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

        describe('when section id is undefined', function () {

            it('should reject promise', function (done) {
                var promise = questionRepository.removeQuestions(undefined, {});

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section id is not a string');
                    done();
                });
            });

        });

        describe('when section id is null', function () {

            it('should reject promise', function (done) {
                var promise = questionRepository.removeQuestions(null, {});

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section id is not a string');
                    done();
                });
            });

        });

        describe('when section id is not a string', function () {

            it('should reject promise', function (done) {
                var promise = questionRepository.removeQuestions({}, {});

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section id is not a string');
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
            var section;
            var questionIds;

            beforeEach(function () {
                section = { id: "SomeSectionId" };
                questionIds = ["SomeQuestionId1", "SomeQuestionId2"];
            });

            it('should send request to server to api/question/delete', function (done) {
                post.reject();

                var promise = questionRepository.removeQuestions(section.id, questionIds);
                promise.fin(function () {
                    expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/question/delete', {
                        sectionId: section.id,
                        questions: ['SomeQuestionId1', 'SomeQuestionId2']
                    });
                    done();
                });
            });

            describe('and request to server was not successful', function () {

                it('should reject promise', function (done) {
                    var reason = 'reason';
                    var promise = questionRepository.removeQuestions(section.id, questionIds);

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
                        var promise = questionRepository.removeQuestions(section.id, questionIds);

                        post.resolve(null);
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });
                    });

                });

                describe('and response is undefined', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.removeQuestions(section.id, questionIds);

                        post.resolve(undefined);
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });
                    });

                });

                describe('and response is not an object', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.removeQuestions(section.id, questionIds);

                        post.resolve('');
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });
                    });

                });

                describe('and response does not have modification date', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.removeQuestions(section.id, questionIds);

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

                    describe('and section does not exist in dataContext', function () {

                        beforeEach(function () {
                            dataContext.sections = [];
                        });

                        it('should reject promise', function (done) {
                            var promise = questionRepository.removeQuestions(section.id, questionIds);
                            promise.fin(function () {
                                expect(promise).toBeRejectedWith('Section does not exist in dataContext');
                                done();
                            });
                        });

                    });

                    describe('and section exists in dataContext', function () {

                        beforeEach(function () {
                            dataContext.sections = [{ id: section.id, questions: [{ id: "SomeQuestionId1" }, { id: "SomeQuestionId2" }] }];
                        });

                        it('should remove questions from section', function (done) {
                            var promise = questionRepository.removeQuestions(section.id, questionIds);
                            promise.fin(function () {
                                expect(dataContext.sections[0].questions.length).toEqual(0);
                                done();
                            });
                        });

                        it('should update section modification date', function (done) {
                            var promise = questionRepository.removeQuestions(section.id, questionIds);
                            promise.fin(function () {
                                expect(dataContext.sections[0].modifiedOn).toEqual(new Date(response.ModifiedOn));
                                done();
                            });
                        });

                        it('should trigger event \'questions:deleted\'', function (done) {
                            var promise = questionRepository.removeQuestions(section.id, questionIds);
                            promise.fin(function () {
                                expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.deleted, section.id, questionIds);
                                done();
                            });
                        });

                        it('should resolve promise with modification date', function (done) {
                            var promise = questionRepository.removeQuestions(section.id, questionIds);
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
                    expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/question/updateTitle', {
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
                            dataContext.sections = [];
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
                            dataContext.sections = [{ id: '', questions: [{ id: questionId }] }];
                        });

                        it('should update title and modification date', function (done) {
                            var promise = questionRepository.updateTitle(questionId, questionTitle);
                            promise.fin(function () {
                                expect(dataContext.sections[0].questions[0].title).toEqual(questionTitle);
                                expect(dataContext.sections[0].questions[0].modifiedOn).toEqual(new Date(response.ModifiedOn));
                                done();
                            });
                        });

                        it('should trigger event \'question:titleUpdated\'', function (done) {
                            var promise = questionRepository.updateTitle(questionId, questionTitle);
                            promise.fin(function () {
                                expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.titleUpdated, dataContext.sections[0].questions[0]);
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

    describe('updateVoiceOver:', function () {

        it('should be function', function () {
            expect(questionRepository.updateVoiceOver).toBeFunction();
        });

        it('should return promise', function () {
            expect(questionRepository.updateVoiceOver()).toBePromise();
        });

        describe('when question id is null', function () {

            it('should reject promise', function (done) {
                var promise = questionRepository.updateVoiceOver(null, '');
                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Question id is not a string');
                    done();
                });
            });

        });

        describe('when question id is undefined', function () {

            it('should reject promise', function (done) {
                var promise = questionRepository.updateVoiceOver(undefined, '');
                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Question id is not a string');
                    done();
                });
            });

        });

        describe('when question id is not a string', function () {

            it('should reject promise', function (done) {
                var promise = questionRepository.updateVoiceOver({}, '');
                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Question id is not a string');
                    done();
                });
            });

        });
             
        describe('when all arguments are valid', function () {

            it('should send request to server to api/question/updateVoiceOver', function (done) {
                var questionVoiceOver = 'questionVoiceOver';

                post.reject();

                var promise = questionRepository.updateVoiceOver(questionId, questionVoiceOver);
                promise.fin(function () {
                    expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/question/updateVoiceOver', {
                        questionId: questionId,
                        voiceOver: questionVoiceOver
                    });
                    done();
                });
            });

            describe('and request to server was not successful', function () {

                it('should reject promise', function (done) {
                    var reason = 'reason';
                    var promise = questionRepository.updateVoiceOver('', '');

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
                        var promise = questionRepository.updateVoiceOver('', '');

                        post.resolve(undefined);
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });
                    });

                });

                describe('and response is null', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.updateVoiceOver('', '');

                        post.resolve(null);
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });
                    });

                });

                describe('and response is not an object', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.updateVoiceOver('', '');

                        post.resolve('');
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });
                    });

                });

                describe('and response does not have question modification date', function () {

                    it('should reject promise', function (done) {
                        var promise = questionRepository.updateVoiceOver('', '');

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
                            dataContext.sections = [];
                        });

                        it('should reject promise', function (done) {
                            var promise = questionRepository.updateVoiceOver('', '');
                            promise.fin(function () {
                                expect(promise).toBeRejectedWith('Question does not exist in dataContext');
                                done();
                            });
                        });

                    });

                    describe('and question exists in dataContext', function () {

                        var questionVoiceOver = 'questionVoiceOver';

                        beforeEach(function () {
                            dataContext.sections = [{ id: '', questions: [{ id: questionId }] }];
                        });

                        it('should update title and modification date', function (done) {
                            var promise = questionRepository.updateVoiceOver(questionId, questionVoiceOver);
                            promise.fin(function () {
                                expect(dataContext.sections[0].questions[0].voiceOver).toEqual(questionVoiceOver);
                                expect(dataContext.sections[0].questions[0].modifiedOn).toEqual(new Date(response.ModifiedOn));
                                done();
                            });
                        });

                        it('should resolve promise with modification date', function (done) {
                            var promise = questionRepository.updateVoiceOver(questionId, questionVoiceOver);
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
                    expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/question/updateContent', {
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
                            dataContext.sections = [];
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
                            dataContext.sections = [{ id: '', questions: [{ id: questionId }] }];
                        });

                        it('should update title and modification date', function (done) {

                            var promise = questionRepository.updateContent(questionId, questionContent);
                            promise.fin(function () {
                                expect(dataContext.sections[0].questions[0].content).toEqual(questionContent);
                                expect(dataContext.sections[0].questions[0].modifiedOn).toEqual(new Date(response.ModifiedOn));
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
                expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/question/updateLearningContentsOrder', { questionId: question, learningContents: [learningContent] });
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

                    dataContext.sections = [];

                    var promise = questionRepository.updateLearningContentsOrder(question, [{ id: learningContent }]);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Question does not exist in dataContext');
                        done();
                    });

                    post.resolve({ ModifiedOn: modifiedOn.toISOString() });
                });

            });

            it('should resolve promise with modification date', function (done) {
                var section = 'Oid',
                    question = 'id',
                    learningContent = 'loid',
                    learningContent2 = 'loid2',
                    modifiedOn = new Date();

                dataContext.sections = [{ id: section, questions: [{ id: question }] }];

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
        var getSectionDeferred;
        beforeEach(function () {
            getSectionDeferred = Q.defer();
            spyOn(sectionRepository, 'getById').and.returnValue(getSectionDeferred.promise);
        });

        describe('when sectionId is undefined', function () {
            it('should throw exception', function () {
                var f = function () {
                    questionRepository.getById(undefined);
                };
                expect(f).toThrow();
            });
        });

        describe('when sectionId is null', function () {
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

            describe('when section does not exist', function () {
                it('should reject promise', function (done) {
                    var promise = questionRepository.getById(-1, 0);
                    getSectionDeferred.resolve(null);
                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Section does not exist');
                        done();
                    });
                });
            });

            describe('when section exists', function () {
                var question = { id: 0, title: 'lalal' };
                var section = { id: 1, questions: [] };


                describe('when question does not exist', function () {
                    beforeEach(function () {
                        section.questions = [];
                    });

                    it('should reject promise', function (done) {
                        var promise = questionRepository.getById(0, 0);
                        getSectionDeferred.resolve(section);
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question does not exist');
                            done();
                        });
                    });
                });

                describe('when question exists', function () {
                    beforeEach(function () {
                        section.questions = [question];
                    });

                    it('should resolve promise with question', function (done) {
                        var promise = questionRepository.getById(0, 0);
                        getSectionDeferred.resolve(section);
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
                    expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/question/fillintheblank/update', {
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
                                dataContext.sections = [];
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
                                dataContext.sections = [{ id: '', questions: [{ id: questionId }] }];
                            });

                            it('should update content and modification date', function (done) {

                                var promise = questionRepository.updateFillInTheBlank(questionId, questionContent, {});
                                promise.fin(function () {
                                    expect(dataContext.sections[0].questions[0].content).toEqual(questionContent);
                                    expect(dataContext.sections[0].questions[0].modifiedOn).toEqual(new Date(response.ModifiedOn));
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
                expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/question/fillintheblank', {
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
                    expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/question/getQuestionFeedback', {
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
                                dataContext.sections = [];
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
                                dataContext.sections = [{ id: '', questions: [{ id: questionId, feedback: {} }] }];
                            });

                            it('should update modification date', function (done) {
                                var promise = questionRepository.getQuestionFeedback(questionId);
                                promise.fin(function () {
                                    expect(dataContext.sections[0].questions[0].modifiedOn).toEqual(new Date(response.ModifiedOn));
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
                    expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/question/updateCorrectFeedback', {
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
                                dataContext.sections = [];
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
                                dataContext.sections = [{ id: '', questions: [{ id: questionId, feedback: {} }] }];
                            });

                            it('should update modification date', function (done) {
                                var promise = questionRepository.updateCorrectFeedback(questionId, feedbackText);
                                promise.fin(function () {
                                    expect(dataContext.sections[0].questions[0].modifiedOn).toEqual(new Date(response.ModifiedOn));
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
                    expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/question/updateIncorrectFeedback', {
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
                                dataContext.sections = [];
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
                                dataContext.sections = [{ id: '', questions: [{ id: questionId, feedback: {} }] }];
                            });

                            it('should update modification date', function (done) {
                                var promise = questionRepository.updateIncorrectFeedback(questionId, feedbackText);
                                promise.fin(function () {
                                    expect(dataContext.sections[0].questions[0].modifiedOn).toEqual(new Date(response.ModifiedOn));
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

        describe('when sectionId is undefined', function () {

            it('should reject promise', function (done) {
                var promise = questionRepository.copyQuestion('', undefined);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section id is not a string');
                    done();
                });
            });

        });

        describe('when sectionId is null', function () {

            it('should reject promise', function (done) {
                var promise = questionRepository.copyQuestion('', null);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section id is not a string');
                    done();
                });
            });

        });

        describe('when sectionId is not a string', function () {

            it('should reject promise', function (done) {
                var promise = questionRepository.copyQuestion('', {});

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section id is not a string');
                    done();
                });
            });

        });

        it('should send request to server to api/question/copy', function (done) {
            var sectionId = 'sectionId';
            post.reject();

            var promise = questionRepository.copyQuestion(questionId, sectionId);

            promise.fin(function () {
                expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/question/copy', {
                    questionId: questionId,
                    sectionId: sectionId
                });
                done();
            });
        });

        describe('when request to server was not successful', function () {

            it('should reject promise', function (done) {
                var reason = 'reason';
                var promise = questionRepository.copyQuestion('questionId', 'sectionId');

                post.reject(reason);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith(reason);
                    done();
                });
            });

        });

        describe('when response is undefined', function () {

            it('should reject promise', function (done) {
                var promise = questionRepository.copyQuestion('questionId', 'sectionId');

                post.resolve(undefined);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Response is not an object');
                    done();
                });
            });

        });

        describe('when response is null', function () {

            it('should reject promise', function (done) {
                var promise = questionRepository.copyQuestion('questionId', 'sectionId');

                post.resolve(null);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Response is not an object');
                    done();
                });
            });

        });

        describe('when response is not an object', function () {

            it('should reject promise', function (done) {
                var promise = questionRepository.copyQuestion('questionId', 'sectionId');

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
                section = {
                    id: 'sectionId',
                    questions: []
                };

            beforeEach(function () {
                post.resolve(response);
                dataContext.sections = [section];
                spyOn(questionModelMapper, 'map').and.returnValue(mappedQuestion);
            });

            describe('and destination section does not exist in dataContext', function () {

                it('should reject promise', function (done) {
                    dataContext.sections = [];

                    var promise = questionRepository.copyQuestion('questionId', 'sectionId');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Section does not exist in dataContext');
                        done();
                    });
                });

            });

            it('should get question model from response', function (done) {
                var promise = questionRepository.copyQuestion('questionId', 'sectionId');

                promise.fin(function () {
                    expect(questionModelMapper.map).toHaveBeenCalledWith(response);
                    done();
                });
            });

            it('should add copied question to section', function (done) {
                section.questions = [];

                var promise = questionRepository.copyQuestion(questionId, section.id);

                promise.fin(function () {
                    expect(section.questions.length).toEqual(1);
                    expect(section.questions[0]).toEqual(mappedQuestion);
                    done();
                });
            });

            it('should update section modification date', function (done) {
                section.ModifiedOn = null;

                var promise = questionRepository.copyQuestion(questionId, section.id);

                promise.fin(function () {
                    expect(section.modifiedOn).toEqual(mappedQuestion.createdOn);
                    done();
                });
            });

            it('should trigger event \'question:created\'', function (done) {
                var promise = questionRepository.copyQuestion(questionId, section.id);

                promise.fin(function () {
                    expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.created, section.id, mappedQuestion);
                    done();
                });
            });

            it('should resolve promise with copied question', function (done) {
                var promise = questionRepository.copyQuestion(questionId, section.id);

                promise.fin(function () {
                    expect(promise.inspect().value).toBe(mappedQuestion);
                    done();
                });
            });

        });

    });

    describe('moveQuestion:', function () {
        var sourceSectionId = 'sourceSectionId';
        var destinationSectionId = 'destinationSectionId';


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

        describe('when sourceSectionId is undefined', function () {

            it('should reject promise', function (done) {
                var promise = questionRepository.moveQuestion('', undefined);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Source section id is not a string');
                    done();
                });
            });

        });

        describe('when sourceSectionId is null', function () {

            it('should reject promise', function (done) {
                var promise = questionRepository.moveQuestion('', null);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Source section id is not a string');
                    done();
                });
            });

        });

        describe('when sourceSectionId is not a string', function () {

            it('should reject promise', function (done) {
                var promise = questionRepository.moveQuestion('', {});

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Source section id is not a string');
                    done();
                });
            });

        });

        describe('when destinationSectionId is undefined', function () {

            it('should reject promise', function (done) {
                var promise = questionRepository.moveQuestion('', '', undefined);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Destination section id is not a string');
                    done();
                });
            });

        });

        describe('when destinationSectionId is null', function () {

            it('should reject promise', function (done) {
                var promise = questionRepository.moveQuestion('', '', null);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Destination section id is not a string');
                    done();
                });
            });

        });

        describe('when destinationSectionId is not a string', function () {

            it('should reject promise', function (done) {
                var promise = questionRepository.moveQuestion('', '', {});

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Destination section id is not a string');
                    done();
                });
            });

        });

        it('should send request to server to api/question/move', function (done) {
            post.reject();

            var promise = questionRepository.moveQuestion(questionId, sourceSectionId, destinationSectionId);

            promise.fin(function () {
                expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/question/move', {
                    questionId: questionId,
                    sectionId: destinationSectionId
                });
                done();
            });
        });

        describe('when request to server was not successful', function () {

            it('should reject promise', function (done) {
                var reason = 'reason';
                var promise = questionRepository.moveQuestion(questionId, sourceSectionId, destinationSectionId);

                post.reject(reason);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith(reason);
                    done();
                });
            });

        });

        describe('when response is undefined', function () {

            it('should reject promise', function (done) {
                var promise = questionRepository.moveQuestion(questionId, sourceSectionId, destinationSectionId);

                post.resolve(undefined);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Response is not an object');
                    done();
                });
            });

        });

        describe('when response is null', function () {

            it('should reject promise', function (done) {
                var promise = questionRepository.moveQuestion(questionId, sourceSectionId, destinationSectionId);

                post.resolve(null);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Response is not an object');
                    done();
                });
            });

        });

        describe('when response is not an object', function () {

            it('should reject promise', function (done) {
                var promise = questionRepository.moveQuestion(questionId, sourceSectionId, destinationSectionId);

                post.resolve('');

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Response is not an object');
                    done();
                });
            });

        });

        describe('when response does not have a question creation date', function () {

            it('should reject promise', function (done) {
                var promise = questionRepository.moveQuestion(questionId, sourceSectionId, destinationSectionId);

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
                sourceSection = {
                    id: sourceSectionId,
                    questions: []
                },
                destinationSection = {
                    id: destinationSectionId,
                    questions: []
                };

            beforeEach(function () {
                post.resolve(response);
                sourceSection.questions = [question];
                dataContext.sections = [sourceSection, destinationSection];
            });

            describe('and source section does not exist in dataContext', function () {

                it('should reject promise', function (done) {
                    dataContext.sections = [];

                    var promise = questionRepository.moveQuestion(questionId, sourceSectionId, destinationSectionId);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Source section does not exist in dataContext');
                        done();
                    });
                });

            });

            describe('and destination section does not exist in dataContext', function () {

                it('should reject promise', function (done) {
                    dataContext.sections = [sourceSection];

                    var promise = questionRepository.moveQuestion(questionId, sourceSectionId, destinationSectionId);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Destination section does not exist in dataContext');
                        done();
                    });
                });

            });

            describe('and source section does not contain question', function() {

                it('should reject promise', function (done) {
                    sourceSection.questions = [];

                    var promise = questionRepository.moveQuestion(questionId, sourceSectionId, destinationSectionId);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Source section does not contain moved question');
                        done();
                    });
                });

            });

            it('should remove question from source section', function(done) {
                var promise = questionRepository.moveQuestion(questionId, sourceSectionId, destinationSectionId);

                promise.fin(function () {
                    expect(sourceSection.questions.length).toBe(0);
                    done();
                });
            });

            it('should update modification date of source section', function (done) {
                sourceSection.modifiedOn = null;

                var promise = questionRepository.moveQuestion(questionId, sourceSectionId, destinationSectionId);

                promise.fin(function () {
                    expect(sourceSection.modifiedOn).toEqual(new Date(response.ModifiedOn));
                    done();
                });
            });

            it('should add question to destination section', function (done) {
                destinationSection.questions = [];

                var promise = questionRepository.moveQuestion(questionId, sourceSectionId, destinationSectionId);

                promise.fin(function () {
                    expect(destinationSection.questions.length).toBe(1);
                    done();
                });
            });

            it('should update modification date of destination section', function (done) {
                destinationSection.modifiedOn = null;

                var promise = questionRepository.moveQuestion(questionId, sourceSectionId, destinationSectionId);

                promise.fin(function () {
                    expect(destinationSection.modifiedOn).toEqual(new Date(response.ModifiedOn));
                    done();
                });
            });

            it('should trigger event \'questions:deleted\'', function (done) {
                var promise = questionRepository.moveQuestion(questionId, sourceSectionId, destinationSectionId);

                promise.fin(function () {
                    expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.deleted, sourceSection.id, [question.id]);
                    done();
                });
            });
            it('should trigger event \'question:created\'', function (done) {
                var promise = questionRepository.moveQuestion(questionId, sourceSectionId, destinationSectionId);

                promise.fin(function () {
                    expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.created, destinationSection.id, question);
                    done();
                });
            });

        });

    });

});
