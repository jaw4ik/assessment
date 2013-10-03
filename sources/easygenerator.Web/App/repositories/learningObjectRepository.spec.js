define(['repositories/learningObjectRepository'], function (repository) {
    "use strict";

    var
        httpWrapper = require('httpWrapper')
    ;

    describe('repository [learningObjectRepository]', function () {

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
                        expect(promise).toBeRejectedWith('Learning object id is not a string');
                    });
                });

            });

            describe('when learning object does not exist in dataContext', function () {

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

            describe('when learning object exists in dataContext', function () {

                var dataContext = require('dataContext');

                var learningObject = {
                    id: 'learningObjectId',
                    text: 'text'
                };

                beforeEach(function () {
                    dataContext.objectives = [{ questions: [{ learningObjects: [learningObject] }] }];
                });


                it('should resolve promise with learning Object', function () {
                    var promise = repository.getById(learningObject.id);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeResolvedWith(learningObject);
                    });
                });

            });

        });

        describe('addLearningObject:', function () {

            it('should be function', function () {
                expect(repository.addLearningObject).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.addLearningObject()).toBePromise();
            });

            describe('when questionId is not a string', function () {

                it('should reject promise', function () {
                    var promise = repository.addLearningObject(undefined, {});

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                    });
                });

            });

            describe('when learningObject data is not an object', function () {

                it('should reject promise', function () {
                    var promise = repository.addLearningObject('', undefined);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeRejectedWith('Learning object data is not an object');
                    });
                });

            });

            describe('when learningObject text is not a string', function () {

                it('should reject promise', function () {
                    var promise = repository.addLearningObject('', {});

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeRejectedWith('Learning object text is not a string');
                    });
                });

            });

            it('should send request to server to api/learningObject/create', function () {
                var questionId = 'questionId';
                var learningObject = { text: '', description: '' };

                var promise = repository.addLearningObject(questionId, learningObject);

                post.reject();

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('api/learningObject/create', {
                        questionId: questionId,
                        text: learningObject.text
                    });
                });
            });

            describe('and request to server was not successful', function () {

                it('should reject promise', function () {
                    var reason = 'reason';
                    var promise = repository.addLearningObject('', { text: '' });

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
                        var promise = repository.addLearningObject('', { text: '' });

                        post.resolve();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                        });
                    });

                });

                describe('and response does not have learningObject id', function () {

                    it('should reject promise', function () {
                        var promise = repository.addLearningObject('', { text: '' });

                        post.resolve({ CreatedOn: '' });

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Learning object id is not a string');
                        });
                    });

                });

                describe('and response does not have learningObject creation date', function () {

                    it('should reject promise', function () {
                        var promise = repository.addLearningObject('', { text: '' });

                        post.resolve({ Id: '' });

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Learning object creation date is not a string');
                        });
                    });

                });

                describe('and response has id and creation date', function () {

                    var dataContext = require('dataContext');

                    var response = {
                        Id: 'learningObjectId',
                        CreatedOn: "/Date(1378106938845)/"
                    };

                    beforeEach(function () {
                        post.resolve(response);
                    });


                    describe('and question does not exist in dataContext', function () {

                        it('should reject promise', function () {
                            dataContext.objectives = [];

                            var promise = repository.addLearningObject('', { text: '' });

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith('Question does not exist in dataContext');
                            });
                        });

                    });

                    describe('and question exists in dataContext', function () {

                        var learningObject = { text: 'text' };
                        var question = { id: 'questionId', learningObjects: [] };
                        var objective = { id: 'objectiveId', questions: [] };

                        beforeEach(function () {
                            question.learningObjects = [];
                            objective.questions = [question];
                            dataContext.objectives = [objective];
                        });

                        it('should add learningObject option to question', function () {
                            var promise = repository.addLearningObject(question.id, learningObject);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(question.learningObjects.length).toEqual(1);
                                expect(question.learningObjects[0]).toEqual({
                                    id: response.Id,
                                    text: learningObject.text,
                                    createdOn: utils.getDateFromString(response.CreatedOn),
                                    modifiedOn: utils.getDateFromString(response.CreatedOn)
                                });
                            });
                        });

                        it('should update question modification date', function () {
                            var promise = repository.addLearningObject(question.id, learningObject);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(question.modifiedOn).toEqual(utils.getDateFromString(response.CreatedOn));
                            });
                        });

                        it('should resolve promise with learningObject id and creation date', function () {
                            var promise = repository.addLearningObject(question.id, learningObject);

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

        describe('removeLearningObject:', function () {

            it('should be function', function () {
                expect(repository.removeLearningObject).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.removeLearningObject()).toBePromise();
            });

            describe('when question id is not a string', function () {

                it('should reject promise', function () {
                    var promise = repository.removeLearningObject(undefined, '');

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                    });
                });

            });

            describe('when learningObject id is not a string', function () {

                it('should reject promise', function () {
                    var promise = repository.removeLearningObject('', undefined);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeRejectedWith('Learning object id is not a string');
                    });
                });

            });

            it('should send request to server to api/learningObject/delete', function () {
                var questionId = 'questionId';
                var learningObjectId = 'learningObjectId';

                httpWrapper.post.reset();
                post.reject();

                var promise = repository.removeLearningObject(questionId, learningObjectId);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('api/learningObject/delete', {
                        questionId: questionId,
                        learningObjectId: learningObjectId
                    });
                });
            });

            describe('and request to server was not successful', function () {

                it('should reject promise', function () {
                    var reason = 'reason';
                    var promise = repository.removeLearningObject('', '');

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
                        var promise = repository.removeLearningObject('', '');

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
                        var promise = repository.removeLearningObject('', '');

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
                            var promise = repository.removeLearningObject('', '');

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith('Question does not exist in dataContext');
                            });
                        });

                    });

                    describe('and question exists in dataContext', function () {

                        var learningObject = { id: 'learningObjectId', text: 'text' };
                        var question = { id: 'questionId', learningObjects: [] };
                        var objective = { id: 'objectiveId', questions: [] };

                        beforeEach(function () {
                            question.learningObjects = [learningObject];
                            objective.questions = [question];
                            dataContext.objectives = [objective];
                        });


                        it('should remove learningObject from question', function () {
                            var promise = repository.removeLearningObject(question.id, learningObject.id);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(dataContext.objectives[0].questions[0].learningObjects.length).toEqual(0);
                            });
                        });

                        it('should update question modification date', function () {
                            var promise = repository.removeLearningObject(question.id, learningObject.id);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(dataContext.objectives[0].questions[0].modifiedOn).toEqual(utils.getDateFromString(response.ModifiedOn));
                            });
                        });

                        it('should resolve promise with modification date', function () {
                            var promise = repository.removeLearningObject(question.id, learningObject.id);

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

            describe('when learningObjectId is not a string', function () {

                it('should reject promise', function () {
                    var promise = repository.updateText(undefined, '');

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeRejectedWith('Learning object id is not a string');
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
                        expect(promise).toBeRejectedWith('Learning object text is not a string');
                    });
                });

            });

            it('should send request to server to api/learningObject/updateText', function () {
                var learningObjectId = 'learningObjectId';
                var text = 'text';

                var promise = repository.updateText(learningObjectId, text);

                post.reject();

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('api/learningObject/updateText', {
                        learningObjectId: learningObjectId,
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

                describe('and response does not have learningObject modification date', function () {

                    it('should reject promise', function () {
                        var promise = repository.updateText('', '');

                        post.resolve({});

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Learning object modification date is not a string');
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


                    describe('and learningObject does not exist in dataContext', function () {

                        it('should reject promise', function () {
                            dataContext.objectives = [];

                            var promise = repository.updateText('', '');

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith('Learning object does not exist in dataContext');
                            });
                        });

                    });

                    describe('and learningObject exists in dataContext', function () {

                        var learningObject = { id: 'learningObjectId', text: 'text' };
                        var question = { id: 'questionId', learningObjects: [] };
                        var objective = { id: 'objectiveId', questions: [] };

                        beforeEach(function () {
                            question.learningObjects = [learningObject];
                            objective.questions = [question];
                            dataContext.objectives = [objective];
                        });

                        it('should update learningObject text', function () {
                            var text = 'updated text';
                            var promise = repository.updateText(learningObject.id, text);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(learningObject.text).toEqual(text);
                            });
                        });

                        it('should update learningObject modification date', function () {
                            var promise = repository.updateText(learningObject.id, '');

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(learningObject.modifiedOn).toEqual(utils.getDateFromString(response.ModifiedOn));
                            });
                        });

                        it('should update question modification date', function () {
                            var promise = repository.updateText(learningObject.id, '');

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(question.modifiedOn).toEqual(utils.getDateFromString(response.ModifiedOn));
                            });
                        });

                        it('should resolve promise with learningObject modification date', function () {
                            var promise = repository.updateText(learningObject.id, '');

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