define(['viewmodels/objectives/createObjective'],
    function(viewModel) {
        "use strict";
        
        var dataContext = require('dataContext'),
            router = require('durandal/plugins/router'),
            eventTracker = require('eventTracker');
        
        var eventsCategory = 'Create Learning Objective';

        describe('viewModel [createObjective]', function() {

            it('is object', function() {
                expect(viewModel).toEqual(jasmine.any(Object));
            });
            
            describe('title', function () {
                
                it('should be defined as observable', function () {
                    expect(ko.isObservable(viewModel.title)).toBeTruthy();
                });

                it('should be non-valid when empty', function () {
                    viewModel.title('');
                    expect(viewModel.title.isValid()).toBeFalsy();
                });

                it('should be non-valid when more then 255 character', function () {
                    viewModel.title(new Array(300).join('a'));
                    expect(viewModel.title.isValid()).toBeFalsy();
                });

            });

            describe('saveObjective', function () {

                beforeEach(function () {
                    spyOn(eventTracker, 'publish');
                    spyOn(router, 'navigateTo');
                    spyOn(dataContext.objectives, 'push');
                });

                it('should be function', function () {
                    expect(viewModel.saveObjective).toEqual(jasmine.any(Function));
                });

                describe('with valid title', function () {
                    beforeEach(function () {
                        viewModel.title('Test Objective 0');
                    });

                    it('should save objective with dataContext', function () {
                        viewModel.saveObjective();
                        expect(dataContext.objectives.push).toHaveBeenCalled();
                    });

                    it('should send event \"Objective created\"', function () {
                        viewModel.saveObjective();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Objective created', eventsCategory);
                    });

                    it('should navigate to #/objectives', function () {
                        viewModel.saveObjective();
                        expect(router.navigateTo).toHaveBeenCalledWith('#/objectives');
                    });
                });

                describe('with non-valid title', function () {
                    beforeEach(function () {
                        viewModel.title('');
                    });

                    it('should not save objective with dataContext', function () {
                        viewModel.saveObjective();
                        expect(dataContext.objectives.push).not.toHaveBeenCalled();
                    });

                    it('should not send event \"Objective created\"', function () {
                        viewModel.saveObjective();
                        expect(eventTracker.publish).not.toHaveBeenCalled();
                    });

                    it('should not navigate to #/objectives', function () {
                        viewModel.saveObjective();
                        expect(router.navigateTo).not.toHaveBeenCalled();
                    });
                });
            });

            describe('cancel', function () {
                beforeEach(function () {
                    spyOn(eventTracker, 'publish');
                    spyOn(router, 'navigateTo');
                });

                it('should be function', function () {
                    expect(viewModel.cancel).toEqual(jasmine.any(Function));
                });

                it('should navigate to #/objectives', function () {
                    viewModel.cancel();
                    expect(router.navigateTo).toHaveBeenCalledWith('#/objectives');
                });
            });
            
        });

        
    });
