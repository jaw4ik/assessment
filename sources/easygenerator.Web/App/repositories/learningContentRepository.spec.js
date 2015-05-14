define(['repositories/learningContentRepository'], function (repository) {
    "use strict";

    var
        httpWrapper = require('http/httpWrapper'),
        dataContext = require('dataContext');

    describe('repository [learningContentRepository]', function () {

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

            describe('when question id is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.getCollection(undefined);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                        done();
                    });
                });

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

            describe('when question id is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.getCollection({});

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                        done();
                    });
                });

            });

            it('should send request to \'api/learningContents\'', function (done) {
                var questionId = 'asdasd';
                var promise = repository.getCollection(questionId);

                promise.fin(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('api/learningContents', { questionId: questionId });
                    done();
                });

                post.reject('I`ll be back');
            });

            describe('when learning contents collection received from server', function () {

                describe('and response is not an object', function () {

                    it('should reject promise', function (done) {
                        var questionId = 'asdasd';
                        var promise = repository.getCollection(questionId);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });

                        post.resolve('I`ll be back');
                    });

                });

                describe('and response has no LearningContents array', function () {

                    it('should reject promise', function (done) {
                        var questionId = 'asdasd';
                        var promise = repository.getCollection(questionId);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Learning content is not an array');
                            done();
                        });

                        post.resolve({});
                    });

                });

                it('should resolve promise with mapped learnint contents', function (done) {
                    var questionId = 'asdasd';
                    var promise = repository.getCollection(questionId);

                    var learningContents = [{ Id: 'asdads', Text: 'sadfsghdfgdg', CreatedOn: new Date().toISOString() }];

                    promise.fin(function () {
                        expect(promise.inspect().value.length).toEqual(1);
                        expect(promise.inspect().value[0].id).toEqual(learningContents[0].Id);
                        expect(promise.inspect().value[0].text).toEqual(learningContents[0].Text);
                        expect(promise.inspect().value[0].createdOn).toEqual(learningContents[0].CreatedOn);
                        done();
                    });

                    post.resolve({ LearningContents: learningContents });
                });

            });

        });

        describe('addLearningContent', function () {

            it('should be function', function () {
                expect(repository.addLearningContent).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.addLearningContent()).toBePromise();
            });

            describe('when question id is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.addLearningContent(undefined, { text: 'asdad' });

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                        done();
                    });
                });

            });

            describe('when question id is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.addLearningContent(null, { text: 'asdad' });

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                        done();
                    });
                });

            });

            describe('when question id is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.addLearningContent({}, { text: 'asdad' });

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                        done();
                    });
                });

            });

            describe('when learning content data is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.addLearningContent('asadasda', undefined);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Learning content data is not an object');
                        done();
                    });
                });

            });

            describe('when learning content data is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.addLearningContent('asadasda', null);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Learning content data is not an object');
                        done();
                    });
                });

            });

            describe('when learning content data is not an object', function () {

                it('should reject promise', function (done) {
                    var promise = repository.addLearningContent('asadasda', 'asdasdasd');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Learning content data is not an object');
                        done();
                    });
                });

            });

            describe('when learning content text is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.addLearningContent('asadasda', {});

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Learning content text is not a string');
                        done();
                    });
                });

            });

            describe('when learning content text is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.addLearningContent('asadasda', { text: null });

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Learning content text is not a string');
                        done();
                    });
                });

            });

            describe('when learning content text is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.addLearningContent('asadasda', { text: {} });

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Learning content text is not a string');
                        done();
                    });
                });

            });

            it('should send request to \'api/learningContent/create\'', function (done) {
                var
                    questionId = 'asdasdasd',
                    learningContent = { text: 'asdadsadsasdasd' };

                var promise = repository.addLearningContent(questionId, learningContent);

                promise.fin(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('api/learningContent/create', { questionId: questionId, text: learningContent.text });
                    done();
                });

                post.reject('I`ll be back');
            });

            describe('when learning content successfully created on server', function () {

                describe('and response is not an object', function () {

                    it('should reject promise', function (done) {
                        var
                            questionId = 'asdasdasd',
                            learningContent = { text: 'asdadsadsasdasd' };

                        var promise = repository.addLearningContent(questionId, learningContent);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });

                        post.resolve('I`ll be back');
                    });

                });

                describe('and response has no learning content Id', function () {

                    it('should reject promise', function (done) {
                        var
                            questionId = 'asdasdasd',
                            learningContent = { text: 'asdadsadsasdasd' };

                        var promise = repository.addLearningContent(questionId, learningContent);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Learning content id is not a string');
                            done();
                        });

                        post.resolve({ CreatedOn: 'adsasdasd' });
                    });

                });

                describe('and response has no learning content creation date', function () {

                    it('should reject promise', function (done) {
                        var
                            questionId = 'asdasdasd',
                            learningContent = { text: 'asdadsadsasdasd' };

                        var promise = repository.addLearningContent(questionId, learningContent);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Learning content creation date is not a string');
                            done();
                        });

                        post.resolve({ Id: 'sdsdfsfd' });
                    });

                });

                describe('and question not found in data context', function () {

                    it('should reject promise', function (done) {
                        var
                            questionId = 'asdasdasd',
                            learningContent = { text: 'asdadsadsasdasd' };

                        dataContext.objectives = [];

                        var promise = repository.addLearningContent(questionId, learningContent);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question does not exist in dataContext');
                            done();
                        });

                        post.resolve({ Id: 'asdasdasd', CreatedOn: new Date().toISOString() });
                    });

                });

                it('should update question modifiedOn date', function (done) {
                    var
                        questionId = 'asdasdasd',
                        learningContent = { text: 'asdadsadsasdasd' },
                        createdOnDate = new Date();

                    dataContext.objectives = [{
                        questions: [{ id: questionId, modifiedOn: '' }]
                    }];

                    var promise = repository.addLearningContent(questionId, learningContent);

                    promise.fin(function () {
                        expect(dataContext.objectives[0].questions[0].modifiedOn).toEqual(createdOnDate);
                        done();
                    });

                    post.resolve({ Id: 'asdasdasd', CreatedOn: createdOnDate.toISOString() });
                });

                it('should resolve promise with modifiedOn date', function (done) {
                    var
                        questionId = 'asdasdasd',
                        learningContent = { text: 'asdadsadsasdasd' },
                        responseId = 'asdasdasd',
                        createdOnDate = new Date();

                    dataContext.objectives = [{
                        questions: [{ id: questionId, modifiedOn: '' }]
                    }];

                    var promise = repository.addLearningContent(questionId, learningContent);

                    promise.fin(function () {
                        expect(promise).toBeResolvedWith({ id: responseId, createdOn: createdOnDate });
                        done();
                    });

                    post.resolve({ Id: responseId, CreatedOn: createdOnDate.toISOString() });
                });

            });

        });

        describe('removeLearningContent:', function () {

            it('should be function', function () {
                expect(repository.removeLearningContent).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.removeLearningContent()).toBePromise();
            });

            describe('when question id is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.removeLearningContent(undefined, 'asdasdasd');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                        done();
                    });
                });

            });

            describe('when question id is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.removeLearningContent(null, 'asdasdasd');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                        done();
                    });
                });

            });

            describe('when question id is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.removeLearningContent({}, 'asdasdasd');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                        done();
                    });
                });

            });

            describe('when learning content id is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.removeLearningContent('asdasdasd', undefined);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Learning content id is not a string');
                        done();
                    });
                });

            });

            describe('when learning content id is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.removeLearningContent('asdasdasd', null);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Learning content id is not a string');
                        done();
                    });
                });

            });

            describe('when learning content id is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.removeLearningContent('asdasdasd', {});

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Learning content id is not a string');
                        done();
                    });
                });

            });

            it('should send request to \'api/learningContent/delete\'', function (done) {
                var
                    questionId = 'asdasdasd',
                    learningContentId = 'asdadsadfghfgh';

                var promise = repository.removeLearningContent(questionId, learningContentId);

                promise.fin(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('api/learningContent/delete', { questionId: questionId, learningContentId: learningContentId });
                    done();
                });

                post.reject('I`ll be back');
            });

            describe('when learning content successfully deleted from server', function () {

                describe('and response is not an object', function () {

                    it('should reject promise', function (done) {
                        var
                            questionId = 'asdasdasd',
                            learningContentId = 'asdadsadfghfgh';

                        var promise = repository.removeLearningContent(questionId, learningContentId);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });

                        post.resolve('I`ll be back');
                    });

                });

                describe('and response has no modification date', function () {

                    it('should reject promise', function (done) {
                        var
                            questionId = 'asdasdasd',
                            learningContentId = 'asdadsadfghfgh';

                        var promise = repository.removeLearningContent(questionId, learningContentId);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response does not have modification date');
                            done();
                        });

                        post.resolve({});
                    });

                });

                describe('and question not found in data context', function () {

                    it('should reject promise', function (done) {
                        var
                            questionId = 'asdasdasd',
                            learningContentId = 'asdadsadfghfgh';

                        dataContext.objectives = [];

                        var promise = repository.removeLearningContent(questionId, learningContentId);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question does not exist in dataContext');
                            done();
                        });

                        post.resolve({ ModifiedOn: new Date().toISOString() });
                    });

                });

                it('should update question modifiedOn date', function (done) {
                    var
                        questionId = 'asdasdasd',
                        learningContentId = 'asdadsadfghfgh',
                        modifiedOnDate = new Date();

                    dataContext.objectives = [{
                        questions: [{ id: questionId, modifiedOn: '' }]
                    }];

                    var promise = repository.removeLearningContent(questionId, learningContentId);

                    promise.fin(function () {
                        expect(dataContext.objectives[0].questions[0].modifiedOn).toEqual(modifiedOnDate);
                        done();
                    });

                    post.resolve({ ModifiedOn: modifiedOnDate.toISOString() });
                });

                it('should resolve promise with modifiedOn date', function (done) {
                    var
                        questionId = 'asdasdasd',
                        learningContentId = 'asdadsadfghfgh',
                        modifiedOnDate = new Date();

                    dataContext.objectives = [{
                        questions: [{ id: questionId, modifiedOn: '' }]
                    }];

                    var promise = repository.removeLearningContent(questionId, learningContentId);

                    promise.fin(function () {
                        expect(promise).toBeResolvedWith({ modifiedOn: modifiedOnDate });
                        done();
                    });

                    post.resolve({ ModifiedOn: modifiedOnDate.toISOString() });
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

            describe('when question id is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateText(undefined, 'asdasdasd', 'asdagfhjfghjfghj');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                        done();
                    });
                });

            });

            describe('when question id is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateText(null, 'asdasdasd', 'asdagfhjfghjfghj');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                        done();
                    });
                });

            });

            describe('when question id is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateText({}, 'asdasdasd', 'asdagfhjfghjfghj');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                        done();
                    });
                });

            });

            describe('when learning content id is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateText('asdasdasd', undefined, 'asdagfhjfghjfghj');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Learning content id is not a string');
                        done();
                    });
                });

            });

            describe('when learning content id is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateText('asdasdasd', null, 'asdagfhjfghjfghj');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Learning content id is not a string');
                        done();
                    });
                });

            });

            describe('when learning content id is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateText('asdasdasd', {}, 'asdagfhjfghjfghj');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Learning content id is not a string');
                        done();
                    });
                });

            });

            describe('when learning content text is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateText('asdasdasd', 'asdagfhjfghjfghj', undefined);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Learning content text is not a string');
                        done();
                    });
                });

            });

            describe('when learning content text is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateText('asdasdasd', 'asdagfhjfghjfghj', null);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Learning content text is not a string');
                        done();
                    });
                });

            });

            describe('when learning content text is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateText('asdasdasd', 'asdagfhjfghjfghj', {});

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Learning content text is not a string');
                        done();
                    });
                });

            });

            it('should send request to \'api/learningContent/updateText\'', function (done) {
                var
                    questionId = 'asdasdasd',
                    learningContentId = 'asdadsadfghfgh',
                    learningContentText = 'yiopuiopuiop';

                var promise = repository.updateText(questionId, learningContentId, learningContentText);

                promise.fin(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('api/learningContent/updateText', { learningContentId: learningContentId, text: learningContentText });
                    done();
                });

                post.reject('I`ll be back');
            });

            describe('when learning content text successfully updated on server', function () {

                describe('and response is not an object', function () {

                    it('should reject promise', function (done) {
                        var
                            questionId = 'asdasdasd',
                            learningContentId = 'asdadsadfghfgh',
                            learningContentText = 'yiopuiopuiop';

                        var promise = repository.updateText(questionId, learningContentId, learningContentText);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });

                        post.resolve('I`ll be back');
                    });

                });

                describe('and response has no modification date', function () {

                    it('should reject promise', function (done) {
                        var
                            questionId = 'asdasdasd',
                            learningContentId = 'asdadsadfghfgh',
                            learningContentText = 'yiopuiopuiop';

                        var promise = repository.updateText(questionId, learningContentId, learningContentText);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Learning content modification date is not a string');
                            done();
                        });

                        post.resolve({});
                    });

                });

                describe('and question not found in data context', function () {

                    it('should reject promise', function (done) {
                        var
                            questionId = 'asdasdasd',
                            learningContentId = 'asdadsadfghfgh',
                            learningContentText = 'yiopuiopuiop';

                        dataContext.objectives = [];

                        var promise = repository.updateText(questionId, learningContentId, learningContentText);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Question does not exist in dataContext');
                            done();
                        });

                        post.resolve({ ModifiedOn: new Date().toISOString() });
                    });

                });

                it('should update question modifiedOn date', function (done) {
                    var
                        questionId = 'asdasdasd',
                        learningContentId = 'asdadsadfghfgh',
                        learningContentText = 'yiopuiopuiop',
                        modifiedOnDate = new Date();

                    dataContext.objectives = [{
                        questions: [{ id: questionId, modifiedOn: '' }]
                    }];

                    var promise = repository.updateText(questionId, learningContentId, learningContentText);

                    promise.fin(function () {
                        expect(dataContext.objectives[0].questions[0].modifiedOn).toEqual(modifiedOnDate);
                        done();
                    });

                    post.resolve({ ModifiedOn: modifiedOnDate.toISOString() });
                });

                it('should resolve promise with modifiedOn date', function (done) {
                    var
                        questionId = 'asdasdasd',
                        learningContentId = 'asdadsadfghfgh',
                        learningContentText = 'yiopuiopuiop',
                        modifiedOnDate = new Date();

                    dataContext.objectives = [{
                        questions: [{ id: questionId, modifiedOn: '' }]
                    }];

                    var promise = repository.updateText(questionId, learningContentId, learningContentText);

                    promise.fin(function () {
                        expect(promise).toBeResolvedWith({ modifiedOn: modifiedOnDate });
                        done();
                    });

                    post.resolve({ ModifiedOn: modifiedOnDate.toISOString() });
                });

            });

        });

    });

});