define(['repositories/experienceRepository'],
    function (repository) {
        "use strict";

        var constants = require('constants'),
            http = require('plugins/http'),
            httpWrapper = require('httpWrapper'),
            dataContext = require('dataContext');

        describe('repository [experienceRepository]', function () {

            var post,
                httpWrapperPost;

            beforeEach(function () {
                post = $.Deferred();
                httpWrapperPost = Q.defer();
                spyOn(http, 'post').andReturn(post.promise());
                spyOn(httpWrapper, 'post').andReturn(httpWrapperPost.promise);
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

                it('should send request to server to api/experiences', function () {
                    var promise = repository.getCollection();

                    httpWrapperPost.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(httpWrapper.post).toHaveBeenCalledWith('api/experiences');
                    });
                });

                describe('and request failed', function () {

                    it('should reject promise with reason', function () {
                        var reason = 'reason';
                        var promise = repository.getCollection();

                        httpWrapperPost.reject(reason);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith(reason);
                        });
                    });

                });

                describe('and request succeed', function () {

                    it('should resolve promise with experiences collection', function () {
                        var experiences = [{ id: 1 }, { id: 2 }];
                        dataContext.experiences = experiences;

                        var promise = repository.getCollection();
                        httpWrapperPost.resolve(experiences);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolvedWith(experiences);
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

                describe('when id is not a string', function () {

                    it('should reject promise with \'Experience id (string) was expected\'', function () {
                        var promise = repository.getById();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Experience id (string) was expected');
                        });
                    });

                    it('should not send request to server to api/experiences', function () {
                        var promise = repository.getById();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(http.post).not.toHaveBeenCalled();
                        });
                    });

                });

                describe('when id is a string', function () {

                    it('should send request to server to api/experiences', function () {
                        var promise = repository.getCollection();

                        httpWrapperPost.resolve();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(httpWrapper.post).toHaveBeenCalledWith('api/experiences');
                        });
                    });

                    describe('and request failed', function () {
                        var reason = 'reason';
                        beforeEach(function () {
                            httpWrapperPost.reject(reason);
                        });

                        it('should reject promise with reason', function () {
                            var promise = repository.getCollection();

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
                            httpWrapperPost.resolve();
                        });

                        describe('and when experience does not exist', function () {

                            it('should reject promise with \'Experience with this id is not found\'', function () {
                                dataContext.experiences = [];
                                var promise = repository.getById('');

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Experience with this id is not found');
                                });
                            });

                        });

                        describe('and when experience exists', function () {

                            it('should be resolved with experience from dataContext', function () {
                                var experience = { id: '0' };
                                dataContext.experiences = [experience];

                                var promise = repository.getById('0');

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeResolvedWith(experience);
                                });
                            });

                        });

                    });

                });

            });

            describe('addExperience:', function () {

                it('should be function', function () {
                    expect(repository.addExperience).toBeFunction();
                });

                it('should return promise', function () {
                    expect(repository.addExperience()).toBePromise();
                });

                describe('when experience title is not a string', function () {

                    it('should reject promise', function () {
                        var promise = repository.addExperience(null);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Title is not a string');
                        });
                    });

                    it('should not send request to server', function () {
                        var promise = repository.addExperience(null);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(http.post).not.toHaveBeenCalled();
                        });
                    });

                });

                describe('when experience templateId is not a string', function () {
                    var title = "title";

                    it('should reject promise', function () {
                        var promise = repository.addExperience(title, null);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('TemplateId is not a string');
                        });
                    });

                    it('should not send request to server', function () {
                        var promise = repository.addExperience(title, null);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(http.post).not.toHaveBeenCalled();
                        });
                    });

                });

                describe('when experience title and templateId are strings', function () {
                    var title = 'title';
                    var templateId = 'templateId';

                    it('should send request to server to api/experience/create', function () {
                        var promise = repository.addExperience(title, templateId);

                        httpWrapperPost.reject();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(httpWrapper.post).toHaveBeenCalledWith('api/experience/create', { title: title, templateId: templateId });
                        });
                    });

                    describe('and send request to server', function () {

                        describe('and request failed', function () {

                            it('should reject promise', function () {
                                var promise = repository.addExperience(title, templateId);

                                httpWrapperPost.reject();

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

                                it('should reject promise with \'Response is not an object\'', function () {
                                    var promise = repository.addExperience(title, templateId);

                                    httpWrapperPost.resolve();

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise).toBeRejectedWith('Response is not an object');
                                    });
                                });

                            });

                            describe('and response is null', function () {

                                it('should reject promise with \'Response is not an object\'', function () {
                                    var promise = repository.addExperience(title, templateId);

                                    httpWrapperPost.resolve(null);

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise).toBeRejectedWith('Response is not an object');
                                    });
                                });

                            });

                            describe('and response is an object', function () {

                                describe('and response Id is undefined', function () {

                                    beforeEach(function () {
                                        httpWrapperPost.resolve({});
                                    });

                                    it('should reject promise with \'Response Id is not a string\'', function () {
                                        var promise = repository.addExperience(title, templateId);

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(promise).toBeRejectedWith('Response Id is not a string');
                                        });
                                    });

                                });

                                describe('and response Id is null', function () {

                                    beforeEach(function () {
                                        httpWrapperPost.resolve({ Id: null });
                                    });

                                    it('should reject promise with \'Response Id is not a string\'', function () {
                                        var promise = repository.addExperience(title, templateId);

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(promise).toBeRejectedWith('Response Id is not a string');
                                        });
                                    });

                                });

                                describe('and response Id is object', function () {

                                    describe('and response CreatedOn is null', function () {

                                        beforeEach(function () {
                                            httpWrapperPost.resolve({ Id: '0', CreatedOn: null });
                                        });

                                        it('should reject promise \'Response CreatedOn is not a string\'', function () {
                                            var promise = repository.addExperience(title, templateId);

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(promise).toBeRejectedWith('Response CreatedOn is not a string');
                                            });
                                        });

                                    });

                                    describe('and response CreatedOn is undefined', function () {

                                        beforeEach(function () {
                                            httpWrapperPost.resolve({ Id: 'id' });
                                        });

                                        it('should reject promise with \'Response CreatedOn is not a string\'', function () {
                                            var promise = repository.addExperience(title, templateId);

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(promise).toBeRejectedWith('Response CreatedOn is not a string');
                                            });
                                        });
                                    });

                                    describe('and response CreatedOn is object', function () {
                                        var experienceId = 'experienceId';
                                        var experienceCreatedOn = '/Date(1378106938845)/';

                                        beforeEach(function () {
                                            httpWrapperPost.resolve({ Id: experienceId, CreatedOn: experienceCreatedOn });
                                        });

                                        describe('and template not found in dataContext', function () {

                                            beforeEach(function () {
                                                dataContext.templates = [];
                                            });

                                            it('should reject promise with \'Template does not exist in dataContext\'', function () {
                                                var promise = repository.addExperience(title, templateId);

                                                waitsFor(function () {
                                                    return !promise.isPending();
                                                });
                                                runs(function () {
                                                    expect(promise).toBeRejectedWith('Template does not exist in dataContext');
                                                });
                                            });

                                        });

                                        describe('and template found in dataContext', function () {
                                            var template;
                                            beforeEach(function () {
                                                template = { id: templateId, name: 'template name', image: 'template image' };
                                                dataContext.templates = [template];
                                            });

                                            it('should resolve promise with experience', function () {
                                                var promise = repository.addExperience(title, templateId);

                                                waitsFor(function () {
                                                    return !promise.isPending();
                                                });
                                                runs(function () {
                                                    var experience = promise.inspect().value;
                                                    expect(experience.id).toBe(experienceId);
                                                    expect(experience.createdOn).toEqual(utils.getDateFromString(experienceCreatedOn));
                                                });
                                            });

                                            it('should add experience to dataContext', function () {

                                                dataContext.experiences = [];

                                                var promise = repository.addExperience(title, templateId);

                                                waitsFor(function () {
                                                    return !promise.isPending();
                                                });
                                                runs(function () {
                                                    expect(dataContext.experiences.length).toEqual(1);
                                                    expect(dataContext.experiences[0]).toEqual({
                                                        id: experienceId,
                                                        title: title,
                                                        template: template,
                                                        createdOn: utils.getDateFromString(experienceCreatedOn),
                                                        modifiedOn: utils.getDateFromString(experienceCreatedOn),
                                                        buildingStatus: constants.statuses.notStarted,
                                                        publishingState: constants.statuses.notStarted,
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

                        httpWrapperPost.reject();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(httpWrapper.post).toHaveBeenCalledWith('api/experience/delete', {
                                experienceId: experienceId
                            });
                        });
                    });

                    describe('and send request to server', function () {

                        describe('and request failed', function () {

                            it('should reject promise', function () {
                                var reason = 'reason';
                                var promise = repository.removeExperience('id');

                                httpWrapperPost.reject(reason);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith(reason);
                                });
                            });

                        });

                        describe('and request succeed', function () {

                            describe('and response is an object', function () {

                                it('should resolve promise', function () {
                                    var promise = repository.removeExperience('id');

                                    httpWrapperPost.resolve();

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
                                    httpWrapperPost.resolve();
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

            describe('relateObjectives:', function () {

                it('should be function', function () {
                    expect(repository.relateObjectives).toBeFunction();
                });

                it('should return promise', function () {
                    var result = repository.relateObjectives('0', []);
                    expect(result).toBePromise();
                });

                describe('when argument \"experienceId\" is not a string', function () {

                    it('should reject promise', function () {
                        var promise = repository.relateObjectives({});

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejected();
                        });
                    });

                });

                describe('when argument \"objectives\" is not an array', function () {

                    it('should reject promise', function () {
                        var promise = repository.relateObjectives('some experience Id', {});

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejected();
                        });
                    });

                });

                describe('when arguments are valid', function () {

                    var experience;
                    var objectives;

                    beforeEach(function () {
                        experience = { id: "SomeExperienceId" };
                        objectives = [{ id: "SomeObjectiveId1" }, { id: "SomeObjectiveId2" }];
                    });

                    it('should send request to server', function () {
                        var promise = repository.relateObjectives(experience.id, objectives);
                        httpWrapperPost.resolve();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(httpWrapper.post).toHaveBeenCalled();
                        });
                    });

                    describe('and request to server failed', function () {

                        it('should reject promise', function () {
                            var promise = repository.relateObjectives(experience.id, objectives);
                            httpWrapperPost.reject('Some reason');

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith('Some reason');
                            });
                        });

                    });

                    describe('and request to server succeed', function () {

                        describe('and response is not an object', function () {

                            it('should reject promise with \'Response is not an object\'', function () {
                                var promise = repository.relateObjectives(experience.id, objectives);
                                httpWrapperPost.resolve();

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                });
                            });

                        });

                        describe('and response has no midifiedOn date', function () {

                            it('should reject promise with \'Response does not have modification date\'', function () {
                                var promise = repository.relateObjectives(experience.id, objectives);
                                httpWrapperPost.resolve({});

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Response does not have modification date');
                                });
                            });

                        });

                        describe('and response has no relatedObjectives collection', function () {

                            it('should reject promise with \'Response does not have related objectives collection\'', function () {
                                var promise = repository.relateObjectives(experience.id, objectives);
                                httpWrapperPost.resolve({ ModifiedOn: '/Date(1378106938845)/' });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Response does not have related objectives collection');
                                });
                            });

                        });

                        describe('and experience doesn`t exist in dataContext', function () {

                            it('should reject promise', function () {
                                dataContext.experiences = [];
                                var promise = repository.relateObjectives(experience.id, objectives);
                                httpWrapperPost.resolve({ ModifiedOn: '/Date(1378106938845)/', RelatedObjectives: [] });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Experience doesn`t exist');
                                });
                            });

                        });

                        describe('and experience exists in dataContext', function () {

                            it('should update expereince modifiedOn date', function () {
                                dataContext.experiences = [{ id: experience.id, modifiedOn: new Date(), objectives: [] }];
                                var promise = repository.relateObjectives(experience.id, objectives);
                                httpWrapperPost.resolve({ ModifiedOn: '/Date(1378106938845)/', RelatedObjectives: [] });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(dataContext.experiences[0].modifiedOn).toEqual(utils.getDateFromString('/Date(1378106938845)/'));
                                });
                            });

                            it('should relate objectives to experience', function () {
                                dataContext.experiences = [{ id: experience.id, modifiedOn: new Date(), objectives: [] }];
                                var promise = repository.relateObjectives(experience.id, objectives);
                                httpWrapperPost.resolve({ ModifiedOn: '/Date(1378106938845)/', RelatedObjectives: [{ Id: objectives[0].id }] });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(dataContext.experiences[0].objectives).toEqual([objectives[0]]);
                                });
                            });

                            it('should resolve promise with modification date and related objectives collection', function () {
                                dataContext.experiences = [{ id: experience.id, modifiedOn: new Date(), objectives: [] }];
                                var promise = repository.relateObjectives(experience.id, objectives);
                                httpWrapperPost.resolve({ ModifiedOn: '/Date(1378106938845)/', RelatedObjectives: [{ Id: objectives[0].id }] });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeResolvedWith({
                                        modifiedOn: utils.getDateFromString('/Date(1378106938845)/'),
                                        relatedObjectives: [{ id: objectives[0].id }]
                                    });
                                });
                            });

                        });

                    });

                });

            });

            describe('unrelateObjectives', function () {

                it('should be a function', function () {
                    expect(repository.unrelateObjectives).toBeFunction();
                });

                it('should return promise', function () {
                    var result = repository.unrelateObjectives('0', []);
                    expect(result).toBePromise();
                });

                describe('when argument \"experienceId\" is undefined', function () {

                    it('should reject pomise', function () {
                        var promise = repository.unrelateObjectives();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejected();
                        });
                    });

                });

                describe('when argument \"experienceId\" is null', function () {

                    it('should reject promise', function () {
                        var promise = repository.unrelateObjectives(null);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejected();
                        });
                    });

                });

                describe('when argument \"experienceId\" is not a string', function () {

                    it('should reject promise', function () {
                        var promise = repository.unrelateObjectives({});

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejected();
                        });
                    });

                });

                describe('when argument \"objectives\" is undefined', function () {

                    it('should reject promise', function () {
                        var promise = repository.unrelateObjectives('some experience Id');

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejected();
                        });
                    });

                });

                describe('when argument \"objectives\" is null', function () {

                    it('should reject promise', function () {
                        var promise = repository.unrelateObjectives('some experience Id', null);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejected();
                        });
                    });

                });

                describe('when argument \"objectives\" is not an array', function () {

                    it('should reject promise', function () {
                        var promise = repository.unrelateObjectives('some experience Id', {});

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejected();
                        });
                    });

                });

                describe('when all arguments are valid', function () {
                    var experience;
                    var objectives;

                    beforeEach(function () {
                        experience = { id: "SomeExperienceId" };
                        objectives = [{ id: "SomeObjectiveId1" }, { id: "SomeObjectiveId2" }];
                    });

                    it('should send request to server', function () {
                        var promise = repository.unrelateObjectives(experience.id, objectives);
                        httpWrapperPost.resolve();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(httpWrapper.post).toHaveBeenCalled();
                        });
                    });

                    describe('and request to server failed', function () {

                        it('should reject promise', function () {
                            var promise = repository.unrelateObjectives(experience.id, objectives);
                            httpWrapperPost.reject('Some reason');

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith('Some reason');
                            });
                        });

                    });

                    describe('and request to server succeed', function () {

                        describe('and response is not an object', function () {

                            it('should reject promise', function () {
                                var promise = repository.unrelateObjectives(experience.id, objectives);
                                httpWrapperPost.resolve();

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                });
                            });

                        });

                        describe('and response has no midifiedOn date', function () {

                            it('should reject promise', function () {
                                var promise = repository.unrelateObjectives(experience.id, objectives);
                                httpWrapperPost.resolve({});

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Response does not have modification date');
                                });
                            });

                        });

                        describe('and experience doesn`t exist in dataContext', function () {

                            it('should reject promise', function () {
                                dataContext.experiences = [];
                                var promise = repository.unrelateObjectives(experience.id, objectives);
                                httpWrapperPost.resolve({ ModifiedOn: '/Date(1378106938845)/', RelatedObjectives: {} });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Experience doesn`t exist');
                                });
                            });

                        });

                        describe('and experience exists in dataContext', function () {

                            it('should update expereince modifiedOn date', function () {
                                dataContext.experiences = [{ id: experience.id, modifiedOn: new Date(), objectives: [] }];
                                var promise = repository.unrelateObjectives(experience.id, objectives);
                                httpWrapperPost.resolve({ ModifiedOn: '/Date(1378106938845)/' });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(dataContext.experiences[0].modifiedOn).toEqual(utils.getDateFromString('/Date(1378106938845)/'));
                                });
                            });

                            it('should unrelate objectives from experience', function () {
                                dataContext.experiences = [{ id: experience.id, modifiedOn: new Date(), objectives: objectives }];
                                var promise = repository.unrelateObjectives(experience.id, objectives);
                                httpWrapperPost.resolve({ ModifiedOn: '/Date(1378106938845)/' });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(dataContext.experiences[0].objectives).toEqual([]);
                                });
                            });

                            it('should resolve promise with modification date', function () {
                                dataContext.experiences = [{ id: experience.id, modifiedOn: new Date(), objectives: [] }];
                                var promise = repository.unrelateObjectives(experience.id, objectives);
                                httpWrapperPost.resolve({ ModifiedOn: '/Date(1378106938845)/' });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeResolvedWith(utils.getDateFromString('/Date(1378106938845)/'));
                                });
                            });

                        });

                    });

                });

            });

            describe('updateExperienceTitle:', function () {

                it('should be function', function () {
                    expect(repository.updateExperienceTitle).toBeFunction();
                });

                it('should return promise', function () {
                    expect(repository.updateExperienceTitle()).toBePromise();
                });

                describe('when experienceId is not a string', function () {

                    it('should reject promise with reason \'Experience id is not a string\'', function () {
                        var promise = repository.updateExperienceTitle({}, 'Some title');

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Experience id is not a string');
                        });
                    });

                });

                describe('when experienceTitle is not a string', function () {

                    it('should reject promise with reason \'Experience title is not a string\'', function () {
                        var promise = repository.updateExperienceTitle('Some id', {});

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Experience title is not a string');
                        });
                    });

                });

                describe('when experienceId and experienceTitle are strings', function () {

                    it('should send request to /api/experience/updateTitle', function () {
                        var experienceId = 'Some id',
                            experienceTitle = 'Some title';
                        var promise = repository.updateExperienceTitle(experienceId, experienceTitle);
                        httpWrapperPost.resolve();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(httpWrapper.post).toHaveBeenCalledWith('api/experience/updateTitle', jasmine.any(Object));
                            expect(httpWrapper.post.mostRecentCall.args[1].experienceId).toEqual(experienceId);
                            expect(httpWrapper.post.mostRecentCall.args[1].experienceTitle).toEqual(experienceTitle);
                        });
                    });

                    describe('and request fails', function () {

                        it('should reject promise', function () {
                            var reason = 'Some reason';
                            var promise = repository.updateExperienceTitle('Some id', 'Some title');
                            httpWrapperPost.reject(reason);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith(reason);
                            });
                        });

                    });

                    describe('and request successful', function () {

                        describe('and response is not an object', function () {

                            it('should reject promise with \'Response is not an object\'', function () {
                                var promise = repository.updateExperienceTitle('Some id', 'Some title');
                                httpWrapperPost.resolve('Not an object');

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                });
                            });

                        });

                        describe('and response is an object', function () {

                            describe('and doesn`t have ModifiedOn date', function () {

                                it('should reject promise with \'Response does not have modification date\'', function () {
                                    var promise = repository.updateExperienceTitle('Some id', 'Some title');
                                    httpWrapperPost.resolve({});

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise).toBeRejectedWith('Response does not have modification date');
                                    });
                                });

                            });

                            describe('and have ModifiedOn date', function () {

                                describe('and experience not found in dataContext', function () {

                                    it('should reject promise with \'Experience does not exist in dataContext\'', function () {
                                        dataContext.experiences = [];
                                        var promise = repository.updateExperienceTitle('Some id', 'Some title');
                                        httpWrapperPost.resolve({ ModifiedOn: "/Date(1378106938845)/" });

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(promise).toBeRejectedWith('Experience does not exist in dataContext');
                                        });
                                    });

                                });

                                describe('and experience found in dataContext', function () {

                                    it('should update experience title', function () {
                                        var newTitle = 'Some new title',
                                            newModifiedOnDate = "/Date(1378106938845)/",
                                            experience = {
                                                id: 'Some id',
                                                title: 'Original title',
                                                modifiedOn: 'Some date'
                                            };

                                        dataContext.experiences = [experience];
                                        var promise = repository.updateExperienceTitle(experience.id, newTitle);
                                        httpWrapperPost.resolve({ ModifiedOn: newModifiedOnDate });

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(experience.title).toEqual(newTitle);
                                        });
                                    });

                                    it('should update experience modifiedOn date', function () {
                                        var newTitle = 'Some new title',
                                            newModifiedOnDate = "/Date(1378106938845)/",
                                            parsedNewModifiedOnDate = new Date(parseInt(newModifiedOnDate.substr(6), 10)),
                                            experience = {
                                                id: 'Some id',
                                                title: 'Original title',
                                                modifiedOn: 'Some date'
                                            };

                                        dataContext.experiences = [experience];
                                        var promise = repository.updateExperienceTitle(experience.id, newTitle);
                                        httpWrapperPost.resolve({ ModifiedOn: newModifiedOnDate });

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(experience.modifiedOn).toEqual(parsedNewModifiedOnDate);
                                        });
                                    });

                                    it('should resolve promise with modifiedOn date', function () {
                                        var newTitle = 'Some new title',
                                            newModifiedOnDate = "/Date(1378106938845)/",
                                            parsedNewModifiedOnDate = new Date(parseInt(newModifiedOnDate.substr(6), 10)),
                                            experience = {
                                                id: 'Some id',
                                                title: 'Original title',
                                                modifiedOn: 'Some date'
                                            };

                                        dataContext.experiences = [experience];
                                        var promise = repository.updateExperienceTitle(experience.id, newTitle);
                                        httpWrapperPost.resolve({ ModifiedOn: newModifiedOnDate });

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(promise).toBeResolvedWith(parsedNewModifiedOnDate);
                                        });
                                    });

                                });

                            });

                        });

                    });

                });

            });

            describe('updateExperienceTemplate:', function () {

                it('should be function', function () {
                    expect(repository.updateExperienceTemplate).toBeFunction();
                });

                it('should return promise', function () {
                    expect(repository.updateExperienceTemplate()).toBePromise();
                });

                describe('when experienceId is not a string', function () {

                    it('should reject promise with reason \'Experience id is not a string\'', function () {
                        var promise = repository.updateExperienceTemplate({}, 'Some title');

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Experience id is not a string');
                        });
                    });

                });

                describe('when templateId is not a string', function () {

                    it('should reject promise with reason \'Template id is not a string\'', function () {
                        var promise = repository.updateExperienceTemplate('Some id', {});

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Template id is not a string');
                        });
                    });

                });

                describe('when experienceId and templateId are strings', function () {

                    it('should send request to /api/experience/updateTemplate', function () {
                        var experienceId = 'Some id',
                            templateId = 'Some template id';
                        var promise = repository.updateExperienceTemplate(experienceId, templateId);
                        httpWrapperPost.resolve();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(httpWrapper.post).toHaveBeenCalledWith('api/experience/updateTemplate', jasmine.any(Object));
                            expect(httpWrapper.post.mostRecentCall.args[1].experienceId).toEqual(experienceId);
                            expect(httpWrapper.post.mostRecentCall.args[1].templateId).toEqual(templateId);
                        });
                    });

                    describe('and request fails', function () {

                        it('should reject promise', function () {
                            var reason = 'Some reason';
                            var promise = repository.updateExperienceTemplate('Some id', 'Some template id');
                            httpWrapperPost.reject(reason);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith(reason);
                            });
                        });

                    });

                    describe('and request successful', function () {

                        describe('and response is not an object', function () {

                            it('should reject promise with \'Response is not an object\'', function () {
                                var promise = repository.updateExperienceTemplate('Some id', 'Some template id');
                                httpWrapperPost.resolve('Not an object');

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Response is not an object');
                                });
                            });

                        });

                        describe('and response is an object', function () {

                            describe('and doesn`t have ModifiedOn date', function () {

                                it('should reject promise with \'Response does not have modification date\'', function () {
                                    var promise = repository.updateExperienceTemplate('Some id', 'Some template id');
                                    httpWrapperPost.resolve({});

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise).toBeRejectedWith('Response does not have modification date');
                                    });
                                });

                            });

                            describe('and have ModifiedOn date', function () {

                                var newModifiedOnDate;
                                beforeEach(function () {
                                    newModifiedOnDate = "/Date(1378106938845)/";
                                    httpWrapperPost.resolve({ ModifiedOn: newModifiedOnDate });
                                });

                                describe('and experience not found in dataContext', function () {

                                    beforeEach(function () {
                                        dataContext.experiences = [];
                                    });

                                    it('should reject promise with \'Experience does not exist in dataContext\'', function () {
                                        var promise = repository.updateExperienceTemplate('Some id', 'Some template id');

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(promise).toBeRejectedWith('Experience does not exist in dataContext');
                                        });
                                    });

                                });

                                describe('and experience found in dataContext', function () {
                                    var experience;
                                    beforeEach(function () {
                                        experience = {
                                            id: 'Some id',
                                            title: 'Original title',
                                            modifiedOn: 'Some date'
                                        };

                                        dataContext.experiences = [experience];
                                    });

                                    describe('and template not found in dataContext', function () {

                                        beforeEach(function () {
                                            dataContext.templates = [];
                                        });

                                        it('should reject promise with \'Template does not exist in dataContext\'', function () {
                                            var promise = repository.updateExperienceTemplate('Some id', 'Some template id');

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(promise).toBeRejectedWith('Template does not exist in dataContext');
                                            });
                                        });

                                    });

                                    describe('and template found in dataContext', function () {
                                        var template;
                                        beforeEach(function () {
                                            template = { id: 'template id', name: 'template name', image: 'template image' };
                                            dataContext.templates = [template];
                                        });

                                        it('should update experience template', function () {
                                            var promise = repository.updateExperienceTemplate(experience.id, template.id);

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(experience.template).toEqual(template);
                                            });
                                        });

                                        it('should update experience modifiedOn date', function () {
                                            var promise = repository.updateExperienceTemplate(experience.id, template.id);

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(experience.modifiedOn).toEqual(utils.getDateFromString(newModifiedOnDate));
                                            });
                                        });

                                        it('should resolve promise with modifiedOn date', function () {
                                            var promise = repository.updateExperienceTemplate(experience.id, template.id);
                                            httpWrapperPost.resolve({ ModifiedOn: newModifiedOnDate });

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(promise).toBeResolvedWith({ modifiedOn: utils.getDateFromString(newModifiedOnDate) });
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
