define(['repositories/objectiveRepository'], function (repository) {
    "use strict";

    var
       constants = require('constants'),
       httpWrapper = require('http/httpWrapper'),
       dataContext = require('dataContext'),
       app = require('durandal/app')
    ;

    describe('repository [objectiveRepository]', function () {

        var post;

        beforeEach(function () {
            post = Q.defer();
            spyOn(httpWrapper, 'post').and.returnValue(post.promise);
            spyOn(app, 'trigger');
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

            describe('when objectives received from server', function () {

                it('should resolve promise with objectives from dataContext', function (done) {
                    var promise = repository.getCollection();

                    dataContext.objectives = [{ id: 'obj1' }, { id: 'obj2' }];

                    promise.fin(function () {
                        expect(promise).toBeResolvedWith(dataContext.objectives);
                        done();
                    });
                });

            });

        });

        describe('getById:', function () {

            it('should be function', function () {
                expect(repository.getById).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.getById()).toBePromise();
            });

            describe('when objective id is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.getById(undefined);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Objective id (string) was expected');
                        done();
                    });
                });
            });

            describe('when objective id is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.getById(null);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Objective id (string) was expected');
                        done();
                    });
                });

            });

            describe('when objective id is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.getById({});

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Objective id (string) was expected');
                        done();
                    });
                });

            });

            describe('when objective exists on server', function () {

                describe('and objective not found in repository', function () {

                    it('should reject promise', function (done) {
                        var objectiveId = 'sadasda';
                        dataContext.objectives = [];

                        var promise = repository.getById(objectiveId);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Objective with this id is not found');
                            done();
                        });
                    });

                });

                it('should resolve promise with objective from dataContext', function (done) {
                    var objectiveId = 'sadasda';
                    dataContext.objectives = [{ id: objectiveId, test: 'test' }];

                    var promise = repository.getById(objectiveId);

                    promise.fin(function () {
                        expect(promise).toBeResolvedWith(dataContext.objectives[0]);
                        done();
                    });
                });

            });

        });

        describe('addObjective:', function () {

            it('should be function', function () {
                expect(repository.addObjective).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.addObjective()).toBePromise();
            });

            describe('when objective is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.addObjective(undefined);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Objective data is not an object');
                        done();
                    });
                });

            });

            describe('when objective is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.addObjective(null);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Objective data is not an object');
                        done();
                    });
                });

            });

            describe('when objective is not an object', function () {

                it('should reject promise', function (done) {
                    var promise = repository.addObjective('asdasdasd');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Objective data is not an object');
                        done();
                    });
                });

            });

            it('should send request to \'api/objective/create\'', function () {
                var objective = { test: 'test' };
                var promise = repository.addObjective(objective);

                promise.fin(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('api/objective/create', objective);
                    done();
                });

                post.reject('lomai menya polnostju');
            });

            describe('when objective successfully added on server', function () {

                describe('and response is not an object', function () {

                    it('should reject promise', function (done) {
                        var objective = { test: 'test' };
                        var promise = repository.addObjective(objective);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });

                        post.resolve('lomai menya polnostju');
                    });

                });

                describe('and response.Id is not a string', function () {

                    it('should reject promise', function (done) {
                        var objective = { test: 'test' };
                        var promise = repository.addObjective(objective);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Objective Id is not a string');
                            done();
                        });

                        post.resolve({ ImageUrl: 'sadf', CreatedOn: 'dasdasd', CreatedBy: 'asdasd' });
                    });

                });

                describe('and response.ImageUrl is not a string', function () {

                    it('should reject promise', function (done) {
                        var objective = { test: 'test' };
                        var promise = repository.addObjective(objective);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Objective ImageUrl is not a string');
                            done();
                        });

                        post.resolve({ Id: 'sadf', CreatedOn: 'dasdasd', CreatedBy: 'asdasd' });
                    });

                });

                describe('and response.CreatedOn is not a string', function () {

                    it('should reject promise', function (done) {
                        var objective = { test: 'test' };
                        var promise = repository.addObjective(objective);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Objective creation date is not a string');
                            done();
                        });

                        post.resolve({ Id: 'assd', ImageUrl: 'sadf', CreatedBy: 'asdasd' });
                    });

                });

                describe('and response.CreatedBy is not a string', function () {

                    it('should reject promise', function (done) {
                        var objective = { test: 'test' };
                        var promise = repository.addObjective(objective);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Objective createdBy is not a string');
                            done();
                        });

                        post.resolve({ Id: 'assd', ImageUrl: 'sadf', CreatedOn: 'asdasd' });
                    });

                });

                it('should add objective to dataContext', function (done) {
                    var objective = { test: 'test', title: 'asdasdasdhfghfgh' },
                        objectiveId = 'dasdasd',
                        imageUrl = 'url/to/image',
                        createdOn = new Date();

                    dataContext.objectives = [];

                    var promise = repository.addObjective(objective);

                    promise.fin(function () {
                        expect(dataContext.objectives.length).toEqual(1);
                        expect(dataContext.objectives[0].id).toEqual(objectiveId);
                        expect(dataContext.objectives[0].title).toEqual(objective.title);
                        expect(dataContext.objectives[0].image).toEqual(imageUrl);
                        expect(dataContext.objectives[0].createdOn).toEqual(createdOn);
                        expect(dataContext.objectives[0].modifiedOn).toEqual(createdOn);
                        done();
                    });

                    post.resolve({ Id: objectiveId, ImageUrl: imageUrl, CreatedOn: createdOn.toISOString(), CreatedBy: 'asdasd@ukr.net' });
                });

                it('should resolve promise with received data', function (done) {
                    var objective = { test: 'test', title: 'asdasdasdhfghfgh', imageUrl: 'image/url' },
                        objectiveId = 'dasdasd',
                        createdOn = new Date();

                    dataContext.objectives = [];

                    var promise = repository.addObjective(objective);

                    promise.fin(function () {
                        expect(promise).toBeResolvedWith({ id: objectiveId, createdOn: createdOn.toISOString() });
                        done();
                    });

                    post.resolve({ Id: objectiveId, ImageUrl: objective.imageUrl, CreatedOn: createdOn.toISOString(), CreatedBy: 'asdasd@ukr.net' });
                });

            });

        });

        describe('updateTitle:', function () {

            it('should be function', function () {
                expect(repository.updateTitle).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.updateTitle()).toBePromise();
            });

            describe('when objectiveid is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateTitle(undefined, 'title');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Objective data has invalid format');
                        done();
                    });
                });

            });

            describe('when objectiveId is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateTitle(null, 'title');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Objective data has invalid format');
                        done();
                    });
                });

            });

            describe('when title is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateTitle('id', undefined);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Objective data has invalid format');
                        done();
                    });
                });

            });

            describe('when title is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateTitle('id', null);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Objective data has invalid format');
                        done();
                    });
                });

            });

            it('should send request to \'api/objective/updatetitle\'', function (done) {
                var obj = { id: 'asdadasd', title: 'asdasdadsasdas' };

                var promise = repository.updateTitle(obj.id, obj.title);

                promise.fin(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('api/objective/updatetitle', { objectiveId: obj.id, title: obj.title });
                    done();
                });

                post.reject('lomai menya polnostju');
            });

            describe('when objective successfully updated on server', function () {

                describe('and response is not an object', function () {

                    it('should reject promise', function (done) {
                        var obj = { id: 'asdadasd', title: 'asdasdadsasdas' };
                        var promise = repository.updateTitle(obj.id, obj.title);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });

                        post.resolve('lomai menya polnostju');
                    });

                });

                describe('and response has no modification date', function () {

                    it('should reject promise', function (done) {
                        var obj = { id: 'asdadasd', title: 'asdasdadsasdas' };
                        var promise = repository.updateTitle(obj.id, obj.title);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response does not have modification date');
                            done();
                        });

                        post.resolve({});
                    });

                });

                describe('and objective not found in dataContext', function () {

                    it('should reject promise', function (done) {
                        var obj = { id: 'asdadasd', title: 'asdasdadsasdas' },
                            modifiedOn = new Date();

                        dataContext.objectives = [];

                        var promise = repository.updateTitle(obj.id, obj.title);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Objective does not exist in dataContext');
                            done();
                        });

                        post.resolve({ ModifiedOn: modifiedOn.toISOString() });
                    });

                });

                it('should update objective in dataContext', function (done) {
                    var obj = { id: 'asdadasd', title: 'asdasdadsasdas' },
                        modifiedOn = new Date();

                    dataContext.objectives = [{ id: obj.id, title: '', modifiedOn: '' }];

                    var promise = repository.updateTitle(obj.id, obj.title);

                    promise.fin(function () {
                        expect(dataContext.objectives[0].title).toEqual(obj.title);
                        expect(dataContext.objectives[0].modifiedOn).toEqual(modifiedOn);
                        done();
                    });

                    post.resolve({ ModifiedOn: modifiedOn.toISOString() });
                });

                it('should send objective:titleUpdated event', function (done) {
                    var obj = { id: 'asdadasd', title: 'asdasdadsasdas' },
                        modifiedOn = new Date();

                    dataContext.objectives = [{ id: obj.id, title: '', modifiedOn: '' }];

                    var promise = repository.updateTitle(obj.id, obj.title);

                    promise.fin(function () {
                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.objective.titleUpdated, dataContext.objectives[0]);
                        done();
                    });

                    post.resolve({ ModifiedOn: modifiedOn.toISOString() });
                });

                it('should resolve promise with modification date', function (done) {
                    var obj = { id: 'asdadasd', title: 'asdasdadsasdas' },
                        modifiedOn = new Date();

                    dataContext.objectives = [{ id: obj.id, title: '', modifiedOn: '' }];

                    var promise = repository.updateTitle(obj.id, obj.title);

                    promise.fin(function () {
                        expect(promise).toBeResolvedWith(modifiedOn);
                        done();
                    });

                    post.resolve({ ModifiedOn: modifiedOn.toISOString() });
                });

            });

        });

        describe('updateImage:', function () {

            it('should be function', function () {
                expect(repository.updateImage).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.updateImage()).toBePromise();
            });

            describe('when objectiveid is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateImage(undefined, 'image/url');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Objective data has invalid format');
                        done();
                    });
                });

            });

            describe('when objectiveId is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateImage(null, 'image/url');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Objective data has invalid format');
                        done();
                    });
                });

            });

            describe('when imageUrl is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateImage('id', undefined);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Objective data has invalid format');
                        done();
                    });
                });

            });

            describe('when imageUrl is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateImage('id', null);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Objective data has invalid format');
                        done();
                    });
                });

            });

            it('should send request to \'api/objective/updateimage\'', function (done) {
                var obj = { id: 'objective_id', imageUrl: 'image/url' };
                var promise = repository.updateImage(obj.id, obj.imageUrl);

                promise.fin(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('api/objective/updateimage', { objectiveId: obj.id, imageUrl: obj.imageUrl + '?width=120&height=120&scaleBySmallerSide=true' });
                    done();
                });

                post.reject('lomai menya polnostju');
            });

            describe('when objective imageUrl successfully updated on server', function () {

                describe('and response is not an object', function () {

                    it('should reject promise', function (done) {
                        var obj = { id: 'objective_id', imageUrl: 'image/url' };
                        var promise = repository.updateImage(obj.id, obj.imageUrl);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });

                        post.resolve('lomai menya polnostju');
                    });

                });

                describe('and response has no modification date', function () {

                    it('should reject promise', function (done) {
                        var obj = { id: 'objective_id', imageUrl: 'image/url' };
                        var promise = repository.updateImage(obj.id, obj.imageUrl);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response does not have modification date');
                            done();
                        });

                        post.resolve({});
                    });

                });

                describe('and objective not found in dataContext', function () {

                    it('should reject promise', function (done) {
                        var obj = { id: 'objective_id', imageUrl: 'image/url' },
                            modifiedOn = new Date();

                        dataContext.objectives = [];

                        var promise = repository.updateImage(obj.id, obj.imageUrl);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Objective does not exist in dataContext');
                            done();
                        });

                        post.resolve({ ModifiedOn: modifiedOn.toISOString() });
                    });

                });

                it('should update objective in dataContext', function (done) {
                    var obj = { id: 'objective_id', imageUrl: 'image/url' },
                        modifiedOn = new Date();

                    dataContext.objectives = [{ id: obj.id, imageUrl: '', modifiedOn: '' }];

                    var promise = repository.updateImage(obj.id, obj.imageUrl);

                    promise.fin(function () {
                        expect(dataContext.objectives[0].image).toEqual(obj.imageUrl + '?width=120&height=120&scaleBySmallerSide=true');
                        expect(dataContext.objectives[0].modifiedOn).toEqual(modifiedOn);
                        done();
                    });

                    post.resolve({ ModifiedOn: modifiedOn.toISOString() });
                });

                it('should send objective:imageUrlUpdated event', function (done) {
                    var obj = { id: 'objective_id', imageUrl: 'image/url' },
                        modifiedOn = new Date();

                    dataContext.objectives = [{ id: obj.id, imageUrl: '', modifiedOn: '' }];

                    var promise = repository.updateImage(obj.id, obj.imageUrl);

                    promise.fin(function () {
                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.objective.imageUrlUpdated, dataContext.objectives[0]);
                        done();
                    });

                    post.resolve({ ModifiedOn: modifiedOn.toISOString() });
                });

                it('should resolve promise with modification date and image url', function (done) {
                    var obj = { id: 'objective_id', imageUrl: 'image/url' },
                        modifiedOn = new Date();

                    dataContext.objectives = [{ id: obj.id, imageUrl: '', modifiedOn: '' }];

                    var promise = repository.updateImage(obj.id, obj.imageUrl);

                    promise.fin(function () {
                        expect(promise).toBeResolvedWith({
                            modifiedOn: modifiedOn,
                            imageUrl: obj.imageUrl + '?width=120&height=120&scaleBySmallerSide=true'
                        });
                        done();
                    });

                    post.resolve({ ModifiedOn: modifiedOn.toISOString() });
                });

            });

        });

        describe('removeObjective:', function () {

            it('should be function', function () {
                expect(repository.removeObjective).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.removeObjective()).toBePromise();
            });

            describe('when objective is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.removeObjective(undefined);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Objective id was expected');
                        done();
                    });
                });

            });

            describe('when objective is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.removeObjective(null);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Objective id was expected');
                        done();
                    });
                });

            });

            describe('when objective is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.removeObjective({});

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Objective id was expected');
                        done();
                    });
                });

            });

            it('should send request to \'api/objective/delete\'', function (done) {
                var objectiveId = 'asdadsasdasd';
                var promise = repository.removeObjective(objectiveId);

                promise.fin(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('api/objective/delete', { objectiveId: objectiveId });
                    done();
                });

                post.reject('lomai menya polnostju');
            });

            describe('when objective successfully deleted from server', function () {

                it('should remove objective from dataContext', function (done) {
                    var objectiveId = 'asdadsasdasd';
                    dataContext.objectives = [{ id: objectiveId }];

                    var promise = repository.removeObjective(objectiveId);

                    promise.fin(function () {
                        expect(dataContext.objectives.length).toEqual(0);
                        done();
                    });

                    post.resolve();
                });

            });

        });

        describe('updateQuestionsOrder:', function () {

            it('should be function', function () {
                expect(repository.updateQuestionsOrder).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.updateQuestionsOrder()).toBePromise();
            });


            describe('when objective is undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateQuestionsOrder(undefined, []);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Objective id (string) was expected');
                        done();
                    });
                });

            });

            describe('when objective is null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateQuestionsOrder(null, []);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Objective id (string) was expected');
                        done();
                    });
                });

            });

            describe('when objective is not a string', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateQuestionsOrder({}, []);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Objective id (string) was expected');
                        done();
                    });
                });

            });

            describe('when questions undefined', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateQuestionsOrder('asdadads', undefined);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Questions is not array');
                        done();
                    });
                });

            });

            describe('when questions null', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateQuestionsOrder('asdadads', null);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Questions is not array');
                        done();
                    });
                });

            });

            describe('when questions is not an array', function () {

                it('should reject promise', function (done) {
                    var promise = repository.updateQuestionsOrder('asdadads', {});

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Questions is not array');
                        done();
                    });
                });

            });

            it('should send request to \'api/objective/updatequestionsorder\'', function (done) {
                var objectiveId = 'dfhsfgsfgh',
                    questionId = 'asdasdasd';

                var promise = repository.updateQuestionsOrder(objectiveId, [{ id: questionId }]);

                promise.fin(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('api/objective/updatequestionsorder', { objectiveId: objectiveId, questions: [questionId] });
                    done();
                });

                post.reject('lomai menya polnostju');
            });

            describe('when questions order successfully updated on server', function () {

                describe('and response is not an object', function () {

                    it('should reject promise', function (done) {
                        var objectiveId = 'dfhsfgsfgh',
                            questionId = 'asdasdasd';

                        var promise = repository.updateQuestionsOrder(objectiveId, [{ id: questionId }]);
                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response is not an object');
                            done();
                        });

                        post.resolve('lomai menya polnostju');
                    });

                });

                describe('and response has no modification date', function () {

                    it('should reject promise', function (done) {
                        var objectiveId = 'dfhsfgsfgh',
                            questionId = 'asdasdasd';

                        var promise = repository.updateQuestionsOrder(objectiveId, [{ id: questionId }]);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Response does not have modification date');
                            done();
                        });

                        post.resolve({});
                    });

                });

                describe('and objective not found in dataContext', function () {

                    it('should reject promise', function (done) {
                        var objectiveId = 'dfhsfgsfgh',
                            questionId = 'asdasdasd',
                            modifiedOn = new Date();

                        dataContext.objectives = [];

                        var promise = repository.updateQuestionsOrder(objectiveId, [{ id: questionId }]);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Objective does not exist in dataContext');
                            done();
                        });

                        post.resolve({ ModifiedOn: modifiedOn.toISOString() });
                    });

                });

                it('should update objective in dataContext', function (done) {
                    var objectiveId = 'dfhsfgsfgh',
                        questionId1 = 'asdasdasd',
                        questionId2 = 'asdasdasd2',
                        modifiedOn = new Date();

                    dataContext.objectives = [{ id: objectiveId, questions: [{ id: questionId2 }, { id: questionId1 }] }];

                    var promise = repository.updateQuestionsOrder(objectiveId, [{ id: questionId1 }, { id: questionId2 }]);

                    promise.fin(function () {
                        expect(dataContext.objectives[0].questions[0].id).toEqual(questionId1);
                        expect(dataContext.objectives[0].questions[1].id).toEqual(questionId2);
                        done();
                    });

                    post.resolve({ ModifiedOn: modifiedOn.toISOString() });
                });

                it('should trigger objective:questionsReordered event', function (done) {
                    var objectiveId = 'dfhsfgsfgh',
                        questionId1 = 'asdasdasd',
                        questionId2 = 'asdasdasd2',
                        modifiedOn = new Date();

                    dataContext.objectives = [{ id: objectiveId, questions: [{ id: questionId2 }, { id: questionId1 }] }];

                    var promise = repository.updateQuestionsOrder(objectiveId, [{ id: questionId1 }, { id: questionId2 }]);

                    promise.fin(function () {
                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.objective.questionsReordered, dataContext.objectives[0]);
                        done();
                    });

                    post.resolve({ ModifiedOn: modifiedOn.toISOString() });
                });

                it('should resolve promise with modification date', function (done) {
                    var objectiveId = 'dfhsfgsfgh',
                        questionId1 = 'asdasdasd',
                        questionId2 = 'asdasdasd2',
                        modifiedOn = new Date();

                    dataContext.objectives = [{ id: objectiveId, questions: [{ id: questionId2 }, { id: questionId1 }] }];

                    var promise = repository.updateQuestionsOrder(objectiveId, [{ id: questionId1 }, { id: questionId2 }]);

                    promise.fin(function () {
                        expect(promise).toBeResolvedWith({ modifiedOn: modifiedOn });
                        done();
                    });

                    post.resolve({ ModifiedOn: modifiedOn.toISOString() });
                });

            });

        });

    });

});