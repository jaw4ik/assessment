define(['repositories/experienceRepository'],
    function (repository) {
        "use strict";

        var
            constants = require('constants'),
            http = require('plugins/http'),
            context = require('dataContext');

        describe('repository [experienceRepository]', function () {

            var post;

            beforeEach(function () {
                post = $.Deferred();
                spyOn(http, 'post').andReturn(post.promise());
            });

            it('should be object', function () {
                expect(repository).toBeObject();
            });

            describe('addExperience:', function () {

                it('should be function', function () {
                    expect(repository.addExperience).toBeFunction();
                });

                it('should return promise', function () {
                    expect(repository.addExperience()).toBePromise();
                });

                describe('when experience data is undefined', function () {

                    it('should reject promise', function () {
                        var promise = repository.addExperience();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejected();
                        });
                    });

                });

                describe('when experience data is null', function () {

                    it('should reject promise', function () {
                        var promise = repository.addExperience(null);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejected();
                        });
                    });

                });

                describe('when experience data is an object', function () {

                    it('should send request to server to api/experience/create', function () {
                        var experience = {};
                        var promise = repository.addExperience(experience);

                        post.reject();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(http.post).toHaveBeenCalledWith('api/experience/create', experience);
                        });
                    });

                    describe('and send request to server', function () {

                        describe('and request failed', function () {

                            it('should reject promise', function () {
                                var promise = repository.addExperience({});

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
                                    var promise = repository.addExperience({});

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
                                    var promise = repository.addExperience({});

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
                                        var promise = repository.addExperience({});

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
                                            var promise = repository.addExperience({});

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
                                            var promise = repository.addExperience({});

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(promise).toBeRejected();
                                            });
                                        });

                                    });

                                    describe('and response data is an object', function () {

                                        var experienceId = 'experienceId';
                                        var experienceTitle = 'experienceTitle';
                                        var experienceCreatedOn = '/Date(1378106938845)/';

                                        beforeEach(function () {
                                            post.resolve({ success: true, data: { Id: experienceId, CreatedOn: experienceCreatedOn } });
                                        });

                                        it('should resolve promise with experience id', function () {
                                            var promise = repository.addExperience({});

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(promise).toBeResolvedWith(experienceId);
                                            });
                                        });

                                        it('should add experience to dataContext', function () {
                                            var dataContext = require('dataContext');
                                            dataContext.experiences = [];

                                            var promise = repository.addExperience({ title: experienceTitle });

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(dataContext.experiences.length).toEqual(1);
                                                expect(dataContext.experiences[0]).toEqual({
                                                    id: experienceId,
                                                    title: experienceTitle,
                                                    createdOn: utils.getDateFromString(experienceCreatedOn),
                                                    modifiedOn: utils.getDateFromString(experienceCreatedOn),
                                                    buildingStatus: constants.buildingStatuses.notStarted,
                                                    objectives: []
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

            describe('removeExperience:', function () {

                it('should be function', function () {
                    expect(repository.removeExperience).toBeFunction();
                });

                it('should return promise', function () {
                    expect(repository.removeExperience()).toBePromise();
                });

                describe('when experience id is not a string', function () {

                    it('should reject promise', function () {
                        var promise = repository.removeExperience();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejected();
                        });
                    });

                    it('should not send request to server to api/experience/delete', function () {
                        var promise = repository.removeExperience();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(http.post).not.toHaveBeenCalled();
                        });
                    });

                });

                describe('when experience id is a string', function () {

                    it('should send request to server to api/experience/delete', function () {
                        var experienceId = 'id';
                        var promise = repository.removeExperience(experienceId);

                        post.reject();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(http.post).toHaveBeenCalledWith('api/experience/delete', {
                                experienceId: experienceId
                            });
                        });
                    });

                    describe('and send request to server', function () {

                        describe('and request failed', function () {

                            it('should reject promise', function () {
                                var reason = 'reason';
                                var promise = repository.removeExperience('id');

                                post.reject(reason);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith(reason);
                                });
                            });

                        });

                        describe('and request succeed', function () {

                            describe('and response is not an object', function () {

                                it('should reject promise', function () {
                                    var promise = repository.removeExperience('id');

                                    post.resolve();

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
                                        var promise = repository.removeExperience('id');

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(promise).toBeRejected();
                                        });
                                    });

                                });

                                describe('and response is successful', function () {

                                    beforeEach(function () {
                                        post.resolve({ success: true });
                                    });

                                    it('should resolve promise', function () {
                                        var promise = repository.removeExperience('id');

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(promise).toBeResolved();
                                        });
                                    });

                                    it('should remove experience from dataContext', function () {
                                        var experienceId = 'id';
                                        var dataContext = require('dataContext');
                                        dataContext.experiences = [{ id: 'id' }];

                                        var promise = repository.removeExperience(experienceId);

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(dataContext.experiences.length).toEqual(0);
                                        });
                                    });

                                });

                            });

                        });

                    });

                });

            });

            describe('relateObjectives:', function () {

                it('should be function', function () {
                    expect(repository.relateObjectives).toBeFunction();
                });

                describe('when invalid arguments', function () {

                    describe('when experienceId undefined', function () {

                        it('should throw exception', function () {
                            var f = function () { repository.relateObjectives(); };
                            expect(f).toThrow();
                        });

                    });

                    describe('when experienceId is null', function () {

                        it('should throw exception', function () {
                            var f = function () { repository.relateObjectives(null); };
                            expect(f).toThrow();
                        });

                    });

                    describe('when input objectives is undefined', function() {

                        it('should throw exception', function() {
                            var f = function () { repository.relateObjectives('0'); };
                            expect(f).toThrow();
                        });

                    });
                    
                    describe('when input objectives is null', function () {

                        it('should throw exception', function () {
                            var f = function () { repository.relateObjectives('0', null); };
                            expect(f).toThrow();
                        });

                    });
                    
                    describe('when input objectives are not array', function () {

                        it('should throw exception', function () {
                            var f = function () { repository.relateObjectives('0', {}); };
                            expect(f).toThrow();
                        });

                    });

                });

                describe('when valid arguments', function () {

                    it('should return promise', function () {
                        var result = repository.relateObjectives('0', []);
                        expect(result).toBePromise();
                    });

                    describe('when get experience', function () {

                        describe('and experience not exist', function () {

                            it('should reject promise', function () {
                                context.experiences = [];

                                var promise = repository.relateObjectives('0', []);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Experience not exist');
                                });
                            });

                        });

                        describe('and experience exists', function () {

                            describe('and objectives not exist', function () {

                                it('should reject promise', function () {
                                    context.experiences = [{ id: '0' }];

                                    var promise = repository.relateObjectives('0', []);

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise).toBeRejectedWith('Objectives not exist');
                                    });
                                });

                            });

                            describe('and objectives are exists', function () {

                                describe('when objectives have been related', function() {

                                    it('should not be related', function() {
                                        context.experiences = [{ id: '1', objectives: [{ id: '0' }] }];

                                        var promise = repository.relateObjectives('1', [{ id: '0' }]);

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(context.experiences[0].objectives.length).toBe(1);
                                        });
                                    });

                                });

                                describe('when objectives are not related', function() {
                                    
                                    it('should append list of objectives to experience', function () {
                                        context.experiences = [{ id: '1', objectives: [] }];

                                        var promise = repository.relateObjectives('1', [{ id: '0' }, { id: '1' }]);

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(context.experiences[0].objectives.length).toBe(2);
                                        });
                                    });

                                });

                            });

                        });

                    });

                });

            });

        });

    }
);