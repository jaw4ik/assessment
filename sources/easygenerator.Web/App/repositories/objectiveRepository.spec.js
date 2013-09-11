define(['repositories/objectiveRepository'],
    function (objectiveRepository) {
        "use strict";

        var
           constants = require('constants'),
           http = require('plugins/http'),
           context = require('dataContext');;

        describe('repository [objectiveRepository]', function () {

            var post;

            beforeEach(function () {
                post = $.Deferred();
                spyOn(http, 'post').andReturn(post.promise());
            });

            it('should be object', function () {
                expect(objectiveRepository).toBeObject();
            });

            describe('getCollection:', function () {

                it('should be function', function () {
                    expect(objectiveRepository.getCollection).toBeFunction();
                });

                it('should be resolved with objectives collection', function () {
                    var objectivesList = [{ id: 1 }, { id: 2 }];
                    context.objectives = objectivesList;

                    var promise = objectiveRepository.getCollection();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeResolvedWith(objectivesList);
                    });
                });

            });

            describe('getById:', function () {

                it('should be function', function () {
                    expect(objectiveRepository.getById).toBeFunction();
                });

                describe('when arguments not valid', function () {

                    describe('and when Id is undefined', function () {

                        it('should throw exception', function () {
                            var f = function () { objectiveRepository.getById(); };
                            expect(f).toThrow();
                        });

                    });

                    describe('and when Id is null', function () {

                        it('should throw exception', function () {
                            var f = function () { objectiveRepository.getById(null); };
                            expect(f).toThrow();
                        });

                    });

                });

                describe('when arguments is valid', function () {

                    it('should return promise', function () {
                        var result = objectiveRepository.getById('0');
                        expect(result).toBePromise();
                    });

                    describe('and when objective does not exist', function () {

                        it('should be rejected', function () {
                            var promise = objectiveRepository.getById('');

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith('Objective does not exist');
                            });
                        });

                    });

                    describe('and when objective exists', function () {

                        it('should be resolved with objective from dataContext', function () {
                            var objective = { id: '0' };
                            context.objectives = [objective];

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

            describe('addObjective:', function () {

                it('should be function', function () {
                    expect(objectiveRepository.addObjective).toBeFunction();
                });

                it('should return promise', function () {
                    expect(objectiveRepository.addObjective()).toBePromise();
                });

                describe('when objective data is undefined', function () {

                    it('should reject promise', function () {
                        var promise = objectiveRepository.addObjective();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise.inspect().state).toEqual("rejected");
                        });
                    });

                });

                describe('when objective data is null', function () {

                    it('should reject promise', function () {
                        var promise = objectiveRepository.addObjective(null);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise.inspect().state).toEqual("rejected");
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
                            expect(http.post).toHaveBeenCalledWith('api/objective/create', objective);
                        });
                    });

                    describe('and send request to server', function () {

                        describe('and request failed', function () {

                            it('should reject promise', function () {
                                var promise = objectiveRepository.addObjective({});

                                post.reject();

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejected();
                                });
                            });

                        });

                        describe('and request succeed', function () {

                            describe('and response is undefined', function () {

                                it('should reject promise', function () {
                                    var promise = objectiveRepository.addObjective({});

                                    post.resolve();

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise).toBeRejected();
                                    });
                                });

                            });

                            describe('and response is null', function () {

                                it('should reject promise', function () {
                                    var promise = objectiveRepository.addObjective({});

                                    post.resolve(null);

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise).toBeRejected();
                                    });
                                });

                            });

                            describe('and response is an object', function () {

                                describe('and response is not successful', function () {

                                    beforeEach(function () {
                                        post.resolve({});
                                    });

                                    it('should reject promise', function () {
                                        var promise = objectiveRepository.addObjective({});

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(promise).toBeRejected();
                                        });
                                    });

                                });

                                describe('and response is successful', function () {

                                    describe('and response data is undefined', function () {

                                        beforeEach(function () {
                                            post.resolve({ success: true });
                                        });

                                        it('should reject promise', function () {
                                            var promise = objectiveRepository.addObjective({});

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(promise).toBeRejected();
                                            });
                                        });

                                    });

                                    describe('and response data is null', function () {

                                        beforeEach(function () {
                                            post.resolve({ success: true, data: null });
                                        });

                                        it('should reject promise', function () {
                                            var promise = objectiveRepository.addObjective({});

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(promise).toBeRejected();
                                            });
                                        });

                                    });

                                    describe('and response is an object', function () {

                                        var objectiveTitle = 'objectiveTitle';
                                        var response = {
                                            Id: 'objectiveId',
                                            CreatedOn: "/Date(1378106938845)/"
                                        };

                                        beforeEach(function () {
                                            post.resolve({ success: true, data: response });
                                        });

                                        it('should resolve promise with response object', function () {
                                            var promise = objectiveRepository.addObjective({});

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(promise).toBeResolvedWith(response.Id);
                                            });
                                        });

                                        it('should add objective to dataContext', function () {
                                            var dataContext = require('dataContext');
                                            dataContext.objectives = [];
                                            var date = new Date(parseInt(response.CreatedOn.substr(6), 10));

                                            var promise = objectiveRepository.addObjective({ title: objectiveTitle });

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(dataContext.objectives.length).toEqual(1);
                                                expect(dataContext.objectives[0]).toEqual({
                                                    id: response.Id,
                                                    title: objectiveTitle,
                                                    image: constants.defaultObjectiveImage,
                                                    createdOn: date,
                                                    modifiedOn: date,
                                                    questions: []
                                                });
                                            });
                                        });

                                    });

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
                            expect(promise).toBeRejected();
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
                            expect(promise).toBeRejected();
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
                            expect(promise).toBeRejected();
                        });
                    });

                });

                describe('when objective data has id and title', function () {

                    it('should send request to server to api/objective/update', function () {
                        var objective = { id: '', title: '', createdOn: '' };
                        
                        http.post.reset();
                        var promise = objectiveRepository.updateObjective(objective);
                        
                        post.reject();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(http.post).toHaveBeenCalledWith('api/objective/update', {
                                id: objective.id,
                                title: objective.title
                            });
                        });
                    });

                    describe('and send request to server', function () {

                        var objective = { id: 'objectiveId', title: 'objectiveTitle' };

                        describe('and request failed', function () {

                            it('should reject promise', function () {
                                var promise = objectiveRepository.updateObjective(objective);

                                post.reject();

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejected();
                                });
                            });

                        });

                        describe('and request succeed', function () {

                            describe('and response is not an object', function () {

                                it('should reject promise', function () {
                                    var promise = objectiveRepository.updateObjective(objective);

                                    post.resolve();

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise).toBeRejected();
                                    });
                                });

                            });

                            describe('and response is not successful', function () {

                                it('should reject promise', function () {
                                    var promise = objectiveRepository.updateObjective(objective);

                                    post.resolve({});

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise).toBeRejected();
                                    });
                                });

                            });

                            describe('and response data is not an object', function () {

                                it('should reject promise', function () {
                                    var promise = objectiveRepository.updateObjective(objective);

                                    post.resolve({ success: true });

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise).toBeRejected();
                                    });
                                });

                            });

                            describe('and response does not have modification date', function () {

                                it('should reject promise', function () {
                                    var promise = objectiveRepository.updateObjective(objective);

                                    post.resolve({ success: true, data: {} });

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise).toBeRejected();
                                    });
                                });

                            });

                            describe('and response is successful and has modification date', function () {

                                var dataContext = require('dataContext');

                                var response = {
                                    ModifiedOn: "/Date(1378106938845)/"
                                };

                                beforeEach(function () {
                                    post.resolve({ success: true, data: response });
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
                                            expect(promise).toBeRejected();
                                        });
                                    });

                                });

                                describe('and objective exists in dataContext', function () {

                                    beforeEach(function () {
                                        dataContext.objectives = [{ id: objective.id, title: 'objective title' }];
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

                describe('when invalid arguments', function () {

                    describe('and when id is undefined', function () {
                        it('should throw exception', function () {
                            var f = function () {
                                objectiveRepository.removeObjective(undefined);
                            };
                            expect(f).toThrow();
                        });
                    });

                    describe('and when id is null', function () {
                        it('should throw exception', function () {
                            var f = function () {
                                objectiveRepository.removeObjective(null);
                            };
                            expect(f).toThrow();
                        });
                    });

                });

                describe('when valid arguments', function () {

                    it('should return promise', function () {
                        var result = objectiveRepository.removeObjective(-1);
                        expect(result).toBePromise();
                    });

                    describe('when get objective', function () {

                        beforeEach(function () {
                            context.objectives = [{ id: 0 }];
                        });

                        describe('and when objective does not exist', function () {
                            it('should reject promise', function () {
                                var promise = objectiveRepository.removeObjective(-1);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Objective does not exist');
                                });
                            });
                        });

                        describe('and when objective exists', function () {
                            it('should be resolved', function () {
                                var promise = objectiveRepository.removeObjective(0);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeResolved();
                                });
                            });

                            it('should remove objective from dataContext', function () {
                                var promise = objectiveRepository.removeObjective(0);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(context.objectives.length).toBe(0);
                                });
                            });
                        });

                    });

                });
            });

        });

    }
);