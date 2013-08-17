define(['viewmodels/objectives/createObjective'],
    function (viewModel) {
        "use strict";

        var dataContext = require('dataContext'),
            router = require('durandal/plugins/router'),
            eventTracker = require('eventTracker')

        ;

        var eventsCategory = 'Create learning objective';

        describe('viewModel [createObjective]', function () {

            var repository = require('repositories/objectiveRepository');

            var addObjective;

            var objectiveId = 'objectiveId';
            var objectiveTitle = 'objectiveTitle';

            beforeEach(function () {
                addObjective = Q.defer();
                spyOn(repository, 'addObjective').andReturn(addObjective.promise);
                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigateTo');
            });

            it('should be object', function () {
                expect(viewModel).toBeObject();
            });

            describe('showValidation:', function () {
                
                it('should be observable', function () {
                    expect(viewModel.showValidation).toBeObservable();
                });
                
            });

            describe('title:', function() {

                it('should be observable', function() {
                    expect(viewModel.title).toBeObservable();
                });

                describe('isValid:', function() {

                    it('should be observable', function () {
                        expect(viewModel.title.isValid).toBeObservable();
                    });

                    describe('when title is longer than 255 symbols', function() {

                        it('should be false', function () {
                            viewModel.title(utils.createString(256));
                            expect(viewModel.title.isValid()).toBeFalsy();
                        });

                    });
                    
                    describe('when title is less than 255 symbols', function () {

                        it('should be false', function () {
                            viewModel.title(utils.createString(25));
                            expect(viewModel.title.isValid()).toBeTruthy();
                        });

                    });

                });

            });

            
            describe('createAndOpen:', function () {

                it('should be a function', function () {
                    expect(viewModel.createAndOpen).toBeFunction();
                });

                it('should send event \'Create learning objective and open it properties\'', function () {
                    viewModel.createAndOpen();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Create learning objective and open it properties', eventsCategory);
                });

                //describe('when title is not valid', function() {

                //    beforeEach(function() {
                //        viewModel.title(utils.createString(256));
                //    });

                //    it('should show validation error', function () {
                //        viewModel.showValidation(false);
                        
                //        viewModel.createAndOpen();

                //        expect(viewModel.showValidation).toBeTruthy();
                //    });
                    
                //    it('should not add objective to repository', function () {
                //        viewModel.createAndOpen();

                //        expect(repository.addObjective).not.toHaveBeenCalled();
                //    });

                //});

                it('should add objective to repository', function () {
                    viewModel.title = ko.observable(objectiveTitle);

                    viewModel.createAndOpen();

                    expect(repository.addObjective).toHaveBeenCalledWith({ title: objectiveTitle });
                });

                describe('and objective was added successfully', function () {

                    it('should navigate to #/objective/{objectiveId}', function () {

                        viewModel.createAndOpen();

                        var promise = addObjective.promise.finally(function () { });
                        addObjective.resolve(objectiveId);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(router.navigateTo).toHaveBeenCalledWith('#/objective/' + objectiveId);
                        });
                    });

                });

            });

            describe('createAndNew:', function () {

                it('should be a function', function () {
                    expect(viewModel.createAndNew).toBeFunction();
                });

                it('should send event \'Create learning objective and create new\'', function () {
                    viewModel.createAndNew();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Create learning objective and create new', eventsCategory);
                });

                it('should add objective to repository', function () {
                    viewModel.title = ko.observable(objectiveTitle);

                    viewModel.createAndNew();

                    expect(repository.addObjective).toHaveBeenCalledWith({ title: objectiveTitle });
                });

                describe('and objective was added successfully', function () {

                    it('should navigate to #/objective/create', function () {
                        viewModel.createAndNew();

                        var promise = addObjective.promise.finally(function () { });
                        addObjective.resolve(objectiveId);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(router.navigateTo).toHaveBeenCalledWith('#/objective/create');
                        });
                    });

                });

            });

            describe('activate:', function () {

                it('should be function', function () {
                    expect(viewModel.activate).toBeFunction();
                });

                it('should set empty string to title', function () {
                    viewModel.activate();
                    expect(viewModel.title).toBeObservable();                    
                    expect(viewModel.title()).toEqual("");
                });

            });

        });

    });
