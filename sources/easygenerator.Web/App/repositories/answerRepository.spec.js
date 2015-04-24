define(['repositories/answerRepository'], function (repository) {

    "use strict";

    var
        dataContext = require('dataContext'),
        httpWrapper = require('http/httpWrapper');

    describe('repository [answerRepository]', function () {

        var post;

        beforeEach(function () {
            post = Q.defer();
            spyOn(httpWrapper, 'post').and.returnValue(post.promise);
        });

        it('should be object', function () {
            expect(repository).toBeObject();
        });

        describe('getCollection:', function () {

            it('should be function', function () {
                expect(repository.getCollection).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.getCollection()).toBePromise();
            });

            describe('when question id is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.getCollection(null);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                        done();
                    });
                });

            });

            describe('when question id is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.getCollection(undefined);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                        done();
                    });
                });

            });

            describe('when question id is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.getCollection({});

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                        done();
                    });
                });

            });

            it('should send request to \'api/answers\'', function (done) {
                var questionId = 'SomeId';
                var promise = repository.getCollection(questionId);

                post.reject('Some reason');

                promise.fin(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('api/answers', { questionId: questionId });
                    done();
                });
            });

            describe('when answers received from server', function () {

                describe('and response is not an object', function () {

                    it('should reject promise', function (done) {
                        var promise = repository.getCollection('SomeId1');

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });

                        post.resolve('trololo');
                    });

                });

                describe('and response has no array of answers', function () {

                    it('should reject promise', function (done) {
                        var promise = repository.getCollection('SomeId2');

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Answers is not an array');
                            done();
                        });

                        post.resolve({ Answers: 'trololo' });
                    });

                });

                it('should return mapped answers array', function (done) {
                    var date = new Date().toISOString();

                    var answer =
                    {
                        Id: '1',
                        Text: 'Text1',
                        IsCorrect: true,
                        CreatedOn: date,
                    };

                    var mappedAnswers =
                    {
                        id: '1',
                        text: 'Text1',
                        isCorrect: true,
                        createdOn: date,
                    };

                    var promise = repository.getCollection('SomeId');

                    post.resolve({ Answers: [answer] });

                    promise.fin(function () {
                        expect(promise.inspect().value.length).toEqual(1);
                        expect(promise.inspect().value[0].id).toEqual(mappedAnswers.id);
                        expect(promise.inspect().value[0].text).toEqual(mappedAnswers.text);
                        expect(promise.inspect().value[0].isCorrect).toEqual(mappedAnswers.isCorrect);
                        expect(promise.inspect().value[0].createdOn).toEqual(mappedAnswers.createdOn);
                        done();
                    });
                });
            });

        });

        describe('addAnswer:', function () {

            it('should be function', function () {
                expect(repository.addAnswer).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.addAnswer()).toBePromise();
            });

            describe('when question id is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.addAnswer(null, { text: '123', isCorrect: true });

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                        done();
                    });
                });

            });

            describe('when question id is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.addAnswer(undefined, { text: '123', isCorrect: true });

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                        done();
                    });
                });

            });

            describe('when question id is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.addAnswer({}, { text: '123', isCorrect: true });

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                        done();
                    });
                });

            });

            describe('when answer data is not an object', function () {

                it('should reject promise', function (done) {
                    var promise = repository.addAnswer('Id1', 123);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Answer data is not an object');
                        done();
                    });
                });

            });

            describe('when answer data.text is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.addAnswer('Id2', { text: null, isCorrect: true });

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Answer data text is not a string');
                        done();
                    });
                });

            });

            describe('when answer data.text is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.addAnswer('Id2', { isCorrect: true });

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Answer data text is not a string');
                        done();
                    });
                });

            });

            describe('when answer data.text is not as string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.addAnswer('Id2', { text: {}, isCorrect: true });

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Answer data text is not a string');
                        done();
                    });
                });

            });

            describe('when answer data.isCorrect is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.addAnswer('Id2', { text: '123123', isCorrect: null });

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Answer data correctness is not a boolean');
                        done();
                    });
                });

            });

            describe('when answer data.isCorrect is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.addAnswer('Id2', { text: 'sasdfsdf' });

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Answer data correctness is not a boolean');
                        done();
                    });
                });

            });

            describe('when answer data.isCorrect is not as string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.addAnswer('Id2', { text: '12134234', isCorrect: {} });

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Answer data correctness is not a boolean');
                        done();
                    });
                });

            });

            it('should send request to \'api/answer/create\'', function (done) {
                var requestData = {
                    questionId: 'Id2',
                    text: '123123123123',
                    isCorrect: true
                };

                var promise = repository.addAnswer(requestData.questionId, { text: requestData.text, isCorrect: requestData.isCorrect });

                promise.fin(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('api/answer/create', requestData);
                    done();
                });

                post.reject('it failed baby');
            });

            describe('when answer created on server', function () {

                describe('and response is not an object', function () {

                    it('should reject promise', function (done) {
                        var promise = repository.addAnswer('Id2', { text: '123123123123', isCorrect: true });

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });

                        post.resolve('123123123');
                    });

                });

                describe('and response has no Id', function () {

                    it('should reject promise', function (done) {
                        var promise = repository.addAnswer('Id2', { text: '123123123123', isCorrect: true });

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Answer id is not a string');
                            done();
                        });

                        post.resolve({ CreatedOn: new Date().toISOString() });
                    });

                });

                describe('and response has no CreatedOn date', function () {

                    it('should reject promise', function (done) {
                        var promise = repository.addAnswer('Id2', { text: '123123123123', isCorrect: true });

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Answer creation date is not a string');
                            done();
                        });

                        post.resolve({ Id: 'Id1' });
                    });

                });

                describe('and question not found in dataContext', function () {

                    it('should reject promise', function (done) {
                        dataContext.objectives = [];

                        var receivedAnswer = {
                            Id: 'Id123',
                            CreatedOn: new Date().toISOString()
                        };

                        var promise = repository.addAnswer('someId111', { text: '123123123123', isCorrect: true });

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question does not exist in dataContext');
                            done();
                        });

                        post.resolve(receivedAnswer);
                    });

                });

                it('should update question modified date in dataContext', function (done) {
                    var questionId = 'someId';

                    dataContext.objectives = [
                    {
                        questions: [
                        {
                            id: questionId,
                            modifiedOn: '123'
                        }]
                    }];

                    var receivedAnswer = {
                        Id: 'Id123',
                        CreatedOn: new Date().toISOString()
                    };

                    var promise = repository.addAnswer(questionId, { text: '123123123123', isCorrect: true });

                    promise.fin(function () {
                        expect(dataContext.objectives[0].questions[0].modifiedOn).toEqual(new Date(receivedAnswer.CreatedOn));
                        done();
                    });

                    post.resolve(receivedAnswer);
                });

                it('should resolve promise with received information', function (done) {
                    var questionId = 'someId';

                    dataContext.objectives = [
                    {
                        questions: [
                        {
                            id: questionId,
                            modifiedOn: '123'
                        }]
                    }];

                    var receivedAnswer = {
                        Id: 'Id123',
                        CreatedOn: new Date().toISOString()
                    };

                    var promise = repository.addAnswer(questionId, { text: '123123123123', isCorrect: true });

                    promise.fin(function () {
                        expect(promise.inspect().value.id).toEqual(receivedAnswer.Id);
                        expect(promise.inspect().value.createdOn).toEqual(new Date(receivedAnswer.CreatedOn));

                        done();
                    });

                    post.resolve(receivedAnswer);
                });

            });

        });

        describe('removeAnswer:', function () {

            it('should be function', function () {
                expect(repository.removeAnswer).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.removeAnswer()).toBePromise();
            });

            describe('when question id is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.removeAnswer(null, '1231231');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                        done();
                    });
                });

            });

            describe('when question id is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.removeAnswer(undefined, '1231231');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                        done();
                    });
                });

            });

            describe('when question id is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.removeAnswer({}, '1231231');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                        done();
                    });
                });

            });

            describe('when answer id is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.removeAnswer('1231231', null);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Answer id is not a string');
                        done();
                    });
                });

            });

            describe('when answer id is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.removeAnswer('1231231', undefined);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Answer id is not a string');
                        done();
                    });
                });

            });

            describe('when answer id is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.removeAnswer('1231231', {});

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Answer id is not a string');
                        done();
                    });
                });

            });

            it('should send request to \'api/answer/delete\'', function (done) {
                var promise = repository.removeAnswer('id1', 'id2');

                promise.fin(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('api/answer/delete', { questionId: 'id1', answerId: 'id2' });
                    done();
                });

                post.reject('yeah it failed baby');
            });

            describe('when answer was deleted on server', function () {

                describe('and response is not an object', function () {

                    it('should reject promise', function (done) {
                        var promise = repository.removeAnswer('id1', 'id2');

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });

                        post.resolve('123123123');
                    });

                });

                describe('and response has no ModifiedOn date', function () {

                    it('should reject promise', function (done) {
                        var promise = repository.removeAnswer('id1', 'id2');

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response does not have modification date');
                            done();
                        });

                        post.resolve({});
                    });

                });

                describe('and question not found in dataContext', function () {

                    it('should reject promise', function (done) {
                        dataContext.objectives = [];

                        var response = {
                            ModifiedOn: new Date().toISOString()
                        };

                        var promise = repository.removeAnswer('id1', 'id2')

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question does not exist in dataContext');
                            done();
                        });

                        post.resolve(response);
                    });

                });

                it('should update question modified date in dataContext', function (done) {
                    var questionId = 'someId';

                    dataContext.objectives = [
                    {
                        questions: [
                        {
                            id: questionId,
                            modifiedOn: '123'
                        }]
                    }];

                    var response = {
                        ModifiedOn: new Date().toISOString()
                    };

                    var promise = repository.removeAnswer(questionId, 'id2');

                    promise.fin(function () {
                        expect(dataContext.objectives[0].questions[0].modifiedOn).toEqual(new Date(response.ModifiedOn));
                        done();
                    });

                    post.resolve(response);
                });

                it('should resolve promise with received information', function (done) {
                    var questionId = 'someId';

                    dataContext.objectives = [
                    {
                        questions: [
                        {
                            id: questionId,
                            modifiedOn: '123'
                        }]
                    }];

                    var response = {
                        ModifiedOn: new Date().toISOString()
                    };

                    var promise = repository.removeAnswer(questionId, 'id2');

                    promise.fin(function () {
                        expect(promise.inspect().value.modifiedOn).toEqual(new Date(response.ModifiedOn));

                        done();
                    });

                    post.resolve(response);
                });

            });

        });

        describe('updateAnswer:', function () {

            it('should be function', function () {
                expect(repository.updateAnswer).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.updateAnswer()).toBePromise();
            });

            describe('when question id is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateAnswer(null, '1231231', '1231231', true);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                        done();
                    });
                });

            });

            describe('when question id is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateAnswer(undefined, '1231231', '1231231', true);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                        done();
                    });
                });

            });

            describe('when question id is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateAnswer({}, '1231231', '1231231', true);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                        done();
                    });
                });

            });

            describe('when answer id is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateAnswer('1231231', null, '1231231', true);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Answer id is not a string');
                        done();
                    });
                });

            });

            describe('when answer id is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateAnswer('1231231', undefined, '1231231', true);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Answer id is not a string');
                        done();
                    });
                });

            });

            describe('when answer id is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateAnswer('1231231', {}, '1231231', true);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Answer id is not a string');
                        done();
                    });
                });

            });

            describe('when answer text is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateAnswer('1231231', '1231231', null, true);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Answer text is not a string');
                        done();
                    });
                });

            });

            describe('when answer text is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateAnswer('1231231', '1231231', undefined, true);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Answer text is not a string');
                        done();
                    });
                });

            });

            describe('when answer text is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateAnswer('1231231', '1231231', {}, true);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Answer text is not a string');
                        done();
                    });
                });

            });

            describe('when isCorrect null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateAnswer('1231231', '1231231', '1231231', null);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Answer correctness is not a boolean');
                        done();
                    });
                });

            });

            describe('when isCorrect is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateAnswer('1231231', '1231231', '1231231', undefined);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Answer correctness is not a boolean');
                        done();
                    });
                });

            });

            describe('when isCorrect is not a bool', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateAnswer('1231231', '1231231', '1231231', {});

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Answer correctness is not a boolean');
                        done();
                    });
                });

            });

            it('should send request to \'api/answer/delete\'', function (done) {
                var promise = repository.updateAnswer('id1', 'id2', '123123', true);

                promise.fin(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('api/answer/update', { answerId: 'id2', text: '123123', isCorrect: true });
                    done();
                });

                post.reject('yeah it failed baby');
            });

            describe('when answer updated on server', function() {

                describe('and response is not an object', function () {

                    it('should reject promise', function (done) {
                        var promise = repository.updateAnswer('id1', 'id2', '123123', true);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });

                        post.resolve('123123123');
                    });

                });

                describe('and response has no ModifiedOn date', function () {

                    it('should reject promise', function (done) {
                        var promise = repository.updateAnswer('id1', 'id2', '123123', true);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Answer modification date is not a string');
                            done();
                        });

                        post.resolve({});
                    });

                });

                describe('and question not found in dataContext', function () {

                    it('should reject promise', function (done) {
                        dataContext.objectives = [];

                        var response = {
                            ModifiedOn: new Date().toISOString()
                        };

                        var promise = repository.updateAnswer('id1', 'id2', '123123', true);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question does not exist in dataContext');
                            done();
                        });

                        post.resolve(response);
                    });

                });

                it('should update question modified date in dataContext', function (done) {
                    var questionId = 'someId';

                    dataContext.objectives = [
                    {
                        questions: [
                        {
                            id: questionId,
                            modifiedOn: '123'
                        }]
                    }];

                    var response = {
                        ModifiedOn: new Date().toISOString()
                    };

                    var promise = repository.updateAnswer(questionId, 'id2', 'asdasdasd', false);

                    promise.fin(function () {
                        expect(dataContext.objectives[0].questions[0].modifiedOn).toEqual(new Date(response.ModifiedOn));
                        done();
                    });

                    post.resolve(response);
                });

                it('should resolve promise with received information', function (done) {
                    var questionId = 'someId';

                    dataContext.objectives = [
                    {
                        questions: [
                        {
                            id: questionId,
                            modifiedOn: '123'
                        }]
                    }];

                    var response = {
                        ModifiedOn: new Date().toISOString()
                    };

                    var promise = repository.removeAnswer(questionId, 'id2');

                    promise.fin(function () {
                        expect(promise.inspect().value.modifiedOn).toEqual(new Date(response.ModifiedOn));

                        done();
                    });

                    post.resolve(response);
                });

            });

        });

        describe('updateText:', function() {
            
            it('should be function', function () {
                expect(repository.updateText).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.updateText()).toBePromise();
            });

            describe('when question id is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateText(null, '1231231', '1231231');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                        done();
                    });
                });

            });

            describe('when question id is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateText(undefined, '1231231', '1231231');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                        done();
                    });
                });

            });

            describe('when question id is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateText({}, '1231231', '1231231');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                        done();
                    });
                });

            });

            describe('when answer id is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateText('1231231', null, '1231231');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Answer id is not a string');
                        done();
                    });
                });

            });

            describe('when answer id is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateText('1231231', undefined, '1231231');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Answer id is not a string');
                        done();
                    });
                });

            });

            describe('when answer id is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateText('1231231', {}, '1231231');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Answer id is not a string');
                        done();
                    });
                });

            });

            describe('when answer text is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateText('1231231', '1231231', null);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Answer text is not a string');
                        done();
                    });
                });

            });

            describe('when answer text is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateText('1231231', '1231231', undefined);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Answer text is not a string');
                        done();
                    });
                });

            });

            describe('when answer text is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateText('1231231', '1231231', {});

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Answer text is not a string');
                        done();
                    });
                });

            });

            it('should send request to \'api/answer/updateText\'', function (done) {
                var promise = repository.updateText('id1', 'id2', '123123');

                promise.fin(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('api/answer/updatetext', { answerId: 'id2', text: '123123' });
                    done();
                });

                post.reject('yeah it failed baby');
            });

            describe('when answer updated on server', function () {

                describe('and response is not an object', function () {

                    it('should reject promise', function (done) {
                        var promise = repository.updateText('id1', 'id2', '123123');

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });

                        post.resolve('123123123');
                    });

                });

                describe('and response has no ModifiedOn date', function () {

                    it('should reject promise', function (done) {
                        var promise = repository.updateText('id1', 'id2', '123123');

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Answer modification date is not a string');
                            done();
                        });

                        post.resolve({});
                    });

                });

                describe('and question not found in dataContext', function () {

                    it('should reject promise', function (done) {
                        dataContext.objectives = [];

                        var response = {
                            ModifiedOn: new Date().toISOString()
                        };

                        var promise = repository.updateText('id1', 'id2', '123123');

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question does not exist in dataContext');
                            done();
                        });

                        post.resolve(response);
                    });

                });

                it('should update question modified date in dataContext', function (done) {
                    var questionId = 'someId';

                    dataContext.objectives = [
                    {
                        questions: [
                        {
                            id: questionId,
                            modifiedOn: '123'
                        }]
                    }];

                    var response = {
                        ModifiedOn: new Date().toISOString()
                    };

                    var promise = repository.updateText(questionId, 'id2', 'asdasdasd');

                    promise.fin(function () {
                        expect(dataContext.objectives[0].questions[0].modifiedOn).toEqual(new Date(response.ModifiedOn));
                        done();
                    });

                    post.resolve(response);
                });

                it('should resolve promise with received information', function (done) {
                    var questionId = 'someId';

                    dataContext.objectives = [
                    {
                        questions: [
                        {
                            id: questionId,
                            modifiedOn: '123'
                        }]
                    }];

                    var response = {
                        ModifiedOn: new Date().toISOString()
                    };

                    var promise = repository.updateText(questionId, 'id2', 'text');

                    promise.fin(function () {
                        expect(promise.inspect().value.modifiedOn).toEqual(new Date(response.ModifiedOn));

                        done();
                    });

                    post.resolve(response);
                });

            });

        });

        describe('singleSelectTextChangeCorrectAnswer:', function () {
            
            it('should be function', function () {
                expect(repository.singleSelectTextChangeCorrectAnswer).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.singleSelectTextChangeCorrectAnswer()).toBePromise();
            });

            describe('when question id is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.singleSelectTextChangeCorrectAnswer(null, '1231231');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                        done();
                    });
                });

            });

            describe('when question id is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.singleSelectTextChangeCorrectAnswer(undefined, '1231231');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                        done();
                    });
                });

            });

            describe('when question id is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.singleSelectTextChangeCorrectAnswer({}, '1231231');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                        done();
                    });
                });

            });

            describe('when answer id is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.singleSelectTextChangeCorrectAnswer('1231231', null);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Answer id is not a string');
                        done();
                    });
                });

            });

            describe('when answer id is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.singleSelectTextChangeCorrectAnswer('1231231', undefined);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Answer id is not a string');
                        done();
                    });
                });

            });

            describe('when answer id is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.singleSelectTextChangeCorrectAnswer('1231231', {});

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Answer id is not a string');
                        done();
                    });
                });

            });

            describe('when answer updated on server', function () {

                describe('and response is not an object', function () {

                    it('should reject promise', function (done) {
                        var promise = repository.singleSelectTextChangeCorrectAnswer('id1', 'id2');

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });

                        post.resolve('123123123');
                    });

                });

                describe('and response has no ModifiedOn date', function () {

                    it('should reject promise', function (done) {
                        var promise = repository.singleSelectTextChangeCorrectAnswer('id1', 'id2');

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Answer modification date is not a string');
                            done();
                        });

                        post.resolve({});
                    });

                });

                describe('and question not found in dataContext', function () {

                    it('should reject promise', function (done) {
                        dataContext.objectives = [];

                        var response = {
                            ModifiedOn: new Date().toISOString()
                        };

                        var promise = repository.singleSelectTextChangeCorrectAnswer('id1', 'id2');

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question does not exist in dataContext');
                            done();
                        });

                        post.resolve(response);
                    });

                });

                it('should update question modified date in dataContext', function (done) {
                    var questionId = 'someId';

                    dataContext.objectives = [
                    {
                        questions: [
                        {
                            id: questionId,
                            modifiedOn: '123'
                        }]
                    }];

                    var response = {
                        ModifiedOn: new Date().toISOString()
                    };

                    var promise = repository.singleSelectTextChangeCorrectAnswer(questionId, 'id2');

                    promise.fin(function () {
                        expect(dataContext.objectives[0].questions[0].modifiedOn).toEqual(new Date(response.ModifiedOn));
                        done();
                    });

                    post.resolve(response);
                });

                it('should resolve promise with received information', function (done) {
                    var questionId = 'someId';

                    dataContext.objectives = [
                    {
                        questions: [
                        {
                            id: questionId,
                            modifiedOn: '123'
                        }]
                    }];

                    var response = {
                        ModifiedOn: new Date().toISOString()
                    };

                    var promise = repository.singleSelectTextChangeCorrectAnswer(questionId, 'id2');

                    promise.fin(function () {
                        expect(promise.inspect().value.modifiedOn).toEqual(new Date(response.ModifiedOn));

                        done();
                    });

                    post.resolve(response);
                });

            });

        });

    });

});