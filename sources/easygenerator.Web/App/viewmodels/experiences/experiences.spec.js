define(['viewmodels/experiences/experiences', 'models/experience'],
    function (viewModel, ExperienceModel) {
        "use strict";

        var
            app = require('durandal/app'),
            router = require('plugins/router'),
            eventTracker = require('eventTracker'),
            dataContext = require('dataContext'),
            experienceModel = require('models/experience'),
            constants = require('constants'),
            localizationManage = require('localization/localizationManager'),
            notify = require('notify');

        var
            template = { id: '0', name: 'name', image: 'img' },
            experiences = [
                new experienceModel({
                    id: 'testId3',
                    title: 'Test Experience 3',
                    objectives: [],
                    template: template
                }),
                new experienceModel({
                    id: 'testId2',
                    title: 'Test Experience 2',
                    objectives: [],
                    template: template
                }),
                new experienceModel({
                    id: 'testId1',
                    title: 'Test Experience 1',
                    objectives: [],
                    template: template
                })
            ];

        describe('viewModel [experiences]', function () {

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigate');
                spyOn(router, 'replace');
            });

            it('should be object', function () {
                expect(viewModel).toBeObject();
            });

            describe('experiences:', function () {

                it('should be observable', function () {
                    expect(viewModel.experiences).toBeObservable();
                });

            });

            describe('states:', function () {

                it('should be defined', function () {
                    expect(viewModel.states).toBeDefined();
                });

            });

            describe('currentLanguage', function () {

                it('should be defined', function () {
                    expect(viewModel.currentLanguage).toBeDefined();
                });

            });

            describe('activate:', function () {

                it('should be a function', function () {
                    expect(viewModel.activate).toBeFunction();
                });

                it('should take data from dataContext', function () {
                    dataContext.experiences = experiences;
                    viewModel.activate();
                    expect(viewModel.experiences().length).toEqual(3);
                });

                it('should set current language', function () {
                    viewModel.currentLanguage = null;
                    viewModel.activate();
                    expect(viewModel.currentLanguage).toBe(localizationManage.currentLanguage);
                });

                describe('when previous showStatus is not set', function () {

                    var dataExperience;

                    beforeEach(function () {
                        dataContext.experiences = [];
                        viewModel.activate();
                        viewModel.deactivate();

                        dataContext.experiences = experiences;
                        dataExperience = dataContext.experiences[0];
                    });

                    describe('and deliveringState is \"Not started\"', function () {

                        beforeEach(function () {
                            dataExperience.deliveringState = constants.deliveringStates.notStarted;
                        });

                        it('should set current showStatus to \"false\"', function () {
                            viewModel.activate();
                            var viewExperience = _.find(viewModel.experiences(), function (item) { return item.id == dataExperience.id; });
                            expect(viewExperience.showStatus()).toBe(false);
                        });

                    });

                    describe('and deliveringState is \"building\"', function () {

                        beforeEach(function () {
                            dataExperience.deliveringState = constants.deliveringStates.building;
                        });

                        it('should set current showStatus to \"true\"', function () {
                            viewModel.activate();
                            var viewExperience = _.find(viewModel.experiences(), function (item) { return item.id == dataExperience.id; });
                            expect(viewExperience.showStatus()).toBe(true);
                        });

                    });

                    describe('and deliveringState is \"Failed\"', function () {

                        beforeEach(function () {
                            dataExperience.deliveringState = constants.deliveringStates.failed;
                        });

                        it('should set current showStatus to \"true\"', function () {
                            viewModel.activate();
                            var viewExperience = _.find(viewModel.experiences(), function (item) { return item.id == dataExperience.id; });
                            expect(viewExperience.showStatus()).toBe(true);
                        });

                    });

                    describe('and deliveringState is \"Succeed\"', function () {

                        beforeEach(function () {
                            dataExperience.deliveringState = constants.deliveringStates.succeed;
                        });

                        it('should set current showStatus to \"true\"', function () {
                            viewModel.activate();
                            var viewExperience = _.find(viewModel.experiences(), function (item) { return item.id == dataExperience.id; });
                            expect(viewExperience.showStatus()).toBe(true);
                        });

                    });

                });

                describe('when previous showStatus is \"false\"', function () {
                    var dataExperience,
                        viewExperience;

                    beforeEach(function () {
                        dataContext.experiences = experiences;
                        dataExperience = dataContext.experiences[0];
                        viewModel.activate();

                        viewExperience = _.find(viewModel.experiences(), function (item) { return item.id == dataExperience.id; });
                        viewExperience.showStatus(false);
                    });

                    describe('and previous deliveringState is \"Not started\"', function () {

                        beforeEach(function () {
                            viewExperience.deliveringState(constants.deliveringStates.notStarted);
                            viewModel.deactivate();
                        });

                        describe('and deliveringState is not changed', function () {

                            beforeEach(function () {
                                dataExperience.deliveringState = constants.deliveringStates.notStarted;
                            });

                            it('should set current showStatus to \"false\"', function () {
                                viewModel.activate();
                                var experience = _.find(viewModel.experiences(), function (item) { return item.id == dataExperience.id; });
                                expect(experience.showStatus()).toBe(false);
                            });

                        });

                        describe('and deliveringState is changed', function () {

                            beforeEach(function () {
                                dataExperience.deliveringState = constants.deliveringStates.succeed;
                            });

                            it('should set current showStatus to \"true\"', function () {
                                viewModel.activate();
                                var experience = _.find(viewModel.experiences(), function (item) { return item.id == dataExperience.id; });
                                expect(experience.showStatus()).toBe(true);
                            });

                        });

                    });

                    describe('and deliveringState is \"building\"', function () {

                        beforeEach(function () {
                            viewExperience.deliveringState(constants.deliveringStates.building);
                            viewModel.deactivate();
                        });

                        describe('and deliveringState is not changed', function () {

                            beforeEach(function () {
                                dataExperience.deliveringState = constants.deliveringStates.building;
                            });

                            it('should set current showStatus to \"true\"', function () {
                                viewModel.activate();
                                var experience = _.find(viewModel.experiences(), function (item) { return item.id == dataExperience.id; });
                                expect(experience.showStatus()).toBe(true);
                            });

                        });

                        describe('and deliveringState is changed', function () {

                            beforeEach(function () {
                                dataExperience.deliveringState = constants.deliveringStates.succeed;
                            });

                            it('should set current showStatus to \"true\"', function () {
                                viewModel.activate();
                                var experience = _.find(viewModel.experiences(), function (item) { return item.id == dataExperience.id; });
                                expect(experience.showStatus()).toBe(true);
                            });

                        });

                    });

                    describe('and deliveringState is \"Failed\"', function () {

                        beforeEach(function () {
                            viewExperience.deliveringState(constants.deliveringStates.failed);
                            viewModel.deactivate();
                        });

                        describe('and deliveringState is not changed', function () {

                            beforeEach(function () {
                                dataExperience.deliveringState = constants.deliveringStates.failed;
                            });

                            it('should set current showStatus to \"false\"', function () {
                                viewModel.activate();
                                var experience = _.find(viewModel.experiences(), function (item) { return item.id == dataExperience.id; });
                                expect(experience.showStatus()).toBe(false);
                            });

                        });

                        describe('and deliveringState is changed', function () {

                            beforeEach(function () {
                                dataExperience.deliveringState = constants.deliveringStates.succeed;
                            });

                            it('should set current showStatus to \"true\"', function () {
                                viewModel.activate();
                                var experience = _.find(viewModel.experiences(), function (item) { return item.id == dataExperience.id; });
                                expect(experience.showStatus()).toBe(true);
                            });

                        });

                    });

                    describe('and deliveringState is \"Succeed\"', function () {

                        beforeEach(function () {
                            viewExperience.deliveringState(constants.deliveringStates.succeed);
                            viewModel.deactivate();
                        });

                        describe('and deliveringState is not changed', function () {

                            beforeEach(function () {
                                dataExperience.deliveringState = constants.deliveringStates.succeed;
                            });

                            it('should set current showStatus to \"false\"', function () {
                                viewModel.activate();
                                var experience = _.find(viewModel.experiences(), function (item) { return item.id == dataExperience.id; });
                                expect(experience.showStatus()).toBe(false);
                            });

                        });

                        describe('and deliveringState is changed', function () {

                            beforeEach(function () {
                                dataExperience.deliveringState = constants.deliveringStates.failed;
                            });

                            it('should set current showStatus to \"true\"', function () {
                                viewModel.activate();
                                var experience = _.find(viewModel.experiences(), function (item) { return item.id == dataExperience.id; });
                                expect(experience.showStatus()).toBe(true);
                            });

                        });

                    });

                });

                describe('when previous showStatus is \"true\"', function () {
                    var dataExperience;

                    beforeEach(function () {
                        dataContext.experiences = experiences;
                        dataExperience = dataContext.experiences[0];
                        viewModel.activate();
                        var viewExperience = _.find(viewModel.experiences(), function (item) { return item.id == dataExperience.id; });

                        viewExperience.showStatus(true);
                        viewModel.deactivate();
                    });

                    it('should set current showStatus to \"true\"', function () {
                        viewModel.activate();

                        var viewExperience = _.find(viewModel.experiences(), function (item) { return item.id == dataExperience.id; });
                        expect(viewExperience.showStatus()).toBe(true);
                    });

                });

            });

            describe('deactivate:', function () {

                it('should be a function', function () {
                    expect(viewModel.deactivate).toBeFunction();
                });

            });

            describe('navigateToCreation', function () {

                it('should be a function', function () {
                    expect(viewModel.navigateToCreation).toBeFunction();
                });

                it('should send event \"Navigate to create experience\"', function () {
                    viewModel.navigateToCreation();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to create experience');
                });

                it('should navigate to #experience/create', function () {
                    viewModel.navigateToCreation();
                    expect(router.navigate).toHaveBeenCalledWith('experience/create');
                });

            });

            describe('navigateToDetails:', function () {

                it('should be a function', function () {
                    expect(viewModel.navigateToDetails).toBeFunction();
                });

                it('should send event \"Navigate to details\"', function () {
                    dataContext.experiences = experiences;
                    viewModel.navigateToDetails(experiences[0]);
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to details');
                });

                it('should navigate to #experience/id', function () {
                    dataContext.experiences = experiences;
                    viewModel.navigateToDetails(experiences[0]);
                    expect(router.navigate).toHaveBeenCalledWith('experience/' + experiences[0].id);
                });

            });

            describe('navigateToObjectives:', function () {

                it('should be a function', function () {
                    expect(viewModel.navigateToObjectives).toBeFunction();
                });

                it('should send event \"Navigate to objectives\"', function () {
                    viewModel.navigateToObjectives();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to objectives');
                });

                it('should navigate to #objectives', function () {
                    viewModel.navigateToObjectives();
                    expect(router.navigate).toHaveBeenCalledWith('objectives');
                });

            });

            describe('toggleSelection:', function () {
                var experience;

                beforeEach(function () {
                    experience = {
                        isSelected: ko.observable()
                    };
                });

                it('should be a function', function () {
                    expect(viewModel.toggleSelection).toBeFunction();
                });

                it('should select experience', function () {
                    experience.isSelected(false);
                    viewModel.toggleSelection(experience);
                    expect(experience.isSelected()).toBe(true);
                });

                it('should send event \"Experience unselected\" when was selected', function () {
                    experience.isSelected(true);
                    viewModel.toggleSelection(experience);
                    expect(eventTracker.publish).toHaveBeenCalledWith('Experience unselected');
                });

                it('should send event \"Experience selected\" when was not selected', function () {
                    experience.isSelected(false);
                    viewModel.toggleSelection(experience);
                    expect(eventTracker.publish).toHaveBeenCalledWith('Experience selected');
                });

            });

            describe('enableDeleteExperiences:', function () {

                it('should be computed', function () {
                    expect(viewModel.enableDeleteExperiences).toBeComputed();
                });

                describe('when no experience is selected', function () {

                    it('should be false', function () {
                        viewModel.experiences([{ isSelected: ko.observable(false) }]);
                        expect(viewModel.enableDeleteExperiences()).toBeFalsy();
                    });

                });

                describe('when 1 experience is selected', function () {

                    it('should be true', function () {
                        viewModel.experiences([{ isSelected: ko.observable(true) }]);
                        expect(viewModel.enableDeleteExperiences()).toBeTruthy();
                    });

                });

                describe('when more than 1 experiences are selected', function () {

                    it('should be false', function () {
                        viewModel.experiences([{ isSelected: ko.observable(true) }, { isSelected: ko.observable(true) }]);
                        expect(viewModel.enableDeleteExperiences()).toBeTruthy();
                    });

                });
            });

            describe('deleteSelectedExperiences:', function () {

                it('should be function', function () {
                    expect(viewModel.deleteSelectedExperiences).toBeFunction();
                });

                it('should send event \'Delete selected experiences\'', function () {
                    viewModel.experiences([{ isSelected: ko.observable(true), objectives: [] }]);
                    viewModel.deleteSelectedExperiences();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Delete selected experiences');
                });

                describe('when no experiences are selected', function () {

                    it('should throw exception', function () {
                        viewModel.experiences([]);

                        var f = function () {
                            viewModel.deleteSelectedExperiences();
                        };
                        expect(f).toThrow();
                    });

                });

                describe('when more that 1 experience are selected', function () {

                    it('should show error notification', function () {
                        viewModel.experiences([{ isSelected: ko.observable(true) }, { isSelected: ko.observable(true) }]);
                        spyOn(notify, 'error');

                        viewModel.deleteSelectedExperiences();
                        expect(notify.error).toHaveBeenCalled();
                    });

                });

                describe('when there is only 1 selected objective', function () {

                    var repository = require('repositories/experienceRepository');

                    var removeExperience;

                    beforeEach(function () {
                        removeExperience = Q.defer();
                        spyOn(repository, 'removeExperience').andReturn(removeExperience.promise);
                    });

                    describe('and experience has related learning objectives', function () {

                        beforeEach(function () {
                            viewModel.experiences([{ isSelected: ko.observable(true), objectives: [{}] }]);
                            spyOn(notify, 'error');
                        });

                        it('should show error notification', function () {
                            viewModel.deleteSelectedExperiences();
                            expect(notify.error).toHaveBeenCalled();
                        });

                        it('should not remove experience from repository', function () {
                            viewModel.deleteSelectedExperiences();
                            expect(repository.removeExperience).not.toHaveBeenCalled();
                        });

                    });

                    describe('and experience has no related learning objectives', function () {

                        beforeEach(function () {
                            viewModel.experiences([{ id: 'id', isSelected: ko.observable(true), objectives: [] }]);
                            spyOn(notify, 'hide');
                        });

                        it('should hide notification', function () {
                            viewModel.deleteSelectedExperiences();
                            expect(notify.hide).toHaveBeenCalled();
                        });

                        it('should remove experience from repository', function () {
                            viewModel.deleteSelectedExperiences();
                            expect(repository.removeExperience).toHaveBeenCalledWith('id');
                        });

                        describe('and experience was successfully removed from repository', function () {

                            it('should remove experience from view model', function () {
                                viewModel.deleteSelectedExperiences();

                                var promise = removeExperience.promise.fin(function () { });

                                removeExperience.resolve();

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.experiences().length).toBe(0);
                                });
                            });

                        });
                    });

                });

            });

            describe('publishExperience:', function () {
                var experience;
                var experiencerepositorygetByIdDefer;
                var experiencerepositorygetByIdPromise;
                var repository = require('repositories/experienceRepository');
                    

                beforeEach(function () {
                    experience = {
                        id: 'testId3',
                        deliveringState: ko.observable(),
                        showStatus: ko.observable(),
                        isSelected: ko.observable(),
                        publishPackageExists: ko.observable(),
                        publish: function () {
                        }
                    };
                    
                    spyOn(experience, 'publish');

                    experiencerepositorygetByIdDefer = Q.defer();
                    experiencerepositorygetByIdPromise = experiencerepositorygetByIdDefer.promise;
                    spyOn(repository, 'getById').andReturn(experiencerepositorygetByIdPromise);
                });

                it('should be a function', function () {
                    expect(viewModel.publishExperience).toBeFunction();
                });

                it('should send event \"Publish experience\"', function () {
                    viewModel.publishExperience(experience);

                    expect(eventTracker.publish).toHaveBeenCalledWith('Publish experience');
                });

                it('should reset item selection', function () {
                    experience.isSelected(true);

                    viewModel.publishExperience(experience);

                    expect(experience.isSelected()).toBe(false);
                });

                it('should start publish of current experience', function () {
                    experiencerepositorygetByIdDefer.resolve(experience);
                    var promise = viewModel.publishExperience(experience);

                    waitsFor(function () {
                        return !promise.isPending();
                    });

                    runs(function () {
                        expect(experience.publish).toHaveBeenCalled();
                    });
                });
                
                describe('when publish is finished', function () {
                    beforeEach(function () {
                        experience = {
                            id: 'testId3',
                            deliveringState: ko.observable(),
                            showStatus: ko.observable(),
                            isSelected: ko.observable(),
                            publishPackageExists: ko.observable(),
                            publish: function() {
                            }
                        };
                    });
                    
                    describe('and publish failed', function () {

                        it('should show error notification', function () {
                            spyOn(notify, 'error');

                            var publishPromise = viewModel.publishExperience(experience);

                            eventTracker.publish.reset();
                            experiencerepositorygetByIdDefer.reject('Experience publish is failed');

                            waitsFor(function () {
                                return !publishPromise.isPending();
                            });
                            
                            runs(function () {
                                expect(notify.error).toHaveBeenCalledWith('Experience publish is failed');
                            });
                        });


                        it('should send event \'Experience publish is failed\'', function () {
                            var publishPromise = viewModel.publishExperience(experience);

                            eventTracker.publish.reset();
                            experiencerepositorygetByIdDefer.reject();

                            waitsFor(function () {
                                return !publishPromise.isPending();
                            });
                            runs(function () {
                                expect(eventTracker.publish).toHaveBeenCalledWith('Experience publish is failed');
                            });
                        });

                    });

                });
            });

            describe('downloadExperience:', function () {

                var experience;

                beforeEach(function () {
                    experience = {
                        packageUrl: ko.observable('some url'),
                        isSelected: ko.observable(),
                        deliveringState: ko.observable('')
                    };

                    spyOn(router, 'download');
                });

                it('should be a function', function () {
                    expect(viewModel.downloadExperience).toBeFunction();
                });
               
                it('should send event \"Download experience\"', function () {
                    viewModel.downloadExperience(experience);
                    expect(eventTracker.publish).toHaveBeenCalledWith('Download experience');
                });
            });

            describe('enableOpenExperience:', function () {
                var experience;

                beforeEach(function () {
                    experience = { showStatus: ko.observable(), deliveringState: ko.observable(constants.deliveringStates.notStarted) };
                });

                it('should be a function', function () {
                    expect(viewModel.enableOpenExperience).toBeFunction();
                });

                it('should hide showStatus and so enable open experience', function () {
                    experience.showStatus(true);

                    viewModel.enableOpenExperience(experience);

                    expect(experience.showStatus()).toBe(false);
                });

                describe('when deliveringState or deliveringState equals building', function () {

                    beforeEach(function () {
                        experience = { showStatus: ko.observable(), deliveringState: ko.observable(constants.deliveringStates.building) };
                    });

                    it('should not hide showStatus', function () {
                        experience.showStatus(true);
                        viewModel.enableOpenExperience(experience);
                        expect(experience.showStatus()).toBe(true);
                    });

                });
                
                describe('when deliveringState or deliveringState equals publishing', function () {

                    beforeEach(function () {
                        experience = { showStatus: ko.observable(), deliveringState: ko.observable(constants.deliveringStates.publishing) };
                    });

                    it('should not hide showStatus', function () {
                        experience.showStatus(true);
                        viewModel.enableOpenExperience(experience);
                        expect(experience.showStatus()).toBe(true);
                    });

                });
            });

            describe('when experience build was started', function () {

                var experienceVm;

                beforeEach(function () {
                    experienceVm = {
                        id: 'experienceId',
                        deliveringState: ko.observable(constants.deliveringStates.notStarted),
                        showStatus: ko.observable(false)
                    };
                    viewModel.experiences([experienceVm]);
                });

                it('should change status of corresponding experience to \'building\'', function () {
                    app.trigger(constants.messages.experience.build.started, { id: experienceVm.id });
                    expect(experienceVm.deliveringState()).toEqual(constants.deliveringStates.building);
                });

                it('should show building status for corresponding experience', function () {
                    app.trigger(constants.messages.experience.build.started, { id: experienceVm.id });
                    expect(experienceVm.showStatus()).toBeTruthy();
                });

                it('should not change status of other experiences', function () {
                    app.trigger(constants.messages.experience.build.started, { id: '100500' });
                    expect(experienceVm.deliveringState()).toEqual(constants.deliveringStates.notStarted);
                });

                it('should not show building status for other experiences', function () {
                    app.trigger(constants.messages.experience.build.started, { id: '100500' });
                    expect(experienceVm.showStatus()).toBeFalsy();
                });

            });

            describe('when experience build completed', function () {

                var experienceVm;

                beforeEach(function () {
                    experienceVm = {
                        id: 'experienceId',
                        packageUrl: ko.observable('packageUrl'),
                        deliveringState: ko.observable(constants.deliveringStates.inProgress)
                    };
                    viewModel.experiences([experienceVm]);
                });

                it('should change status of the corresponding experience to \'success\'', function () {
                    app.trigger(constants.messages.experience.build.completed, { id: experienceVm.id });
                    expect(experienceVm.deliveringState()).toEqual(constants.deliveringStates.succeed);
                });

                it('should change packageUrl of the corresponding experience', function () {
                    var packageUrl = "http://xxx.com";
                    app.trigger(constants.messages.experience.build.completed, { id: experienceVm.id, packageUrl: packageUrl });

                    expect(experienceVm.packageUrl()).toEqual(packageUrl);
                });

                it('should not change status of other experiences', function () {
                    app.trigger(constants.messages.experience.build.completed, { id: '100500' });
                    expect(experienceVm.deliveringState()).toEqual(constants.deliveringStates.inProgress);
                });

                it('should not change packageUrl of other experiences', function () {
                    var packageUrl = "http://xxx.com";
                    app.trigger(constants.messages.experience.build.completed, { id: '100500', packageUrl: packageUrl });

                    expect(experienceVm.packageUrl()).toEqual('packageUrl');
                });

            });

            describe('when experience build failed', function () {

                var experienceVm;

                beforeEach(function () {
                    experienceVm = {
                        id: 'experienceId',
                        packageUrl: ko.observable('packageUrl'),
                        deliveringState: ko.observable(constants.deliveringStates.inProgress),
                    };
                    viewModel.experiences([experienceVm]);
                });

                it('should change status of the corresponding experience to \'failed\'', function () {
                    app.trigger(constants.messages.experience.build.failed, experienceVm.id);
                    expect(experienceVm.deliveringState()).toEqual(constants.deliveringStates.failed);
                });

                it('should remove packageUrl of the corresponding experience', function () {
                    app.trigger(constants.messages.experience.build.failed, experienceVm.id);
                    expect(experienceVm.packageUrl()).toEqual("");
                });

                it('should not change status of other experiences', function () {
                    app.trigger(constants.messages.experience.build.failed, '100500');
                    expect(experienceVm.deliveringState()).toEqual(constants.deliveringStates.inProgress);
                });

                it('should not remove packageUrl of other experiences', function () {
                    app.trigger(constants.messages.experience.build.failed, '100500');
                    expect(experienceVm.packageUrl()).toEqual("packageUrl");
                });

            });

            describe('when experience publish was started', function () {

                var experienceVm;

                beforeEach(function () {
                    experienceVm = {
                        id: 'experienceId',
                        deliveringState: ko.observable(constants.deliveringStates.notStarted),
                        showStatus: ko.observable(false)
                    };
                    viewModel.experiences([experienceVm]);
                });

                it('should change deliveringState of corresponding experience to \'publishing\'', function () {
                    app.trigger(constants.messages.experience.publish.started, { id: experienceVm.id });
                    expect(experienceVm.deliveringState()).toEqual(constants.deliveringStates.publishing);
                });

                it('should show deliveringState for corresponding experience', function () {
                    app.trigger(constants.messages.experience.publish.started, { id: experienceVm.id });
                    expect(experienceVm.showStatus()).toBeTruthy();
                });

                it('should not change deliveringState of other experiences', function () {
                    app.trigger(constants.messages.experience.publish.started, { id: '100500' });
                    expect(experienceVm.deliveringState()).toEqual(constants.deliveringStates.notStarted);
                });

                it('should not show deliveringState for other experiences', function () {
                    app.trigger(constants.messages.experience.publish.started, { id: '100500' });
                    expect(experienceVm.showStatus()).toBeFalsy();
                });

            });

            describe('when experience publish completed', function () {

                var experienceVm;

                beforeEach(function () {
                    experienceVm = {
                        id: 'experienceId',
                        publishedPackageUrl: ko.observable('packageUrl'),
                        deliveringState: ko.observable(constants.deliveringStates.inProgress)
                    };
                    viewModel.experiences([experienceVm]);
                });

                it('should change deliveringState of the corresponding experience to \'success\'', function () {
                    app.trigger(constants.messages.experience.publish.completed, { id: experienceVm.id });
                    expect(experienceVm.deliveringState()).toEqual(constants.deliveringStates.succeed);
                });

                it('should change publishedPackageUrl of the corresponding experience', function () {
                    var publishedPackageUrl = "http://xxx.com";
                    app.trigger(constants.messages.experience.publish.completed, { id: experienceVm.id, publishedPackageUrl: publishedPackageUrl });

                    expect(experienceVm.publishedPackageUrl()).toEqual(publishedPackageUrl);
                });

                it('should not change deliveringState of other experiences', function () {
                    app.trigger(constants.messages.experience.publish.completed, { id: '100500' });
                    expect(experienceVm.deliveringState()).toEqual(constants.deliveringStates.inProgress);
                });

                it('should not change publishedPackageUrl of other experiences', function () {
                    var publishedPackageUrl = "http://xxx.com";
                    app.trigger(constants.messages.experience.publish.completed, { id: '100500', publishedPackageUrl: publishedPackageUrl });

                    expect(experienceVm.publishedPackageUrl()).toEqual('packageUrl');
                });

            });

            describe('when experience publish failed', function () {

                var experienceVm;

                beforeEach(function () {
                    experienceVm = {
                        id: 'experienceId',
                        publishedPackageUrl: ko.observable('packageUrl'),
                        deliveringState: ko.observable(constants.deliveringStates.inProgress),
                    };
                    viewModel.experiences([experienceVm]);
                });

                it('should change deliveringState of the corresponding experience to \'failed\'', function () {
                    app.trigger(constants.messages.experience.publish.failed, experienceVm.id);
                    expect(experienceVm.deliveringState()).toEqual(constants.deliveringStates.failed);
                });

                it('should remove publishedPackageUrl of the corresponding experience', function () {
                    app.trigger(constants.messages.experience.publish.failed, experienceVm.id);
                    expect(experienceVm.publishedPackageUrl()).toEqual("");
                });

                it('should not change deliveringState of other experiences', function () {
                    app.trigger(constants.messages.experience.publish.failed, '100500');
                    expect(experienceVm.deliveringState()).toEqual(constants.deliveringStates.inProgress);
                });

                it('should not remove publishedPackageUrl of other experiences', function () {
                    app.trigger(constants.messages.experience.publish.failed, '100500');
                    expect(experienceVm.publishedPackageUrl()).toEqual("packageUrl");
                });

            });
        });
    }
);