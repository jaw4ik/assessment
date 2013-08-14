define(function (require) {
    "use strict";

    var viewModel = require('viewModels/questions/createQuestion'),
        eventTracker = require('eventTracker'),
        router = require('durandal/plugins/router'),
        images = require('configuration/images'),
        dataContext = require('dataContext'),
        objectiveModel = require('models/objective');

    xdescribe('viewModel [createQuestion]', function () {

        var objective = new objectiveModel({
            id: '0',
            title: 'Test Objective 0',
            image: images[0],
            questions: []
        });

        beforeEach(function () {
            spyOn(eventTracker, 'publish');
            spyOn(router, 'navigateTo');
        });

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('activate:', function () {
            it('should be a function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            describe('when routeData is not an object', function () {
                it('should navigate to #/400', function () {
                    viewModel.activate();

                    expect(router.navigateTo).toHaveBeenCalledWith('#/400');
                });
            });

            describe('when routeData.objectiveId is empty', function () {
                it('should navigate to #/400', function () {
                    viewModel.activate({});

                    expect(router.navigateTo).toHaveBeenCalledWith('#/400');
                });
            });

            describe('when routeData.objectiveId is null', function () {
                it('should navigate to #/400', function () {
                    viewModel.activate({ objectiveId: null });

                    expect(router.navigateTo).toHaveBeenCalledWith('#/400');
                });
            });

            describe('when objective does not exist', function () {
                it('should navigate to #/404', function () {
                    viewModel.activate({ objectiveId: '-1' });

                    expect(router.navigateTo).toHaveBeenCalledWith('#/404');
                });
            });

            it('should set objectiveId', function () {
                dataContext.objectives = [objective];

                viewModel.activate({ objectiveId: objective.id });

                expect(viewModel.objectiveId).toBe(objective.id);
            });
        });
    });
});