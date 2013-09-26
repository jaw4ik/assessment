define(['viewmodels/experiences/createExperience'],
    function (viewModel) {
        "use strict";

        var router = require('plugins/router'),
            eventTracker = require('eventTracker'),
            repository = require('repositories/experienceRepository'),
            templateRepository = require('repositories/templateRepository'),
            localizationManager = require('localization/localizationManager');

        describe('viewModel [createExperience]', function () {

            beforeEach(function () {
                spyOn(router, 'navigate');
                spyOn(eventTracker, 'publish');
            });

            it('should be a object', function () {
                expect(viewModel).toBeObject();
            });

            describe('experienceTitleMaxLength:', function () {

                it('should be defined', function () {
                    expect(viewModel.experienceTitleMaxLength).toBeDefined();
                });

                it('should be 255', function () {
                    expect(viewModel.experienceTitleMaxLength).toBe(255);
                });

            });

            describe('template:', function () {

                it('should be defined', function () {
                    expect(viewModel.template).toBeDefined();
                });

                describe('id:', function () {
                    it('should be observable', function () {
                        expect(viewModel.template.id).toBeObservable();
                    });
                });

                describe('image:', function () {
                    var defaultTemplateImage = '/Content/images/undefinedTemplate.png';
                    it('should be computed', function () {
                        expect(viewModel.template.image).toBeComputed();
                    });

                    describe('when template.id is null', function () {
                        it('should return null', function () {
                            var template = { id: '0', image: 'img', name: 'name' };
                            viewModel.templates([template]);
                            viewModel.template.id(null);

                            expect(viewModel.template.image()).toBe(defaultTemplateImage);
                        });
                    });

                    describe('when template.id is undefined', function () {
                        it('should return null', function () {
                            var template = { id: '0', image: 'img', name: 'name' };
                            viewModel.templates([template]);
                            viewModel.template.id();

                            expect(viewModel.template.image()).toBe(defaultTemplateImage);
                        });
                    });

                    describe('when template.id is set', function () {

                        describe('when template doesnt exist in templates collection', function () {
                            it('should return null', function () {
                                var template = { id: '0', image: 'img', name: 'name' };
                                viewModel.templates([]);
                                viewModel.template.id();

                                expect(viewModel.template.image()).toBe(defaultTemplateImage);
                            });
                        });

                        describe('when template exists in templates collection', function () {
                            it('should return image', function () {
                                var template = { id: '0', image: 'img', name: 'name' };

                                viewModel.templates([template]);
                                viewModel.template.id(template.id);

                                expect(viewModel.template.image()).toBe(template.image);
                            });
                        });


                    });
                });

            });

            describe('templates:', function () {
                it('should be observable', function () {
                    expect(viewModel.templates).toBeObservable();
                });
            });

            describe('title:', function () {

                it('should be observable', function () {
                    expect(viewModel.title).toBeObservable();
                });

                it('should be validatable', function () {
                    expect(viewModel.title.isValid).toBeComputed();
                });

                it('should be editable', function () {
                    expect(viewModel.title.isEditing).toBeObservable();
                });

                describe('when title is empty', function () {

                    it('should be not valid', function () {
                        viewModel.title("");
                        expect(viewModel.title.isValid()).toBeFalsy();
                    });

                });

                describe('when title is longer that 255', function () {

                    it('should be not valid', function () {
                        viewModel.title(utils.createString(256));
                        expect(viewModel.title.isValid()).toBeFalsy();
                    });

                });

                describe('when title is longer than 255 but after trimming is not longer than 255', function () {

                    it('should be valid', function () {
                        viewModel.title(' ' + utils.createString(254) + ' ');
                        expect(viewModel.title.isValid()).toBeTruthy();
                    });

                });

                describe('when title is whitespace', function () {

                    it('should be not valid', function () {
                        viewModel.title("           ");
                        expect(viewModel.title.isValid()).toBeFalsy();
                    });

                });

            });

            describe('chooseTemplateText:', function () {
                it('should be defined', function () {
                    expect(viewModel.chooseTemplateText).toBeDefined();
                });
            });

            describe('createAndNew:', function () {

                var addExperience;
                var template = { id: 'id', name: 'lala', image: 'img' };
                beforeEach(function () {
                    viewModel.templates([template]);
                    addExperience = Q.defer();
                    spyOn(repository, 'addExperience').andReturn(addExperience.promise);
                });

                it('should be function', function () {
                    expect(viewModel.createAndNew).toBeFunction();
                });

                it('should send event \'Create learning experience and create new\'', function () {
                    viewModel.title.isValid = function () { };
                    viewModel.createAndNew();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Create learning experience and create new');
                });

                describe('and title is not valid', function () {

                    it('should not add experience to repository', function () {
                        viewModel.title.isValid = function () {
                            return false;
                        };

                        viewModel.createAndNew();
                        expect(repository.addExperience).not.toHaveBeenCalled();
                    });

                });

                describe('and template.id is not set', function () {

                    it('should not add experience to repository', function () {
                        viewModel.template.id(null);
                        viewModel.createAndNew();
                        expect(repository.addExperience).not.toHaveBeenCalled();
                    });

                });

                describe('and title is valid and template.id is set', function () {

                    beforeEach(function () {
                        viewModel.template.id(template.id);
                        viewModel.title.isValid = function () {
                            return true;
                        };
                    });

                    it('should trim experience title', function () {
                        viewModel.title('           title           ');
                        viewModel.createAndNew();
                        expect(repository.addExperience).toHaveBeenCalled();
                    });

                    it('should add experience to repository', function () {
                        viewModel.title('title');
                        viewModel.createAndNew();
                        expect(repository.addExperience).toHaveBeenCalledWith('title', template.id);
                    });

                    describe('and experience was added successfully', function () {

                        var notify = require('notify');

                        beforeEach(function () {
                            spyOn(notify, "info");
                        });

                        it('should clear title', function () {
                            viewModel.createAndNew();

                            var promise = addExperience.promise.fin(function () { });
                            addExperience.resolve();

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.title()).toEqual("");
                            });
                        });

                        it('should set focus to title', function () {
                            viewModel.title.isEditing(false);

                            viewModel.createAndNew();

                            var promise = addExperience.promise.fin(function () { });
                            addExperience.resolve();

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.title.isEditing()).toBeTruthy();
                            });
                        });

                        it('should show info notification', function () {
                            viewModel.createAndNew();

                            var promise = addExperience.promise.fin(function () { });
                            addExperience.resolve();

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

            describe('createAndEdit:', function () {

                var addExperience;
                var template = { id: 'id', name: 'lala', image: 'img' };
                beforeEach(function () {
                    addExperience = Q.defer();
                    spyOn(repository, 'addExperience').andReturn(addExperience.promise);
                    viewModel.templates([template]);
                });

                it('should be function', function () {
                    expect(viewModel.createAndEdit).toBeFunction();
                });

                it('should send event \'Create learning experience and create new\'', function () {
                    viewModel.title.isValid = function () { };
                    viewModel.createAndEdit();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Create learning experience and open its properties');
                });

                describe('and title is not valid', function () {

                    it('should not add experience to repository', function () {
                        viewModel.title.isValid = function () {
                            return false;
                        };

                        viewModel.createAndEdit();
                        expect(repository.addExperience).not.toHaveBeenCalled();
                    });

                });

                describe('and template is not set', function () {

                    it('should not add experience to repository', function () {
                        viewModel.template.id(null);

                        viewModel.createAndEdit();
                        expect(repository.addExperience).not.toHaveBeenCalled();
                    });

                });

                describe('and title is valid and template is set', function () {

                    beforeEach(function () {
                        viewModel.template.id(template.id);
                        viewModel.title.isValid = function () {
                            return true;
                        };
                    });

                    it('should trim experience title', function () {
                        viewModel.title('           title           ');
                        viewModel.createAndEdit();
                        expect(repository.addExperience).toHaveBeenCalledWith('title', template.id);
                    });

                    it('should add experience to repository', function () {
                        viewModel.title('title');
                        viewModel.createAndEdit();
                        expect(repository.addExperience).toHaveBeenCalledWith('title', template.id);
                    });

                    describe('and experience was added successfully', function () {

                        it('should clear title', function () {
                            viewModel.createAndEdit();

                            var promise = addExperience.promise.fin(function () { });
                            addExperience.resolve();

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.title()).toEqual("");
                            });
                        });

                        it('should navigate to the added experience', function () {
                            var id = 'id';

                            viewModel.createAndEdit();

                            var promise = addExperience.promise.fin(function () { });
                            addExperience.resolve(id);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(router.navigate).toHaveBeenCalledWith('experience/' + id);
                            });
                        });

                    });

                });

            });

            describe('navigateToExperiences:', function () {

                it('should send event \'Navigate to experiences\'', function () {
                    viewModel.navigateToExperiences();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to experiences');
                });

                it('should navigate to #experiences', function () {
                    viewModel.navigateToExperiences();
                    expect(router.navigate).toHaveBeenCalledWith('experiences');
                });

            });

            describe('activate:', function () {

                it('should be function', function () {
                    expect(viewModel.activate).toBeFunction();
                });

                it('should return promise', function () {
                    var result = viewModel.activate();
                    expect(result).toBePromise();
                });

                describe('when get templates from repository', function () {
                    var getTemplatesDeferred, getTemplatesPromise;

                    beforeEach(function () {
                        getTemplatesDeferred = Q.defer();

                        spyOn(templateRepository, 'getCollection').andReturn(getTemplatesDeferred.promise);
                        getTemplatesPromise = getTemplatesDeferred.promise.fin(function () { });
                    });

                    it('should get templates from repository', function () {
                        getTemplatesDeferred.resolve([]);
                        var promise = viewModel.activate();
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolved();
                            expect(templateRepository.getCollection).toHaveBeenCalled();
                        });
                    });

                    describe('when received templates successfully', function () {
                        beforeEach(function () {
                            viewModel.templates([]);
                            getTemplatesDeferred.resolve([{ id: "0", name: "Default" }, { id: "1", name: "Quizz" }]);
                        });

                        it('should initialize templates collection', function () {
                            var promise = viewModel.activate();
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeResolved();
                                expect(viewModel.templates().length).toBe(2);
                            });
                        });

                        it('should initialize templates collection sorted by name asc', function () {
                            var promise = viewModel.activate();
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeResolved();
                                expect(viewModel.templates()).toBeSortedAsc('name');
                            });
                        });

                        it('should clear title', function () {
                            var promise = viewModel.activate();
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeResolved();
                                expect(viewModel.title()).toEqual("");
                            });
                        });

                        it('should set chooseTemplateText', function () {
                            var promise = viewModel.activate();
                            spyOn(localizationManager, 'localize').andReturn('text');
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeResolved();
                                expect(viewModel.chooseTemplateText).toEqual('text');
                            });
                        });

                    });
                });
            });

            describe('compositionComplete:', function () {

                it('should be function', function () {
                    expect(viewModel.compositionComplete).toBeFunction();
                });

            });
        });
    }
);