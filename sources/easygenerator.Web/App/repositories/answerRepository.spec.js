define(['repositories/answerRepository'], function (repository) {
    "use strict";

    var constants = require('constants'),
        httpWrapper = require('httpWrapper')
    ;

    describe('repository [answerRepository]', function () {

        var post;

        beforeEach(function () {
            post = Q.defer();
            spyOn(httpWrapper, 'post').andReturn(post.promise);
        });

        it('should be object', function () {
            expect(repository).toBeObject();
        });

        describe('getById:', function () {

            it('should be function', function () {
                expect(repository.getById).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.getById()).toBePromise();
            });

            describe('when id is not a string', function () {

                it('should reject promise', function () {
                    var promise = repository.getById();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeRejectedWith('Answer id is not a string');
                    });
                });

            });

            describe('when answer does not exist in dataContext', function () {

                it('should resolve promise with null', function () {
                    var promise = repository.getById('');

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeResolvedWith(null);
                    });
                });

            });

            describe('when answer exists in dataContext', function () {

                var dataContext = require('dataContext');

                var answer = {
                    id: 'answerId',
                    text: 'text'
                };

                beforeEach(function () {
                    dataContext.objectives = [{ questions: [{ answerOptions: [answer] }] }];
                });


                it('should resolve promise with answer', function () {
                    var promise = repository.getById(answer.id);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeResolvedWith(answer);
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

            describe('when questionId is not a string', function () {

                it('should reject promise', function () {
                    var promise = repository.addAnswer(undefined, {});

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                    });
                });

            });

            describe('when answer data is not an object', function () {

                it('should reject promise', function () {
                    var promise = repository.addAnswer('', undefined);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeRejectedWith('Answer data is not an object');
                    });
                });

            });

            describe('when answer data text is not a string', function () {

                it('should reject promise', function () {
                    var promise = repository.addAnswer('', { isCorrect: true });

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeRejectedWith('Answer data text is not a string');
                    });
                });

            });

            describe('when answer data correctness is not a boolean', function () {

                it('should reject promise', function () {
                    var promise = repository.addAnswer('', { text: '' });

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeRejectedWith('Answer data correctness is not a boolean');
                    });
                });

            });

            it('should send request to server to api/answer/create', function () {
                var questionId = 'questionId';
                var answer = { text: '', description: '', isCorrect: true };

                var promise = repository.addAnswer(questionId, answer);

                post.reject();

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('api/answer/create', {
                        questionId: questionId,
                        text: answer.text,
                        isCorrect: answer.isCorrect
                    });
                });
            });

            describe('and request to server was not successful', function () {

                it('should reject promise', function () {
                    var reason = 'reason';
                    var promise = repository.addAnswer('', { text: '', isCorrect: true });

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
                        var promise = repository.addAnswer('', { text: '', isCorrect: true });

                        post.resolve();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                        });
                    });

                });

                describe('and response does not have answer id', function () {

                    it('should reject promise', function () {
                        var promise = repository.addAnswer('', { text: '', isCorrect: true });

                        post.resolve({ CreatedOn: '' });

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Answer id is not a string');
                        });
                    });

                });

                describe('and response does not have answer creation date', function () {

                    it('should reject promise', function () {
                        var promise = repository.addAnswer('', { text: '', isCorrect: true });

                        post.resolve({ Id: '' });

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Answer creation date is not a string');
                        });
                    });

                });

                describe('and response has id and creation date', function () {

                    var dataContext = require('dataContext');

                    var response = {
                        Id: 'answerId',
                        CreatedOn: "/Date(1378106938845)/"
                    };

                    beforeEach(function () {
                        post.resolve(response);
                    });


                    describe('and question does not exist in dataContext', function () {

                        it('should reject promise', function () {
                            dataContext.objectives = [];

                            var promise = repository.addAnswer('', { text: '', isCorrect: true });

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith('Question does not exist in dataContext');
                            });
                        });

                    });

                    describe('and question exists in dataContext', function () {

                        var answer = { text: 'text', isCorrect: true };
                        var question = { id: 'questionId', answerOptions: [] };
                        var objective = { id: 'objectiveId', questions: [] };

                        beforeEach(function () {
                            question.answerOptions = [];
                            objective.questions = [question];
                            dataContext.objectives = [objective];
                        });

                        it('should add answer option to question', function () {
                            var promise = repository.addAnswer(question.id, answer);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(question.answerOptions.length).toEqual(1);
                                expect(question.answerOptions[0]).toEqual({
                                    id: response.Id,
                                    text: answer.text,
                                    isCorrect: true,
                                    createdOn: utils.getDateFromString(response.CreatedOn),
                                    modifiedOn: utils.getDateFromString(response.CreatedOn)
                                });
                            });
                        });

                        it('should update question modification date', function () {
                            var promise = repository.addAnswer(question.id, answer);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(question.modifiedOn).toEqual(utils.getDateFromString(response.CreatedOn));
                            });
                        });

                        it('should resolve promise with answer id and creation date', function () {
                            var promise = repository.addAnswer(question.id, answer);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeResolvedWith({ id: response.Id, createdOn: utils.getDateFromString(response.CreatedOn) });
                            });
                        });

                    });

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

            describe('when question id is not a string', function () {

                it('should reject promise', function () {
                    var promise = repository.removeAnswer(undefined, '');

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                    });
                });

            });

            describe('when answer id is not a string', function () {

                it('should reject promise', function () {
                    var promise = repository.removeAnswer('', undefined);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeRejectedWith('Answer id is not a string');
                    });
                });

            });

            it('should send request to server to api/answer/delete', function () {
                var questionId = 'questionId';
                var answerId = 'answerId';

                httpWrapper.post.reset();
                post.reject();

                var promise = repository.removeAnswer(questionId, answerId);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('api/answer/delete', {
                        questionId: questionId,
                        answerId: answerId
                    });
                });
            });

            describe('and request to server was not successful', function () {

                it('should reject promise', function () {
                    var reason = 'reason';
                    var promise = repository.removeAnswer('', '');

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
                        var promise = repository.removeAnswer('', '');

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
                        var promise = repository.removeAnswer('', '');

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
                            dataContext.objectives = [{ questions: [] }];
                        });

                        it('should reject promise', function () {
                            var promise = repository.removeAnswer('', '');

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith('Question does not exist in dataContext');
                            });
                        });

                    });

                    describe('and question exists in dataContext', function () {

                        var answer = { id: 'answerId', text: 'text', isCorrect: true };
                        var question = { id: 'questionId', answerOptions: [] };
                        var objective = { id: 'objectiveId', questions: [] };

                        beforeEach(function () {
                            question.answerOptions = [answer];
                            objective.questions = [question];
                            dataContext.objectives = [objective];
                        });


                        it('should remove answer from question', function () {
                            var promise = repository.removeAnswer(question.id, answer.id);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(dataContext.objectives[0].questions[0].answerOptions.length).toEqual(0);
                            });
                        });

                        it('should update question modification date', function () {
                            var promise = repository.removeAnswer(question.id, answer.id);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(dataContext.objectives[0].questions[0].modifiedOn).toEqual(utils.getDateFromString(response.ModifiedOn));
                            });
                        });

                        it('should resolve promise with modification date', function () {
                            var promise = repository.removeAnswer(question.id, answer.id);

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

        describe('updateText:', function () {

            it('should be function', function () {
                expect(repository.updateText).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.updateText()).toBePromise();
            });

            describe('when answerId is not a string', function () {

                it('should reject promise', function () {
                    var promise = repository.updateText(undefined, '');

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeRejectedWith('Answer id is not a string');
                    });
                });

            });

            describe('when text is not a string', function () {

                it('should reject promise', function () {
                    var promise = repository.updateText('', undefined);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeRejectedWith('Answer text is not a string');
                    });
                });

            });

            it('should send request to server to api/answer/updateText', function () {
                var answerId = 'answerId';
                var text = 'text';

                var promise = repository.updateText(answerId, text);

                post.reject();

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('api/answer/updateText', {
                        answerId: answerId,
                        text: text,
                    });
                });
            });

            describe('and request to server was not successful', function () {

                it('should reject promise', function () {
                    var reason = 'reason';
                    var promise = repository.updateText('', '');

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
                        var promise = repository.updateText('', '');

                        post.resolve();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                        });
                    });

                });

                describe('and response does not have answer modification date', function () {

                    it('should reject promise', function () {
                        var promise = repository.updateText('', '');

                        post.resolve({});

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Answer modification date is not a string');
                        });
                    });

                });

                describe('and response has abswer modification date', function () {

                    var dataContext = require('dataContext');

                    var response = {
                        ModifiedOn: "/Date(1378106938845)/"
                    };

                    beforeEach(function () {
                        post.resolve(response);
                    });


                    describe('and answer does not exist in dataContext', function () {

                        it('should reject promise', function () {
                            dataContext.objectives = [];

                            var promise = repository.updateText('', '');

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith('Answer does not exist in dataContext');
                            });
                        });

                    });

                    describe('and answer exists in dataContext', function () {

                        var answer = { id: 'answerId', text: 'text' };
                        var question = { id: 'questionId', answerOptions: [] };
                        var objective = { id: 'objectiveId', questions: [] };

                        beforeEach(function () {
                            question.answerOptions = [answer];
                            objective.questions = [question];
                            dataContext.objectives = [objective];
                        });

                        it('should update answer text', function () {
                            var text = 'updated text';
                            var promise = repository.updateText(answer.id, text);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(answer.text).toEqual(text);
                            });
                        });

                        it('should update answer modification date', function () {
                            var promise = repository.updateText(answer.id, '');

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(answer.modifiedOn).toEqual(utils.getDateFromString(response.ModifiedOn));
                            });
                        });

                        it('should update question modification date', function () {
                            var promise = repository.updateText(answer.id, '');

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(question.modifiedOn).toEqual(utils.getDateFromString(response.ModifiedOn));
                            });
                        });

                        it('should resolve promise with answer modification date', function () {
                            var promise = repository.updateText(answer.id, '');

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

        describe('updateCorrectness:', function () {

            it('should be function', function () {
                expect(repository.updateCorrectness).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.updateCorrectness()).toBePromise();
            });

            describe('when answerId is not a string', function () {

                it('should reject promise', function () {
                    var promise = repository.updateCorrectness(undefined, true);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeRejectedWith('Answer id is not a string');
                    });
                });

            });

            describe('when isCorrect is not a boolean', function () {

                it('should reject promise', function () {
                    var promise = repository.updateCorrectness('', undefined);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeRejectedWith('Answer correctness is not a boolean');
                    });
                });

            });

            it('should send request to server to api/answer/updateCorrectness', function () {
                var answerId = 'answerId';

                var promise = repository.updateCorrectness(answerId, true);

                post.reject();

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('api/answer/updateCorrectness', {
                        answerId: answerId,
                        isCorrect: true,
                    });
                });
            });

            describe('and request to server was not successful', function () {

                it('should reject promise', function () {
                    var reason = 'reason';
                    var promise = repository.updateCorrectness('', true);

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
                        var promise = repository.updateCorrectness('', true);

                        post.resolve();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                        });
                    });

                });

                describe('and response does not have answer modification date', function () {

                    it('should reject promise', function () {
                        var promise = repository.updateCorrectness('', true);

                        post.resolve({});

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Answer modification date is not a string');
                        });
                    });

                });

                describe('and response has answer modification date', function () {

                    var dataContext = require('dataContext');

                    var response = {
                        ModifiedOn: "/Date(1378106938845)/"
                    };

                    beforeEach(function () {
                        post.resolve(response);
                    });


                    describe('and answer does not exist in dataContext', function () {

                        it('should reject promise', function () {
                            dataContext.objectives = [];

                            var promise = repository.updateCorrectness('', true);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith('Answer does not exist in dataContext');
                            });
                        });

                    });

                    describe('and answer exists in dataContext', function () {

                        var answer = { id: 'answerId', isCorrect: false };
                        var question = { id: 'questionId', answerOptions: [] };
                        var objective = { id: 'objectiveId', questions: [] };

                        beforeEach(function () {
                            question.answerOptions = [answer];
                            objective.questions = [question];
                            dataContext.objectives = [objective];
                        });

                        it('should update answer correctness', function () {
                            var promise = repository.updateCorrectness(answer.id, true);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(answer.isCorrect).toEqual(true);
                            });
                        });

                        it('should update answer modification date', function () {
                            var promise = repository.updateCorrectness(answer.id, true);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(answer.modifiedOn).toEqual(utils.getDateFromString(response.ModifiedOn));
                            });
                        });

                        it('should update question modification date', function () {
                            var promise = repository.updateCorrectness(answer.id, true);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(question.modifiedOn).toEqual(utils.getDateFromString(response.ModifiedOn));
                            });
                        });

                        it('should resolve promise with answer modification date', function () {
                            var promise = repository.updateCorrectness(answer.id, true);

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
    });

});