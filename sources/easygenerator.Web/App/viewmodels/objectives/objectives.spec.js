define(['viewmodels/experiences/experiences'],
    function (viewModel) {
        "use strict";

        var
            router = require('durandal/plugins/router'),
            eventTracker = require('eventTracker');



        describe('viewModel [experience]', function () {


            it('should be defined', function () {
                expect(viewModel).toBeDefined();
            });


            describe('navigateToCreation', function () {

                beforeEach(function () {
                    spyOn(eventTracker, 'publish');
                    spyOn(router, 'navigateTo');
                });

                it('should be defined', function () {
                    expect(viewModel.navigateToCreation).toBeDefined();
                });

                it('should send event', function () {
                    viewModel.navigateToCreation();
                    expect(eventTracker.publish).toHaveBeenCalled();
                });

                it('should navigate to #/experience/create', function () {
                    viewModel.navigateToCreation();
                    expect(router.navigateTo).toHaveBeenCalledWith('#/experience/create');
                });

            });

            describe('navigateToDetails', function () {

                beforeEach(function () {
                    spyOn(eventTracker, 'publish');
                    spyOn(router, 'navigateTo');
                });

                it('should be defined', function () {
                    expect(viewModel.navigateToCreation).toBeDefined();
                });

                it('should send event', function () {
                    viewModel.navigateToDetails({ id: 1 });
                    expect(eventTracker.publish).toHaveBeenCalled();
                });

                it('should navigate to #/experience/id', function () {
                    var experienceId = 1;
                    viewModel.navigateToDetails({ id: experienceId });
                    expect(router.navigateTo).toHaveBeenCalledWith('#/experience/' + experienceId);
                });

            });

            //describe('navigateToObjectives', function () {

            //    beforeEach(function () {
            //        eventTrackerMock.publish.reset();
            //        routerMock.navigateTo.reset();
            //    });

            //    it('should send event', function () {
            //        experiencesViewModel.navigateToObjectives();
            //        expect(eventTrackerMock.publish).toHaveBeenCalled();
            //    });

            //    it('should navigate to #/objectives', function () {
            //        experiencesViewModel.navigateToObjectives();
            //        expect(routerMock.navigateTo).toHaveBeenCalledWith('#/objectives');
            //    });

            //});

            //describe('toggleSelection', function () {

            //    it('should select experience', function () {
            //        dataContext.experiences = experiences;
            //        experiencesViewModel.activate();

            //        var ex = _.find(experiencesViewModel.experiences(), function (item) {
            //            return item.id == experiences[0].id;
            //        });

            //        expect(ex).not.toBeUndefined();
            //        expect(ex.isSelected()).toBe(false);

            //        experiencesViewModel.toggleSelection(ex);

            //        expect(ex.isSelected()).toBe(true);
            //    });

            //});

        });

    }
);