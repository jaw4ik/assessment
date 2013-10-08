define(['viewmodels/objectives/createObjective'],
    function (viewModel) {
        "use strict";

        var router = require('plugins/router'),
            notify = require('notify'),
            experienceRepository = require('repositories/experienceRepository'),
            eventTracker = require('eventTracker');

        describe('viewModel [createObjective]', function () {

            var repository = require('repositories/objectiveRepository');

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigate');
                spyOn(router, 'navigateWithQueryString');
                spyOn(router, 'replace');
            });

            it('should be object', function () {
                expect(viewModel).toBeObject();
            });

            describe('title:', function () {

                it('should be observable', function () {
                    expect(viewModel.title).toBeObservable();
                });

                it('should have isValid computed', function () {
                    expect(viewModel.title.isValid).toBeComputed();
                });

                describe('when longer than 255 symbols', function () {

                    it('should be not valid', function () {
                        viewModel.title(new Array(257).join('a'));
                        expect(viewModel.title.isValid()).toBeFalsy();
                    });

                });

                describe('when longer than 255 but after trimming - not longer than 255', function () {

                    it('should be true', function () {
                        viewModel.title('   ' + utils.createString(viewModel.objectiveTitleMaxLength - 1) + '   ');
                        expect(viewModel.title.isValid()).toBeTruthy();
                    });

                });

                describe('when empty', function () {

                    it('should be not valid', function () {
                        viewModel.title('');
                        expect(viewModel.title.isValid()).toBeFalsy();
                    });

                });

            });

            describe('objectiveTitleMaxLength:', function () {

                it('should be defined', function () {
                    expect(viewModel.objectiveTitleMaxLength).toBeDefined();
                });

                it('should be 255', function () {
                    expect(viewModel.objectiveTitleMaxLength).toBe(255);
                });

            });

            describe('createAndNew:', function () {

                var addObjective, relateObjectiveDefer, getObjectiveDefer;;

                beforeEach(function () {
                    addObjective = Q.defer();
                    relateObjectiveDefer = Q.defer();
                    getObjectiveDefer = Q.defer();
                    spyOn(repository, 'addObjective').andReturn(addObjective.promise);
                    spyOn(repository, 'getById').andReturn(getObjectiveDefer.promise);
                    spyOn(experienceRepository, 'relateObjectives').andReturn(relateObjectiveDefer.promise);
                });

                it('should be function', function () {
                    expect(viewModel.createAndNew).toBeFunction();
                });

                it('should trim title', function () {
                    viewModel.title('   abc   ');
                    viewModel.createAndNew();
                    expect(viewModel.title()).toEqual('abc');
                    addObjective.resolve();
                });

                it('should send event \'Create learning objective and create new\'', function () {
                    viewModel.createAndNew();

                    expect(eventTracker.publish).toHaveBeenCalledWith('Create learning objective and create new');
                });

                describe('when title is valid', function () {

                    var id = '0';
                    var objective = { id: id, createdOn: new Date() };

                    beforeEach(function () {
                        viewModel.title('Some valid text');
                        spyOn(notify, 'info');
                    });

                    it('should create new objective in repository', function () {
                        var title = viewModel.title();

                        viewModel.createAndNew();

                        var promise = addObjective.promise.fin(function () {
                        });
                        addObjective.resolve();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(repository.addObjective).toHaveBeenCalledWith({
                                title: title
                            });
                        });
                    });

                    it('should lock content', function () {
                        spyOn(notify, 'lockContent');
                        viewModel.createAndNew();
                        expect(notify.lockContent).toHaveBeenCalled();
                    });

                    describe('when objective created', function () {

                        beforeEach(function () {
                            addObjective.resolve(objective);
                        });

                        it('should unlock content', function () {
                            spyOn(notify, "unlockContent");
                            viewModel.createAndNew();

                            var promise = addObjective.promise.fin(function () { });
                            addObjective.resolve();

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(notify.unlockContent).toHaveBeenCalled();
                            });
                        });

                        describe('and when contextExperiencId is not string', function () {

                            beforeEach(function () {
                                viewModel.contextExperienceId = null;
                            });

                            it('should clear title', function () {
                                viewModel.createAndNew();

                                var promise = addObjective.promise.fin(function () { });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.title().length).toEqual(0);
                                });
                            });

                            it('should show notification', function () {
                                viewModel.createAndNew();

                                var promise = addObjective.promise.finally(function () { });
                                getObjectiveDefer.resolve(objective);
                                relateObjectiveDefer.resolve();

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(notify.info).toHaveBeenCalled();
                                });
                            });
                        });

                        describe('and when contextExperienceId is string', function () {

                            beforeEach(function () {
                                viewModel.contextExperienceId = 'id';
                                getObjectiveDefer.resolve(objective);
                                relateObjectiveDefer.resolve();
                            });

                            it('should relate created objective to experience', function () {
                                viewModel.createAndNew();

                                var promise = addObjective.promise.fin(function () { });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(experienceRepository.relateObjectives).toHaveBeenCalledWith(viewModel.contextExperienceId, [objective]);
                                });
                            });

                            it('should clear title', function () {
                                viewModel.createAndNew();

                                var promise = addObjective.promise.fin(function () { });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.title().length).toEqual(0);
                                });
                            });

                            it('should show notification', function () {
                                viewModel.createAndNew();

                                var promise = addObjective.promise.finally(function () { });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(notify.info).toHaveBeenCalled();
                                });
                            });
                        });
                    });
                });

            });

            describe('createAndEdit:', function () {

                var addObjective, relateObjectiveDefer, getObjectiveDefer;

                beforeEach(function () {
                    addObjective = Q.defer();
                    relateObjectiveDefer = Q.defer();
                    getObjectiveDefer = Q.defer();
                    spyOn(repository, 'addObjective').andReturn(addObjective.promise);
                    spyOn(repository, 'getById').andReturn(getObjectiveDefer.promise);
                    spyOn(experienceRepository, 'relateObjectives').andReturn(relateObjectiveDefer.promise);
                });

                it('should be function', function () {
                    expect(viewModel.createAndEdit).toBeFunction();
                });

                it('should send event \'Create learning objective and open it properties\'', function () {
                    viewModel.createAndEdit();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Create learning objective and open it properties');
                });

                it('should trim title', function () {
                    viewModel.title('   abc   ');
                    viewModel.createAndEdit();
                    expect(viewModel.title()).toEqual('abc');
                    addObjective.resolve();
                });

                describe('when title is valid', function () {
                    
                    beforeEach(function () {
                        viewModel.title('Some valid text');
                    });

                    it('should create new objective in repository', function () {
                        var title = viewModel.title();

                        viewModel.createAndEdit();

                        var promise = addObjective.promise.fin(function () {
                        });
                        addObjective.resolve();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(repository.addObjective).toHaveBeenCalledWith({
                                title: title
                            });
                        });
                    });

                    it('should lock content', function () {
                        spyOn(notify, 'lockContent');
                        viewModel.createAndEdit();
                        expect(notify.lockContent).toHaveBeenCalled();
                    });

                    describe('and objective created', function () {
                        var id = '0';
                        var objective = { id: id };

                        beforeEach(function () {
                            addObjective.resolve(objective);
                        });

                        it('should unlock content', function () {
                            spyOn(notify, "unlockContent");
                            viewModel.createAndEdit();

                            var promise = addObjective.promise.fin(function () { });
                            addObjective.resolve();

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(notify.unlockContent).toHaveBeenCalled();
                            });
                        });

                        describe('and when contextExperiencId is not string', function () {

                            beforeEach(function () {
                                viewModel.contextExperienceId = null;
                            });

                            it('should navigate to created objective', function () {
                                viewModel.createAndEdit();

                                var promise = addObjective.promise.fin(function () { });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(router.navigate).toHaveBeenCalledWith('objective/' + id);
                                });
                            });
                        });

                        describe('and when contextExperiencId is string', function () {

                            beforeEach(function () {
                                viewModel.contextExperienceId = 'id';
                                getObjectiveDefer.resolve(objective);
                                relateObjectiveDefer.resolve();
                            });

                            it('should relate created objective to experience', function () {
                                viewModel.createAndEdit();

                                var promise = addObjective.promise.fin(function () { });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(experienceRepository.relateObjectives).toHaveBeenCalledWith(viewModel.contextExperienceId, [objective]);
                                });
                            });

                            it('should navigate to created objective', function () {
                                viewModel.createAndEdit();

                                var promise = addObjective.promise.fin(function () {
                                });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(router.navigateWithQueryString).toHaveBeenCalledWith('objective/' + id);
                                });
                            });
                        });

                    });
                });
            });

            describe('navigateBack:', function () {

                describe('when contextExperinceId is not string', function () {

                    beforeEach(function () {
                        viewModel.contextExperienceId = null;
                    });

                    it('should send event \'Navigate to objectives\'', function () {
                        viewModel.navigateBack();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to objectives');
                    });

                    it('should navigate to #objectives', function () {
                        viewModel.navigateBack();
                        expect(router.navigate).toHaveBeenCalledWith('objectives');
                    });

                });

                describe('when contextExperinceId is string', function () {

                    beforeEach(function () {
                        viewModel.contextExperienceId = 'id';
                    });

                    it('should send event \'Navigate to experience\'', function () {
                        viewModel.navigateBack();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to experience');
                    });

                    it('should navigate to #experience/id', function () {
                        viewModel.navigateBack();
                        expect(router.navigate).toHaveBeenCalledWith('experience/' + viewModel.contextExperienceId);
                    });

                });

            });

            describe('activate:', function () {

                var getExperienceDeferred;
                beforeEach(function () {
                    getExperienceDeferred = Q.defer();
                    spyOn(experienceRepository, 'getById').andReturn(getExperienceDeferred.promise);
                });

                it('should be function', function () {
                    expect(viewModel.activate).toBeFunction();
                });

                it('should return promise', function () {
                    var result = viewModel.activate();
                    expect(result).toBePromise();
                });

                it('should clear title', function () {
                    viewModel.title('Some text');

                    var promise = viewModel.activate();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.title().length).toEqual(0);
                    });
                });

                describe('when query params not null', function () {

                    describe('when experienceId is string', function () {

                        var queryParams = { experienceId: 'id' };

                        describe('when experience not found', function () {

                            beforeEach(function () {
                                getExperienceDeferred.resolve(null);
                            });

                            it('should replace url to 404', function () {
                                var promise = viewModel.activate(queryParams);
                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(router.replace).toHaveBeenCalledWith('404');
                                });
                            });

                            it('should set contextExperienceId to null', function () {
                                var promise = viewModel.activate(queryParams);
                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.contextExperienceId).toBeNull();
                                });
                            });

                            it('should set contextExperienceTitle to null', function () {
                                var promise = viewModel.activate(queryParams);
                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.contextExperienceTitle).toBeNull();
                                });
                            });

                            it('should resolve promise with undefined', function () {
                                var promise = viewModel.activate(queryParams);
                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeResolvedWith(undefined);
                                });
                            });

                        });

                        describe('when experience found', function () {
                            var experience = { id: 'id', title: 'title' };
                            beforeEach(function () {
                                getExperienceDeferred.resolve(experience);
                            });

                            it('should set contextExpperienceId', function () {
                                var promise = viewModel.activate(queryParams);
                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.contextExperienceId).toBe(experience.id);
                                });
                            });

                            it('should set contextExpperienceTitle', function () {
                                var promise = viewModel.activate(queryParams);
                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.contextExperienceTitle).toBe(experience.title);
                                });
                            });
                        });
                    });

                    describe('when experienceId is not string', function () {
                        var queryParams = { experienceId: null };

                        it('should set contextExpperienceId to null', function () {
                            var promise = viewModel.activate(queryParams);
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.contextExperienceId).toBeNull();
                            });
                        });

                        it('should set contextExpperienceTitle to null', function () {
                            var promise = viewModel.activate(queryParams);
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.contextExperienceTitle).toBeNull();
                            });
                        });
                    });
                });

            });

            describe('isTitleEditing:', function () {

                it('should be observable', function () {
                    expect(viewModel.isTitleEditing).toBeObservable();
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

        });
    }
);