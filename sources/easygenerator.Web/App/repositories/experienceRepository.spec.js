define(['repositories/experienceRepository'],
    function (experienceRepository) {
        "use strict";

        var
           constants = require('constants'),
           http = require('plugins/http');

        describe('repository [experienceRepository]', function () {

            var post;

            beforeEach(function () {
                post = $.Deferred();
                spyOn(http, 'post').andReturn(post.promise());
            });

            it('should be object', function () {
                expect(experienceRepository).toBeObject();
            });

            describe('addExperience:', function () {

                it('should be function', function () {
                    expect(experienceRepository.addExperience).toBeFunction();
                });

                it('should return promise', function () {
                    expect(experienceRepository.addExperience()).toBePromise();
                });

                describe('when experience data is undefined', function () {

                    it('should reject promise', function () {
                        var promise = experienceRepository.addExperience();

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
                        var promise = experienceRepository.addExperience(null);

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
                        var promise = experienceRepository.addExperience(experience);

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
                                var promise = experienceRepository.addExperience({});

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
                                    var promise = experienceRepository.addExperience({});

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
                                    var promise = experienceRepository.addExperience({});

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
                                        var promise = experienceRepository.addExperience({});

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
                                            var promise = experienceRepository.addExperience({});

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
                                            var promise = experienceRepository.addExperience({});

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
                                            var promise = experienceRepository.addExperience({});

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

                                            var promise = experienceRepository.addExperience({ title: experienceTitle });

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

        });

    }
);