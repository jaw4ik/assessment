define(['viewmodels/objectives/objective'],
    function (viewModel) {
        "use strict";

        var router = require('plugins/router'),
            eventTracker = require('eventTracker'),
            constants = require('constants'),
            repository = require('repositories/objectiveRepository'),
            experienceRepository = require('repositories/experienceRepository'),
            questionRepository = require('repositories/questionRepository'),
            localizationManager = require('localization/localizationManager'),
            notify = require('notify'),
            clientContext = require('clientContext');

        describe('viewModel [objective]', function () {

            var objective = {
                id: '1',
                title: 'Test Objective 1',
                createdOn: new Date(),
                modifiedOn: new Date(),
                image: '',
                questions: [
                    { id: 0, title: 'A' },
                    { id: 1, title: 'b' },
                    { id: 2, title: 'B' },
                    { id: 3, title: 'a' }
                ]
            };

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigateWithQueryString');
                spyOn(router, 'navigate');
                spyOn(router, 'replace');
            });

            it('is object', function () {
                expect(viewModel).toBeObject();
            });

            describe('activate:', function () {

                var deferred, getExperienceDeferred;

                beforeEach(function () {
                    deferred = Q.defer();
                    getExperienceDeferred = Q.defer();
                    spyOn(repository, 'getCollection').andReturn(deferred.promise);
                    spyOn(experienceRepository, 'getById').andReturn(getExperienceDeferred.promise);
                });

                it('should be a function', function () {
                    expect(viewModel.activate).toBeFunction();
                });

                it('should set client context with current objective id', function () {
                    spyOn(clientContext, 'set');
                    var promise = viewModel.activate(objective.id, null);
                    deferred.resolve(null);
                    
                    waitsFor(function () {
                        return promise.isFulfilled();
                    });
                    runs(function () {
                        expect(clientContext.set).toHaveBeenCalledWith('lastVisitedObjective', objective.id);
                    });

                });

                describe('when query params null', function () {

                    it('should set contextExperienceTitle to null', function () {
                        var objectives = 'objectives';
                        deferred.resolve(null);
                        spyOn(localizationManager, 'localize').andReturn(objectives);
                        viewModel.contextExperienceTitle = '';
                        var promise = viewModel.activate(objective.id, null);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.contextExperienceTitle).toBeNull();
                        });
                    });

                    describe('when objective not found', function () {

                        beforeEach(function () {
                            deferred.resolve(null);
                        });

                        it('should navigate to #404', function () {
                            var promise = viewModel.activate(objective.id, null);
                            waitsFor(function () {
                                return promise.isFulfilled();
                            });
                            runs(function () {
                                expect(router.replace).toHaveBeenCalledWith('404');
                            });
                        });

                        it('should resolve promise with undefined', function () {
                            var promise = viewModel.activate(objective.id, null);
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeResolvedWith(undefined);
                            });
                        });

                    });

                    describe('when single objective exists', function () {
                        beforeEach(function () {
                            deferred.resolve([objective]);
                        });

                        it('should return promise', function () {
                            expect(viewModel.activate('id')).toBePromise();
                        });

                        it('should set objective title', function () {
                            viewModel.title('');

                            var promise = viewModel.activate(objective.id, null);

                            waitsFor(function () {
                                return promise.isFulfilled();
                            });
                            runs(function () {
                                expect(viewModel.title()).toBe(objective.title);
                            });
                        });

                        it('should set objective createdOn', function () {
                            viewModel.createdOn = null;
                            var promise = viewModel.activate(objective.id, null);
                            waitsFor(function () {
                                return promise.isFulfilled();
                            });
                            runs(function () {
                                expect(viewModel.createdOn).toBe(objective.createdOn);
                            });
                        });

                        it('should set objective modifiedOn', function () {
                            viewModel.modifiedOn(null);
                            var promise = viewModel.activate(objective.id, null);
                            waitsFor(function () {
                                return promise.isFulfilled();
                            });
                            runs(function () {
                                expect(viewModel.modifiedOn()).toBe(objective.modifiedOn);
                            });
                        });

                        it('should set current objective image', function () {
                            viewModel.image(null);
                            var promise = viewModel.activate(objective.id, null);
                            waitsFor(function () {
                                return promise.isFulfilled();
                            });
                            runs(function () {
                                expect(viewModel.image()).toBe(objective.image);
                            });
                        });

                        it('should initialize questions collection', function () {
                            viewModel.questions([]);
                            var promise = viewModel.activate(objective.id, null);
                            waitsFor(function () {
                                return promise.isFulfilled();
                            });
                            runs(function () {
                                expect(viewModel.questions().length).toBe(objective.questions.length);
                            });
                        });

                        describe('when currentSortingOption is asc', function () {

                            it('should sort questions asc', function () {
                                viewModel.currentSortingOption(constants.sortingOptions.byTitleAsc);
                                var promise = viewModel.activate(objective.id, null);
                                waitsFor(function () {
                                    return promise.isFulfilled();
                                });
                                runs(function () {
                                    expect(viewModel.questions).toBeSortedAsc('title');
                                });
                            });

                        });

                        describe('when currentSortingOption is desc', function () {

                            it('should sort questions desc', function () {
                                viewModel.currentSortingOption(constants.sortingOptions.byTitleDesc);
                                var promise = viewModel.activate(objective.id, null);
                                waitsFor(function () {
                                    return promise.isFulfilled();
                                });
                                runs(function () {
                                    expect(viewModel.questions).toBeSortedDesc('title');
                                });
                            });

                        });

                    });

                    describe('when few objectives exist', function () {

                        describe('when previous objective exists in sorted by title objectives collection', function () {

                            it('should set previousObjectiveId', function () {
                                var previousObjectiveId = '0';
                                deferred.resolve([{ id: previousObjectiveId, title: 'B' }, { id: '0', title: 'a' }, objective]);
                                var promise = viewModel.activate(objective.id, null);
                                waitsFor(function () {
                                    return promise.isFulfilled();
                                });
                                runs(function () {
                                    expect(viewModel.previousObjectiveId).toBe(previousObjectiveId);
                                });
                            });

                        });

                        describe('when previous objective does not exist in sorted by title objectives collection', function () {

                            it('should set previousObjectiveId to null', function () {
                                deferred.resolve([{ id: '0', title: 'z' }, { id: '5', title: 'Z' }, objective]);
                                var promise = viewModel.activate(objective.id, null);
                                waitsFor(function () {
                                    return promise.isFulfilled();
                                });
                                runs(function () {
                                    expect(viewModel.previousObjectiveId).toBeNull();
                                });
                            });

                        });

                        describe('when next objective exists in sorted by title objectives collection', function () {

                            it('should set nextObjectiveId', function () {
                                var nextObjectiveId = '2';
                                deferred.resolve([objective, { id: nextObjectiveId, title: 'z' }, { id: '5', title: 'Z' }]);
                                var promise = viewModel.activate(objective.id, null);
                                waitsFor(function () {
                                    return promise.isFulfilled();
                                });
                                runs(function () {
                                    expect(viewModel.nextObjectiveId).toBe(nextObjectiveId);
                                });
                            });

                        });

                        describe('when next objective does not exist in sorted by title objectives collection', function () {

                            it('should set nextObjectiveId to null', function () {
                                deferred.resolve([objective, { id: '0', title: 'a' }, { id: '5', title: 'B' }]);
                                var promise = viewModel.activate(objective.id, null);
                                waitsFor(function () {
                                    return promise.isFulfilled();
                                });
                                runs(function () {
                                    expect(viewModel.nextObjectiveId).toBeNull();
                                });
                            });

                        });
                    });
                });

                describe('when query params not null', function () {

                    describe('when query string doesnt have experienceId param', function () {
                        var objectives = 'objectives';
                        var queryParams = { experienceId: undefined };
                        beforeEach(function () {
                            spyOn(localizationManager, 'localize').andReturn(objectives);
                        });

                        it('should set contextExperienceTitle to null', function () {
                            viewModel.contextExperienceTitle = '';
                            var promise = viewModel.activate(objective.id, queryParams);
                            deferred.resolve(null);
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.contextExperienceTitle).toBeNull();
                            });
                        });

                        it('should set contextExperienceId to null', function () {
                            viewModel.isInExperienceContext = '';
                            var promise = viewModel.activate(objective.id, queryParams);
                            deferred.resolve(null);
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.contextExperienceTitle).toBeNull();
                            });
                        });

                        describe('when objective not found', function () {

                            beforeEach(function () {
                                deferred.resolve(null);
                            });

                            it('should navigate to #404', function () {
                                var promise = viewModel.activate(objective.id, queryParams);
                                waitsFor(function () {
                                    return promise.isFulfilled();
                                });
                                runs(function () {
                                    expect(router.replace).toHaveBeenCalledWith('404');
                                });
                            });

                            it('should resolve promise with undefined', function () {
                                var promise = viewModel.activate(objective.id, queryParams);
                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeResolvedWith(undefined);
                                });
                            });

                        });

                        describe('when single objective exists', function () {
                            beforeEach(function () {
                                deferred.resolve([objective]);
                            });

                            it('should return promise', function () {
                                expect(viewModel.activate('id')).toBePromise();
                            });

                            it('should set objective title', function () {
                                viewModel.title('');

                                var promise = viewModel.activate(objective.id, queryParams);

                                waitsFor(function () {
                                    return promise.isFulfilled();
                                });
                                runs(function () {
                                    expect(viewModel.title()).toBe(objective.title);
                                });
                            });

                            it('should set objective createdOn', function () {
                                viewModel.createdOn = null;
                                var promise = viewModel.activate(objective.id, queryParams);
                                waitsFor(function () {
                                    return promise.isFulfilled();
                                });
                                runs(function () {
                                    expect(viewModel.createdOn).toBe(objective.createdOn);
                                });
                            });

                            it('should set objective modifiedOn', function () {
                                viewModel.modifiedOn(null);
                                var promise = viewModel.activate(objective.id, queryParams);
                                waitsFor(function () {
                                    return promise.isFulfilled();
                                });
                                runs(function () {
                                    expect(viewModel.modifiedOn()).toBe(objective.modifiedOn);
                                });
                            });

                            it('should set current objective image', function () {
                                viewModel.image(null);
                                var promise = viewModel.activate(objective.id, queryParams);
                                waitsFor(function () {
                                    return promise.isFulfilled();
                                });
                                runs(function () {
                                    expect(viewModel.image()).toBe(objective.image);
                                });
                            });

                            it('should initialize questions collection', function () {
                                viewModel.questions([]);
                                var promise = viewModel.activate(objective.id, queryParams);
                                waitsFor(function () {
                                    return promise.isFulfilled();
                                });
                                runs(function () {
                                    expect(viewModel.questions().length).toBe(objective.questions.length);
                                });
                            });

                            describe('when currentSortingOption is asc', function () {

                                it('should sort questions asc', function () {
                                    viewModel.currentSortingOption(constants.sortingOptions.byTitleAsc);
                                    var promise = viewModel.activate(objective.id, queryParams);
                                    waitsFor(function () {
                                        return promise.isFulfilled();
                                    });
                                    runs(function () {
                                        expect(viewModel.questions).toBeSortedAsc('title');
                                    });
                                });

                            });

                            describe('when currentSortingOption is desc', function () {

                                it('should sort questions desc', function () {
                                    viewModel.currentSortingOption(constants.sortingOptions.byTitleDesc);
                                    var promise = viewModel.activate(objective.id, queryParams);
                                    waitsFor(function () {
                                        return promise.isFulfilled();
                                    });
                                    runs(function () {
                                        expect(viewModel.questions).toBeSortedDesc('title');
                                    });
                                });

                            });

                        });

                        describe('when few objectives exist', function () {

                            describe('when previous objective exists in sorted by title objectives collection', function () {

                                it('should set previousObjectiveId', function () {
                                    var previousObjectiveId = '0';
                                    deferred.resolve([{ id: previousObjectiveId, title: 'B' }, { id: '0', title: 'a' }, objective]);
                                    var promise = viewModel.activate(objective.id, queryParams);
                                    waitsFor(function () {
                                        return promise.isFulfilled();
                                    });
                                    runs(function () {
                                        expect(viewModel.previousObjectiveId).toBe(previousObjectiveId);
                                    });
                                });

                            });

                            describe('when previous objective does not exist in sorted by title objectives collection', function () {

                                it('should set previousObjectiveId to null', function () {
                                    deferred.resolve([{ id: '0', title: 'z' }, { id: '5', title: 'Z' }, objective]);
                                    var promise = viewModel.activate(objective.id, queryParams);
                                    waitsFor(function () {
                                        return promise.isFulfilled();
                                    });
                                    runs(function () {
                                        expect(viewModel.previousObjectiveId).toBeNull();
                                    });
                                });

                            });

                            describe('when next objective exists in sorted by title objectives collection', function () {

                                it('should set nextObjectiveId', function () {
                                    var nextObjectiveId = '2';
                                    deferred.resolve([objective, { id: nextObjectiveId, title: 'z' }, { id: '5', title: 'Z' }]);
                                    var promise = viewModel.activate(objective.id, queryParams);
                                    waitsFor(function () {
                                        return promise.isFulfilled();
                                    });
                                    runs(function () {
                                        expect(viewModel.nextObjectiveId).toBe(nextObjectiveId);
                                    });
                                });

                            });

                            describe('when next objective does not exist in sorted by title objectives collection', function () {

                                it('should set nextObjectiveId to null', function () {
                                    deferred.resolve([objective, { id: '0', title: 'a' }, { id: '5', title: 'B' }]);
                                    var promise = viewModel.activate(objective.id, queryParams);
                                    waitsFor(function () {
                                        return promise.isFulfilled();
                                    });
                                    runs(function () {
                                        expect(viewModel.nextObjectiveId).toBeNull();
                                    });
                                });

                            });
                        });
                    });

                    describe('when query string has experienceId param', function () {
                        var queryParams = { experienceId: 'id' };
                        var contextExperienceTitle = "exper";
                        describe('and when experience doesnt exist', function () {
                            beforeEach(function () {
                                getExperienceDeferred.resolve(null);
                            });

                            it('should navigate to 404', function () {
                                var promise = viewModel.activate(objective.id, queryParams);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(router.replace).toHaveBeenCalledWith('404');
                                });
                            });
                        });

                        describe('and when experience exists', function () {
                            it('should set contextExperienceTitle', function () {
                                viewModel.contextExperienceTitle = '';
                                var promise = viewModel.activate(objective.id, queryParams);
                                getExperienceDeferred.resolve({ title: contextExperienceTitle });
                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.contextExperienceTitle).toBe(contextExperienceTitle);
                                });
                            });

                            it('should set contextExperienceId', function () {
                                viewModel.contextExperienceId = '';
                                var promise = viewModel.activate(objective.id, queryParams);
                                getExperienceDeferred.resolve({ title: contextExperienceTitle });
                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.contextExperienceId).toBe(queryParams.experienceId);
                                });
                            });

                            describe('when objective not found', function () {

                                beforeEach(function () {
                                    getExperienceDeferred.resolve({ title: contextExperienceTitle, objectives: [] });
                                });

                                it('should navigate to #404', function () {
                                    var promise = viewModel.activate(objective.id, queryParams);
                                    waitsFor(function () {
                                        return promise.isFulfilled();
                                    });
                                    runs(function () {
                                        expect(router.replace).toHaveBeenCalledWith('404');
                                    });
                                });

                                it('should resolve promise with undefined', function () {
                                    var promise = viewModel.activate(objective.id, queryParams);
                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise).toBeResolvedWith(undefined);
                                    });
                                });

                            });

                            describe('when single objective exists', function () {
                                beforeEach(function () {
                                    getExperienceDeferred.resolve({ title: contextExperienceTitle, objectives: [objective] });
                                });

                                it('should return promise', function () {
                                    expect(viewModel.activate('id')).toBePromise();
                                });

                                it('should set objective title', function () {
                                    viewModel.title('');

                                    var promise = viewModel.activate(objective.id, queryParams);
                                    waitsFor(function () {
                                        return promise.isFulfilled();
                                    });
                                    runs(function () {
                                        expect(viewModel.title()).toBe(objective.title);
                                    });
                                });

                                it('should set objective createdOn', function () {
                                    viewModel.createdOn = null;

                                    var promise = viewModel.activate(objective.id, queryParams);
                                    waitsFor(function () {
                                        return promise.isFulfilled();
                                    });
                                    runs(function () {
                                        expect(viewModel.createdOn).toBe(objective.createdOn);
                                    });
                                });

                                it('should set objective modifiedOn', function () {
                                    viewModel.modifiedOn(null);

                                    var promise = viewModel.activate(objective.id, queryParams);
                                    waitsFor(function () {
                                        return promise.isFulfilled();
                                    });
                                    runs(function () {
                                        expect(viewModel.modifiedOn()).toBe(objective.modifiedOn);
                                    });
                                });

                                it('should set current objective image', function () {
                                    viewModel.image(null);

                                    var promise = viewModel.activate(objective.id, queryParams);
                                    waitsFor(function () {
                                        return promise.isFulfilled();
                                    });
                                    runs(function () {
                                        expect(viewModel.image()).toBe(objective.image);
                                    });
                                });

                                it('should initialize questions collection', function () {
                                    viewModel.questions([]);

                                    var promise = viewModel.activate(objective.id, queryParams);
                                    waitsFor(function () {
                                        return promise.isFulfilled();
                                    });
                                    runs(function () {
                                        expect(viewModel.questions().length).toBe(objective.questions.length);
                                    });
                                });

                                describe('when currentSortingOption is asc', function () {

                                    it('should sort questions asc', function () {
                                        viewModel.currentSortingOption(constants.sortingOptions.byTitleAsc);

                                        var promise = viewModel.activate(objective.id, queryParams);
                                        waitsFor(function () {
                                            return promise.isFulfilled();
                                        });
                                        runs(function () {
                                            expect(viewModel.questions).toBeSortedAsc('title');
                                        });
                                    });

                                });

                                describe('when currentSortingOption is desc', function () {

                                    it('should sort questions desc', function () {
                                        viewModel.currentSortingOption(constants.sortingOptions.byTitleDesc);

                                        var promise = viewModel.activate(objective.id, queryParams);
                                        waitsFor(function () {
                                            return promise.isFulfilled();
                                        });
                                        runs(function () {
                                            expect(viewModel.questions).toBeSortedDesc('title');
                                        });
                                    });

                                });

                            });

                            describe('when few objectives exist', function () {

                                describe('when previous objective exists in sorted by title objectives collection', function () {

                                    it('should set previousObjectiveId', function () {
                                        var previousObjectiveId = '0';
                                        var objectives = [{ id: previousObjectiveId, title: 'B' }, { id: '0', title: 'a' }, objective];
                                        getExperienceDeferred.resolve({ title: contextExperienceTitle, objectives: objectives });

                                        var promise = viewModel.activate(objective.id, queryParams);
                                        waitsFor(function () {
                                            return promise.isFulfilled();
                                        });
                                        runs(function () {
                                            expect(viewModel.previousObjectiveId).toBe(previousObjectiveId);
                                        });
                                    });

                                });

                                describe('when previous objective does not exist in sorted by title objectives collection', function () {

                                    it('should set previousObjectiveId to null', function () {
                                        var objectives = [{ id: '0', title: 'z' }, { id: '5', title: 'Z' }, objective];
                                        getExperienceDeferred.resolve({ title: contextExperienceTitle, objectives: objectives });
                                        var promise = viewModel.activate(objective.id, queryParams);
                                        waitsFor(function () {
                                            return promise.isFulfilled();
                                        });
                                        runs(function () {
                                            expect(viewModel.previousObjectiveId).toBeNull();
                                        });
                                    });

                                });

                                describe('when next objective exists in sorted by title objectives collection', function () {

                                    it('should set nextObjectiveId', function () {
                                        var nextObjectiveId = '2';
                                        var objectives = [objective, { id: nextObjectiveId, title: 'z' }, { id: '5', title: 'Z' }];
                                        getExperienceDeferred.resolve({ title: contextExperienceTitle, objectives: objectives });
                                        var promise = viewModel.activate(objective.id, queryParams);
                                        waitsFor(function () {
                                            return promise.isFulfilled();
                                        });
                                        runs(function () {
                                            expect(viewModel.nextObjectiveId).toBe(nextObjectiveId);
                                        });
                                    });

                                });

                                describe('when next objective does not exist in sorted by title objectives collection', function () {

                                    it('should set nextObjectiveId to null', function () {
                                        var objectives = [objective, { id: '0', title: 'a' }, { id: '5', title: 'B' }];
                                        getExperienceDeferred.resolve({ title: contextExperienceTitle, objectives: objectives });
                                        var promise = viewModel.activate(objective.id, queryParams);
                                        waitsFor(function () {
                                            return promise.isFulfilled();
                                        });
                                        runs(function () {
                                            expect(viewModel.nextObjectiveId).toBeNull();
                                        });
                                    });

                                });
                            });
                        });
                    });
                });
            });

            describe('title:', function () {

                it('should be observable', function () {
                    expect(viewModel.title).toBeObservable();
                });

                describe('isEditing:', function () {

                    it('should be observable', function () {
                        expect(viewModel.title.isEditing).toBeObservable();
                    });

                });

                describe('isValid:', function () {

                    it('should be computed', function () {
                        expect(viewModel.title.isValid).toBeComputed();
                    });

                    describe('when title is empty', function () {

                        it('should be false', function () {
                            viewModel.title('');
                            expect(viewModel.title.isValid()).toBeFalsy();
                        });

                    });

                    describe('when title is longer than 255', function () {

                        it('should be false', function () {
                            viewModel.title(utils.createString(viewModel.titleMaxLength + 1));
                            expect(viewModel.title.isValid()).toBeFalsy();
                        });

                    });

                    describe('when title is longer than 255 but after trimming is not longer than 255', function () {

                        it('should be true', function () {
                            viewModel.title('   ' + utils.createString(viewModel.titleMaxLength - 1) + '   ');
                            expect(viewModel.title.isValid()).toBeTruthy();
                        });

                    });

                    describe('when title is not empty and not longer than 255', function () {

                        it('should be true', function () {
                            viewModel.title(utils.createString(viewModel.titleMaxLength - 1));
                            expect(viewModel.title.isValid()).toBeTruthy();
                        });

                    });
                });
            });

            describe('contextExperienceTitle:', function () {
                it('should be defined', function () {
                    expect(viewModel.contextExperienceTitle).toBeDefined();
                });
            });

            describe('contextExperienceId:', function () {
                it('should be defined', function () {
                    expect(viewModel.contextExperienceId).toBeDefined();
                });
            });

            describe('language:', function () {

                it('should be defined', function () {
                    expect(viewModel.language).toBeDefined();
                });

                it('should be observable', function () {
                    expect(viewModel.language).toBeObservable();
                });

            });

            describe('modifiedOn:', function () {
                it('should be observable', function () {
                    expect(viewModel.modifiedOn).toBeObservable();
                });
            });

            describe('titleMaxLength:', function () {

                it('should be defined', function () {
                    expect(viewModel.titleMaxLength).toBeDefined();
                });

                it('should be 255', function () {
                    expect(viewModel.titleMaxLength).toBe(255);
                });

            });

            describe('startEditTitle:', function () {

                it('should be function', function () {
                    expect(viewModel.startEditTitle).toBeFunction();
                });

                it('should set title.isEditing to true', function () {
                    viewModel.title.isEditing(false);
                    viewModel.startEditTitle();
                    expect(viewModel.title.isEditing()).toBeTruthy();
                });

            });

            describe('endEditTitle:', function () {

                var updateDeferred, getByIdDeferred;

                beforeEach(function () {
                    updateDeferred = Q.defer();
                    getByIdDeferred = Q.defer();

                    spyOn(repository, 'updateObjective').andReturn(updateDeferred.promise);
                    spyOn(repository, 'getById').andReturn(getByIdDeferred.promise);

                    spyOn(notify, 'info');
                });

                it('should be function', function () {
                    expect(viewModel.endEditTitle).toBeFunction();
                });

                it('should set title.isEditing to false', function () {
                    viewModel.title.isEditing(true);
                    viewModel.endEditTitle();
                    expect(viewModel.title.isEditing()).toBeFalsy();
                });

                it('should trim title', function () {
                    viewModel.title('    Some title     ');
                    viewModel.endEditTitle();
                    expect(viewModel.title()).toEqual('Some title');
                });

                describe('when title is not modified', function () {
                    var promise = null;
                    beforeEach(function () {
                        viewModel.title(objective.title);
                        promise = getByIdDeferred.promise.finally(function () { });
                        getByIdDeferred.resolve(objective);
                    });

                    it('should not send event', function () {
                        viewModel.endEditTitle();
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolved();
                            expect(eventTracker.publish).not.toHaveBeenCalled();
                        });
                    });

                    it('should not show notification', function () {
                        viewModel.endEditTitle();
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolved();
                            expect(notify.info).not.toHaveBeenCalled();
                        });
                    });

                    it('should not update question in repository', function () {
                        viewModel.endEditTitle();
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolved();
                            expect(repository.updateObjective).not.toHaveBeenCalled();
                        });
                    });
                });

                describe('when title is modified', function () {

                    var getPromise = null, newTitle = objective.title + 'test';
                    beforeEach(function () {

                        viewModel.title(newTitle);
                        getPromise = getByIdDeferred.promise.finally(function () { });
                        getByIdDeferred.resolve(objective);
                    });

                    it('should send event \'Update objective title\'', function () {
                        viewModel.endEditTitle();
                        waitsFor(function () {
                            return !getPromise.isPending();
                        });
                        runs(function () {
                            expect(getPromise).toBeResolved();
                            expect(eventTracker.publish).toHaveBeenCalledWith('Update objective title');
                        });
                    });

                    describe('and when title is valid', function () {

                        it('should update objective in repository', function () {
                            viewModel.endEditTitle();
                            waitsFor(function () {
                                return !getPromise.isPending();
                            });
                            runs(function () {
                                expect(getPromise).toBeResolved();
                                expect(repository.updateObjective).toHaveBeenCalled();
                                expect(repository.updateObjective.mostRecentCall.args[0].title).toEqual(newTitle);
                            });
                        });

                        describe('and when objective updated successfully', function () {

                            it('should update notificaion', function () {
                                viewModel.endEditTitle();

                                var promise = updateDeferred.promise.finally(function () { });
                                updateDeferred.resolve(new Date());

                                waitsFor(function () {
                                    return !getPromise.isPending() && !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeResolved();
                                    expect(notify.info).toHaveBeenCalled();
                                });
                            });

                            it('should update modifiedOn', function () {
                                viewModel.endEditTitle();

                                var modificationDate = new Date();

                                var promise = updateDeferred.promise.finally(function () { });
                                updateDeferred.resolve(modificationDate);

                                waitsFor(function () {
                                    return !getPromise.isPending() && !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeResolved();
                                    expect(viewModel.modifiedOn()).toEqual(modificationDate);
                                });
                            });
                        });

                    });

                    describe('and when title is not valid', function () {

                        it('should revert objective title value', function () {
                            viewModel.title('');
                            viewModel.endEditTitle();

                            waitsFor(function () {
                                return !getPromise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.title()).toBe(objective.title);
                            });
                        });

                    });
                });
            });

            describe('navigateBack', function () {

                describe('when contextExperienceId is not string', function () {

                    beforeEach(function () {
                        viewModel.contextExperienceId = null;
                    });

                    it('should navigate to #objectives', function () {
                        viewModel.navigateBack();
                        expect(router.navigate).toHaveBeenCalledWith('objectives');
                    });

                    it('should send event \"Navigate to Learning Objectives\"', function () {
                        viewModel.navigateBack();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to Learning Objectives');
                    });

                });

                describe('when contextExperienceId is string', function () {

                    var contextExperienceId = 'id';
                    beforeEach(function () {
                        viewModel.contextExperienceId = contextExperienceId;
                    });

                    it('should navigate to experience/{id}', function () {
                        viewModel.navigateBack();
                        expect(router.navigate).toHaveBeenCalledWith('experience/' + contextExperienceId);
                    });
                    it('should send event \'Navigate to experience\'', function () {
                        viewModel.navigateBack();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to experience');
                    });

                });

            });

            describe('navigateToEditQuestion', function () {

                describe('when question is null', function () {

                    it('should throw exception', function () {
                        var f = function () { viewModel.navigateToEditQuestion(null); };
                        expect(f).toThrow();
                    });

                });

                describe('when question is undefined', function () {

                    it('should throw exception', function () {
                        var f = function () { viewModel.navigateToEditQuestion(); };
                        expect(f).toThrow();
                    });

                });

                describe('when question does not have property id', function () {

                    it('should throw exception', function () {
                        var f = function () { viewModel.navigateToEditQuestion({}); };
                        expect(f).toThrow();
                    });

                });

                describe('when question id is null', function () {

                    it('should throw exception', function () {
                        var f = function () { viewModel.navigateToEditQuestion({ id: null }); };
                        expect(f).toThrow();
                    });

                });

                it('should navigate to #objectives', function () {

                    viewModel.objectiveId = objective.id;

                    viewModel.navigateToEditQuestion(objective.questions[0]);

                    expect(router.navigateWithQueryString).toHaveBeenCalledWith('objective/' + objective.id + '/question/' + objective.questions[0].id);
                });

                it('should send event \"Navigate to edit question\"', function () {
                    viewModel.objectiveId = objective.id;

                    viewModel.navigateToEditQuestion(objective.questions[0]);

                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to edit question');
                });

            });

            describe('navigateToNextObjective:', function () {
                var nextObjectiveId = 1;

                it('should be a function', function () {
                    expect(viewModel.navigateToNextObjective).toBeFunction();
                });

                it('should send event \'Navigate to next objective\'', function () {
                    viewModel.navigateToNextObjective();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to next objective');
                });

                describe('when nextObjectiveId is undefined', function () {

                    it('should navigate to #404', function () {
                        viewModel.nextObjectiveId = undefined;
                        viewModel.navigateToNextObjective();
                        expect(router.replace).toHaveBeenCalledWith('404');
                    });

                });

                describe('when nextObjectiveId is null', function () {

                    it('should navigate to #404', function () {
                        viewModel.nextObjectiveId = null;
                        viewModel.navigateToNextObjective();
                        expect(router.replace).toHaveBeenCalledWith('404');
                    });

                });

                describe('when nextObjectiveId is not null or undefined', function () {

                    it('should navigate to #objective/{nextObjectiveId}', function () {
                        viewModel.nextObjectiveId = nextObjectiveId;
                        viewModel.navigateToNextObjective();
                        expect(router.navigateWithQueryString).toHaveBeenCalledWith('objective/' + nextObjectiveId);
                    });

                });
            });

            describe('navigateToCreateQuestion:', function () {

                it('should be a function', function () {
                    expect(viewModel.navigateToCreateQuestion).toBeFunction();
                });

                it('should send event \'Navigate to create question\'', function () {
                    viewModel.navigateToCreateQuestion();

                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to create question');
                });

                it('should navigate to #objective/{objectiveId}/question/create', function () {
                    viewModel.objectiveId = '0';

                    viewModel.navigateToCreateQuestion();

                    expect(router.navigateWithQueryString).toHaveBeenCalledWith('objective/' + viewModel.objectiveId + '/question/create');
                });

            });

            describe('navigateToPreviousObjective:', function () {
                var previousObjectiveId = 0;

                it('should be a function', function () {
                    expect(viewModel.navigateToPreviousObjective).toBeFunction();
                });

                it('should send event \'Navigate to previous objective\'', function () {
                    viewModel.navigateToPreviousObjective();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to previous objective');
                });

                describe('when previousObjectiveId is null', function () {

                    it('should navigate to #404', function () {
                        viewModel.previousObjectiveId = null;
                        viewModel.navigateToPreviousObjective();
                        expect(router.replace).toHaveBeenCalledWith('404');
                    });

                });

                describe('when previousObjectiveId is undefined', function () {

                    it('should navigate to #404', function () {
                        viewModel.previousExperienceId = undefined;
                        viewModel.navigateToPreviousObjective();
                        expect(router.replace).toHaveBeenCalledWith('404');
                    });

                });

                describe('when previousObjectiveId is not null', function () {

                    it('should navigate to #experience/{previousObjectiveId}', function () {
                        viewModel.previousObjectiveId = previousObjectiveId;
                        viewModel.navigateToPreviousObjective();
                        expect(router.navigateWithQueryString).toHaveBeenCalledWith('objective/' + previousObjectiveId);
                    });

                });

            });

            describe('sortByTitleAsc', function () {

                it('should send event \"Sort questions by title ascending\"', function () {
                    viewModel.sortByTitleAsc();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Sort questions by title ascending');
                });

                it('should change sorting option to constants.sortingOptions.byTitleAcs', function () {
                    viewModel.sortByTitleAsc();
                    expect(viewModel.currentSortingOption()).toBe(constants.sortingOptions.byTitleAsc);
                });

                it('should sort questions', function () {
                    viewModel.questions(ko.observableArray(objective.questions));
                    viewModel.sortByTitleAsc();
                    expect(viewModel.questions()).toBeSortedAsc('title');
                });

            });

            describe('sortByTitleDesc', function () {

                it('should send event \"Sort questions by title descending\"', function () {
                    viewModel.sortByTitleDesc();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Sort questions by title descending');
                });

                it('should change sorting option to constants.sortingOptions.byTitleDecs', function () {
                    viewModel.sortByTitleDesc();
                    expect(viewModel.currentSortingOption()).toBe(constants.sortingOptions.byTitleDesc);
                });

                it('should sort questions', function () {
                    viewModel.questions(ko.observableArray([objective.questions]));
                    viewModel.sortByTitleDesc();
                    expect(viewModel.questions()).toBeSortedDesc('title');
                });

            });

            describe('deleteSelectedQuestions', function () {


                it('should be a function', function () {
                    expect(viewModel.deleteSelectedQuestions).toBeFunction();
                });

                it('should send event \'Delete question\'', function () {
                    viewModel.questions([{ isSelected: ko.observable(true) }]);
                    viewModel.deleteSelectedQuestions();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Delete question');
                });

                describe('when no selected questions', function () {

                    it('should throw exception', function () {
                        viewModel.questions([]);
                        var f = function () { viewModel.deleteSelectedQuestions(); };
                        expect(f).toThrow();
                    });

                });

                describe('when there are selected questions', function () {

                    var removeQuestion;

                    beforeEach(function () {
                        removeQuestion = Q.defer();

                        spyOn(questionRepository, 'removeQuestion').andReturn(removeQuestion.promise);
                        spyOn(notify, 'info');
                    });


                    it('should delete selected question', function () {
                        var objectiveId = 'objectiveId';
                        var questionId = 'questionId';

                        viewModel.objectiveId = objectiveId;
                        viewModel.questions([{ id: questionId, isSelected: ko.observable(true) }]);

                        viewModel.deleteSelectedQuestions();

                        expect(questionRepository.removeQuestion).toHaveBeenCalledWith(objectiveId, questionId);
                    });


                    describe('and when question deleted successfully', function () {

                        it('should delete selected question from viewModel', function () {
                            viewModel.questions([{ id: '0', isSelected: ko.observable(true) }]);
                            var promise = removeQuestion.promise.finally(function () { });
                            removeQuestion.resolve();

                            viewModel.deleteSelectedQuestions();

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.questions().length).toBe(0);
                            });
                        });

                        it('should update notificaion', function () {
                            viewModel.questions([{ id: '0', isSelected: ko.observable(true) }]);

                            var promise = removeQuestion.promise.finally(function () { });
                            removeQuestion.resolve();

                            viewModel.deleteSelectedQuestions();

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(notify.info).toHaveBeenCalled();
                            });
                        });

                        it('should update modifiedOn', function () {
                            viewModel.modifiedOn(new Date(1));
                            viewModel.questions([{ id: '0', isSelected: ko.observable(true) }]);

                            var promise = removeQuestion.promise.finally(function () { });
                            var modificationDate = new Date();
                            removeQuestion.resolve(modificationDate);

                            viewModel.deleteSelectedQuestions();


                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.modifiedOn()).toEqual(modificationDate);
                            });
                        });
                    });
                });

            });

            describe('canDeleteQuestions:', function () {

                it('should be observable', function () {
                    expect(viewModel.canDeleteQuestions).toBeObservable();
                });

                describe('when no question selected', function () {

                    it('should be false', function () {
                        viewModel.questions([]);
                        expect(viewModel.canDeleteQuestions()).toBe(false);
                    });

                });

                describe('when question is selected', function () {

                    it('should be true', function () {
                        viewModel.questions([
                            { isSelected: ko.observable(true) }
                        ]);

                        expect(viewModel.canDeleteQuestions()).toBe(true);
                    });

                });

                describe('when few questions are selected', function () {

                    it('should befalse', function () {
                        viewModel.questions([
                            { isSelected: ko.observable(true) },
                            { isSelected: ko.observable(true) }
                        ]);

                        expect(viewModel.canDeleteQuestions()).toBe(false);
                    });

                });
            });

            describe('toggleQuestionSelection', function () {

                it('should be a function', function () {
                    expect(viewModel.toggleQuestionSelection).toBeFunction();
                });

                describe('when question is null', function () {

                    it('should throw exception', function () {
                        var f = function () { viewModel.toggleQuestionSelection(null); };
                        expect(f).toThrow();
                    });

                });

                describe('when question is undefined', function () {

                    it('should throw exception', function () {
                        var f = function () { viewModel.toggleQuestionSelection(); };
                        expect(f).toThrow();
                    });

                });

                describe('when question does not have isSelected() observable', function () {

                    it('should throw exception', function () {
                        var f = function () { viewModel.toggleQuestionSelection({}); };
                        expect(f).toThrow();
                    });

                });

                describe('when question is not selected', function () {

                    it('should send event \'Select question\'', function () {
                        viewModel.toggleQuestionSelection({ isSelected: ko.observable(false) });
                        expect(eventTracker.publish).toHaveBeenCalledWith('Select question');
                    });

                    it('should set question.isSelected to true', function () {
                        var question = { isSelected: ko.observable(false) };
                        viewModel.toggleQuestionSelection(question);
                        expect(question.isSelected()).toBeTruthy();
                    });

                });

                describe('when question is selected', function () {

                    it('should send event \'Unselect question\'', function () {
                        viewModel.toggleQuestionSelection({ isSelected: ko.observable(true) });
                        expect(eventTracker.publish).toHaveBeenCalledWith('Unselect question');
                    });

                    it('should set question.isSelected to false', function () {
                        var question = { isSelected: ko.observable(true) };
                        viewModel.toggleQuestionSelection(question);
                        expect(question.isSelected()).toBeFalsy();
                    });

                });
            });

            describe('questions', function () {

                it('should be observable', function () {
                    expect(viewModel.questions).toBeObservable();
                });

            });
        });
    }
);