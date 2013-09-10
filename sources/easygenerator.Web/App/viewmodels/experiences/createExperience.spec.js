﻿define(['viewmodels/experiences/createExperience'],
    function (viewModel) {
        "use strict";

        var router = require('plugins/router'),
            eventTracker = require('eventTracker'),
            repository = require('repositories/experienceRepository')
        ;

        var eventsCategory = 'Create Experience';

        describe('viewModel [createExperience]', function () {

            beforeEach(function () {
                spyOn(router, 'navigate');
                spyOn(eventTracker, 'publish');
            });

            it('should be a object', function () {
                expect(viewModel).toBeObject();
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

            describe('createAndNew:', function () {

                var addExperience;

                beforeEach(function () {
                    addExperience = Q.defer();
                    spyOn(repository, 'addExperience').andReturn(addExperience.promise);
                });

                it('should be function', function () {
                    expect(viewModel.createAndNew).toBeFunction();
                });

                it('should send event \'Create learning experience and create new\'', function () {
                    viewModel.title.isValid = function () { };
                    viewModel.createAndNew();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Create learning experience and create new', eventsCategory);
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


                describe('and title is valid', function () {

                    beforeEach(function () {
                        viewModel.title.isValid = function () {
                            return true;
                        };
                    });

                    it('should trim experience title', function () {
                        viewModel.title('           title           ');
                        viewModel.createAndNew();
                        expect(repository.addExperience).toHaveBeenCalledWith({ title: 'title' });
                    });

                    it('should add experience to repository', function () {
                        viewModel.title('title');
                        viewModel.createAndNew();
                        expect(repository.addExperience).toHaveBeenCalledWith({ title: 'title' });
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

                beforeEach(function () {
                    addExperience = Q.defer();
                    spyOn(repository, 'addExperience').andReturn(addExperience.promise);
                });


                it('should be function', function () {
                    expect(viewModel.createAndEdit).toBeFunction();
                });

                it('should send event \'Create learning experience and create new\'', function () {
                    viewModel.title.isValid = function () { };
                    viewModel.createAndEdit();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Create learning experience and open its properties', eventsCategory);
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


                describe('and title is valid', function () {

                    beforeEach(function () {
                        viewModel.title.isValid = function () {
                            return true;
                        };
                    });

                    it('should trim experience title', function () {
                        viewModel.title('           title           ');
                        viewModel.createAndEdit();
                        expect(repository.addExperience).toHaveBeenCalledWith({ title: 'title' });
                    });

                    it('should add experience to repository', function () {
                        viewModel.title('title');
                        viewModel.createAndEdit();
                        expect(repository.addExperience).toHaveBeenCalledWith({ title: 'title' });
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
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to experiences', eventsCategory);
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

                describe('when promise is resolved', function () {

                    it('should clear title', function () {
                        viewModel.title('text');

                        var promise = viewModel.activate();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.title()).toEqual("");
                        });
                    });

                });

            });
        });
    }
);