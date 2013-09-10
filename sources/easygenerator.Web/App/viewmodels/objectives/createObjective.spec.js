define(['viewmodels/objectives/createObjective'],
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

                        var notify = require('notify');

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
                                expect(notify.info).toHaveBeenCalled();
                            });
                        });

                    });

                    describe('and title has spaces only', function () {

                        it('should set title to invalid', function () {
                            viewModel.title('   ');
                            viewModel.createAndNew();
                            expect(viewModel.title.isValid()).toBeFalsy();
                            addObjective.resolve();
                        });

                    });

                    it('should trim title', function () {
                        viewModel.title('   abc   ');
                        viewModel.createAndNew();
                        expect(viewModel.title()).toEqual('abc');
                        addObjective.resolve();
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

                    describe('and title has spaces only', function () {

                        it('should set title to invalid', function () {
                            viewModel.title('   ');
                            viewModel.createAndEdit();
                            expect(viewModel.title.isValid()).toBeFalsy();
                            addObjective.resolve();
                        });

                    });

                    it('should trim title', function () {
                        viewModel.title('   abc   ');
                        viewModel.createAndEdit();
                        expect(viewModel.title()).toEqual('abc');
                        addObjective.resolve();
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

            });

            describe('isTitleEditing:', function () {

                it('should be observable', function () {
                    expect(viewModel.isTitleEditing).toBeObservable();
                });

            });

        });
    }
);