define(['repositories/objectiveRepository', 'models/objective'],
    function (objectiveRepository, ObjectiveModel) {
        "use strict";

        var
           constants = require('constants'),
           httpWrapper = require('httpWrapper'),
           dataContext = require('dataContext')
        ;

        describe('repository [objectiveRepository]', function () {

            var post;

            beforeEach(function () {
                post = $.Deferred();
                spyOn(httpWrapper, 'post').andReturn(post.promise());
            });

            it('should be object', function () {
                expect(objectiveRepository).toBeObject();
            });

            describe('getCollection:', function () {

                it('should be function', function () {
                    expect(objectiveRepository.getCollection).toBeFunction();
                });

                it('should return promise', function () {
                    expect(objectiveRepository.getCollection()).toBePromise();
                });

                it('should send request to server to api/objectives', function () {
                    var promise = objectiveRepository.getCollection();

                    post.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(httpWrapper.post).toHaveBeenCalledWith('api/objectives');
                    });
                });

                describe('and request failed', function () {
                    var reason = 'reason';
                    beforeEach(function() {
                        post.reject(reason);
                    });

                    it('should reject promise with reason', function () {
                        var promise = objectiveRepository.getCollection();
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith(reason);
                        });
                    });

                });

                describe('and request succeed', function () {

                    beforeEach(function() {
                        post.resolve();
                    });

                    it('should resolve promise with objectives collection', function () {
                        var objectives = [{ id: 1 }, { id: 2 }];
                        dataContext.objectives = objectives;

                        var promise = objectiveRepository.getCollection();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolvedWith(objectives);
                        });
                    });

                });
            });

            describe('getById:', function () {

                it('should be function', function () {
                    expect(objectiveRepository.getById).toBeFunction();
                });

                it('should return promise', function () {
                    expect(objectiveRepository.getById()).toBePromise();
                });

                describe('when id is not a string', function () {

                    it('should reject promise with \'Objective id (string) was expected\'', function () {
                        var promise = objectiveRepository.getById();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Objective id (string) was expected');
                        });
                    });

                    it('should not send request to server to api/objectives', function () {
                        var promise = objectiveRepository.getById();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(httpWrapper.post).not.toHaveBeenCalled();
                        });
                    });

                });

                describe('when id is a string', function () {

                    it('should send request to server to api/objectives', function () {
                        var promise = objectiveRepository.getCollection();

                        post.resolve();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(httpWrapper.post).toHaveBeenCalledWith('api/objectives');
                        });
                    });

                    describe('and request failed', function () {
                        var reason = 'reason';
                        beforeEach(function () {
                            post.reject(reason);
                        });

                        it('should reject promise with reason', function () {
                            var promise = objectiveRepository.getCollection();

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith(reason);
                            });
                        });

                    });

                    describe('and request succeed', function () {

                        beforeEach(function () {
                            post.resolve();
                        });

                        describe('and when objective does not exist', function () {

                            it('should reject promise with \'Objective with this id is not found\'', function () {
                                dataContext.objectives = [];
                                var promise = objectiveRepository.getById('');

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Objective with this id is not found');
                                });
                            });

                        });

                        describe('and when objective exists', function () {

                            it('should be resolved with objective from dataContext', function () {
                                var objective = { id: '0' };
                                dataContext.objectives = [objective];

                                var promise = objectiveRepository.getById('0');

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeResolvedWith(objective);
                                });
                            });

                        });

                    });

                });

            });

            describe('addObjective:', function () {

                it('should be function', function () {
                    expect(objectiveRepository.addObjective).toBeFunction();
                });

                it('should return promise', function () {
                    expect(objectiveRepository.addObjective()).toBePromise();
                });

                describe('when objective data is not an object', function () {

                    it('should reject promise', function () {
                        var promise = objectiveRepository.addObjective();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Objective data is not an object');
                        });
                    });

                });

                describe('when objective data is an object', function () {

                    it('should send request to server to api/objective/create', function () {
                        var objective = {};
                        var promise = objectiveRepository.addObjective(objective);

                        post.reject();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(httpWrapper.post).toHaveBeenCalledWith('api/objective/create', objective);
                        });
                    });

                    describe('and request to server was not successful', function () {

                        it('should reject promise', function () {
                            var reason = 'reason';
                            var promise = objectiveRepository.addObjective({});

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
                                var promise = objectiveRepository.addObjective({});

                                post.resolve();

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                });
                            });

                        });

                        describe('and response does not have an id of created objective', function () {

                            it('should reject promise', function () {
                                var promise = objectiveRepository.addObjective({});

                                post.resolve({ CreatedOn: '' });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Objective Id is not a string');
                                });
                            });

                        });

                        describe('and response does not have an objective creation date', function () {

                            it('should reject promise', function () {
                                var promise = objectiveRepository.addObjective({});

                                post.resolve({ Id: '' });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Objective creation date is not a string');
                                });
                            });

                        });

                        describe('and response has id and creation date', function () {

                            var dataContext = require('dataContext');

                            var objectiveTitle = 'objectiveTitle';
                            var response = {
                                Id: 'objectiveId',
                                CreatedOn: "/Date(1378106938845)/"
                            };

                            beforeEach(function () {
                                dataContext.objectives = [];
                                post.resolve(response);
                            });

                            it('should resolve promise with objective', function () {
                                var promise = objectiveRepository.addObjective({});

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    var createdObjective = promise.inspect().value;
                                    expect(createdObjective.id).toEqual(response.Id);
                                    expect(createdObjective.createdOn).toEqual(utils.getDateFromString(response.CreatedOn));
                                });
                            });

                            it('should add objective to dataContext', function () {
                                var promise = objectiveRepository.addObjective({ title: objectiveTitle });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(dataContext.objectives.length).toEqual(1);
                                    expect(dataContext.objectives[0]).toEqual(new ObjectiveModel({
                                        id: response.Id,
                                        title: objectiveTitle,
                                        image: constants.defaultObjectiveImage,
                                        createdOn: utils.getDateFromString(response.CreatedOn),
                                        modifiedOn: utils.getDateFromString(response.CreatedOn),
                                        questions: []
                                    }));
                                });
                            });

                        });

                    });

                });

            });

            describe("updateObjective:", function () {

                it('should be function', function () {
                    expect(objectiveRepository.updateObjective).toBeFunction();
                });

                it('should return promise', function () {
                    expect(objectiveRepository.updateObjective()).toBePromise();
                });

                describe('when objective is not an object', function () {

                    it('should reject promise', function () {
                        var promise = objectiveRepository.updateObjective();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Objective data has invalid format');
                        });
                    });

                });

                describe('when objective id is not a string', function () {

                    it('should reject promise', function () {
                        var promise = objectiveRepository.updateObjective({ id: function () { }, title: '' });

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejected('Objective data has invalid format');
                        });
                    });

                });

                describe('when objective title is not a string', function () {

                    it('should reject promise', function () {
                        var promise = objectiveRepository.updateObjective({ id: '', title: function () { } });

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejected('Objective data has invalid format');
                        });
                    });

                });

                describe('when objective data has id and title', function () {

                    it('should send request to server to api/objective/update', function () {
                        var objective = { id: '', title: '', createdOn: '' };

                        httpWrapper.post.reset();
                        var promise = objectiveRepository.updateObjective(objective);

                        post.reject();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(httpWrapper.post).toHaveBeenCalledWith('api/objective/update', {
                                objectiveId: objective.id,
                                title: objective.title
                            });
                        });
                    });

                    describe('and request to server was not successful', function () {

                        var objective = { id: 'objectiveId', title: 'objectiveTitle' };

                        it('should reject promise', function () {
                            var reason = 'reason';
                            var promise = objectiveRepository.updateObjective(objective);

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

                        var objective = { id: 'objectiveId', title: 'objectiveTitle' };

                        describe('and response is not an object', function () {

                            it('should reject promise', function () {
                                var promise = objectiveRepository.updateObjective(objective);

                                post.resolve();

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                });
                            });

                        });

                        describe('and response does not have objective modification date', function () {

                            it('should reject promise', function () {
                                var promise = objectiveRepository.updateObjective(objective);

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

                            describe('and objective does not exist in dataContext', function () {

                                beforeEach(function () {
                                    dataContext.objectives = [];
                                });

                                it('should reject promise', function () {
                                    var promise = objectiveRepository.updateObjective(objective);

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
                                    dataContext.objectives = [{ id: objective.id, title: 'objective title' }];
                                });

                                it('should update title and modification date', function () {
                                    var promise = objectiveRepository.updateObjective(objective);

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(dataContext.objectives.length).toEqual(1);
                                        expect(dataContext.objectives[0].title).toEqual(objective.title);
                                        expect(dataContext.objectives[0].modifiedOn).toEqual(utils.getDateFromString(response.ModifiedOn));
                                    });
                                });

                                it('should resolve promise with modification date', function () {
                                    var promise = objectiveRepository.updateObjective(objective);

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

            describe('removeObjective:', function () {

                it('should be function', function () {
                    expect(objectiveRepository.removeObjective).toBeFunction();
                });

                it('should return promise', function () {
                    var result = objectiveRepository.removeObjective();
                    expect(result).toBePromise();
                });

                describe('when objective id is not a string', function () {

                    it('should reject promise', function () {
                        var promise = objectiveRepository.removeObjective();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejected();
                        });
                    });

                    it('should not send request to server to api/objective/delete', function () {
                        var promise = objectiveRepository.removeObjective();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(httpWrapper.post).not.toHaveBeenCalled();
                        });
                    });

                });

                describe('when objective id is a string', function () {

                    it('should send request to server to api/objective/delete', function () {
                        var objectiveId = 'id';
                        var promise = objectiveRepository.removeObjective(objectiveId);

                        post.reject();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(httpWrapper.post).toHaveBeenCalledWith('api/objective/delete', {
                                objectiveId: objectiveId
                            });
                        });
                    });

                    describe('and request to server was not successful', function () {

                        it('should reject promise', function () {
                            var reason = 'reason';
                            var promise = objectiveRepository.removeObjective('id');

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

                        var dataContext = require('dataContext');

                        it('should remove objective from dataContext', function () {
                            var objectiveId = 'id';
                            dataContext.objectives = [{ id: objectiveId }];

                            var promise = objectiveRepository.removeObjective(objectiveId);

                            post.resolve();

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(dataContext.objectives.length).toEqual(0);
                            });
                        });

                        it('should resolve promise', function () {
                            var promise = objectiveRepository.removeObjective('id');

                            post.resolve();

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeResolved();
                            });
                        });

                    });

                });
            });

        });

    }

);