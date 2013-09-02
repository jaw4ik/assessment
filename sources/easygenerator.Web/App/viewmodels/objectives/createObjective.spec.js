﻿define(['viewmodels/objectives/createObjective'],
    function (viewModel) {
        "use strict";

        var router = require('plugins/router'),
            eventTracker = require('eventTracker');

        var eventsCategory = 'Create learning objective';

        describe('viewModel [createObjective]', function () {

            var repository = require('repositories/objectiveRepository');

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigate');
            });

            it('should be object', function () {
                expect(viewModel).toBeObject();
            });

            describe('title:', function () {

                it('should be observable', function () {
                    expect(viewModel.title).toBeObservable();
                });

                it('should have isValid observable', function () {
                    expect(viewModel.title.isValid).toBeObservable();
                });

                describe('when longer than 255 symbols', function () {

                    it('should be not valid', function () {
                        viewModel.title(new Array(257).join('a'));
                        expect(viewModel.title.isValid()).toBeFalsy();
                    });

                });

                describe('when empty', function () {

                    it('should be not valid', function () {
                        viewModel.title('');
                        expect(viewModel.title.isValid()).toBeFalsy();
                    });

                });

            });
            describe('notification:', function () {

                it('should be object', function () {
                    expect(viewModel.notification).toBeObject();
                });

                it('should have text observable', function () {
                    expect(viewModel.notification.text).toBeDefined();
                    expect(viewModel.notification.text).toBeObservable();
                });

                it('should have visibility observable', function () {
                    expect(viewModel.notification.visibility).toBeDefined();
                    expect(viewModel.notification.visibility).toBeObservable();
                });

                describe('close', function () {

                    it('should be function', function () {
                        expect(viewModel.notification.close).toBeFunction();
                    });

                    describe('when called', function () {

                        describe('and visibility is true', function () {

                            it('should set visibility to false', function () {
                                viewModel.notification.visibility(true);
                                viewModel.notification.close();

                                expect(viewModel.notification.visibility()).toBeFalsy();
                            });

                        });

                    });

                });

                describe('update', function () {

                    it('should be function', function () {
                        expect(viewModel.notification.update).toBeFunction();
                    });

                    describe('when called', function () {

                        describe('and visibility is false', function () {
                            it('should set visibility to true', function () {
                                viewModel.notification.visibility(false);
                                viewModel.notification.update();

                                expect(viewModel.notification.visibility()).toBeTruthy();
                            });
                        });
                    });

                });
            });

            describe('createAndNew:', function () {

                var addObjective;

                beforeEach(function () {
                    addObjective = Q.defer();
                    spyOn(repository, 'addObjective').andReturn(addObjective.promise);
                });

                it('should be function', function () {
                    expect(viewModel.createAndNew).toBeFunction();
                });

                describe('when triggered', function () {

                    describe('and title is valid', function () {

                        beforeEach(function () {
                            viewModel.title('Some valid text');
                            spyOn(viewModel.notification, 'update');
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

                        it('should clear title', function () {
                            viewModel.createAndNew();

                            var promise = addObjective.promise.fin(function () {
                            });
                            addObjective.resolve();

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.title().length).toEqual(0);
                            });
                        });

                        it('should hide validation', function () {
                            viewModel.createAndNew();

                            var promise = addObjective.promise.fin(function () {
                            });
                            addObjective.resolve();

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(router.validationVisible).toBeFalsy();
                            });
                        });

                        it('should show notification', function () {
                            viewModel.createAndNew();
                            
                            var promise = addObjective.promise.finally(function () { });
                            addObjective.resolve();

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.notification.update).toHaveBeenCalled();
                            });
                        });

                    });

                    it('should send event \'Create learning objective and create new\'', function () {
                        viewModel.createAndNew();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Create learning objective and create new', eventsCategory);
                    });

                });

            });

            describe('createAndEdit:', function () {

                var addObjective;

                beforeEach(function () {
                    addObjective = Q.defer();
                    spyOn(repository, 'addObjective').andReturn(addObjective.promise);
                });

                it('should be function', function () {
                    expect(viewModel.createAndEdit).toBeFunction();
                });

                describe('when triggered', function () {

                    describe('and title is emty', function () {
                        describe('and title is valid', function () {

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

                            it('should navigate to created objective', function () {
                                var id = '0';

                                viewModel.createAndEdit();

                                var promise = addObjective.promise.fin(function () {
                                });
                                addObjective.resolve(id);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(router.navigate).toHaveBeenCalledWith('objective/' + id);
                                });
                            });

                        });

                        it('should send event \'Create learning objective and open it properties\'', function () {
                            viewModel.createAndEdit();
                            expect(eventTracker.publish).toHaveBeenCalledWith('Create learning objective and open it properties', eventsCategory);
                        });

                    });

                });

                describe('navigateToObjectives:', function () {

                    it('should send event \'Navigate to objectives\'', function () {
                        viewModel.navigateToObjectives();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to objectives', eventsCategory);
                    });

                    it('should navigate to #objectives', function () {
                        viewModel.navigateToObjectives();
                        expect(router.navigate).toHaveBeenCalledWith('objectives');
                    });

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

                it('should hide notification', function() {
                    viewModel.notification.visibility(true);
                    var promise = viewModel.activate();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.notification.visibility()).toBeFalsy();
                    });
                });

            });

            describe('isTitleEditing:', function() {

                it('should be observable', function() {
                    expect(viewModel.isTitleEditing).toBeObservable();
                });

            });

            describe('attached:', function () {

                it('should enable title editing', function() {
                    viewModel.isTitleEditing(false);
                    
                    jasmine.Clock.useMock();
                    
                    viewModel.attached();
                    
                    jasmine.Clock.tick(101);

                    expect(viewModel.isTitleEditing()).toBeTruthy();
                });

            });

        });
    }
);