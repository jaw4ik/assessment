define(['navigationBar/navigationBar'], function (viewModel) {
    "use strict";

    var
        app = require('durandal/app'),
        eventTracker = require('eventTracker'),
        constants = require('constants');

    describe('viewmodel [navigationBar]', function () {

        beforeEach(function() {
            spyOn(eventTracker, 'publish');
            spyOn(app, 'trigger');
        });

        describe('isExpanded:', function () {

            it('should be observable', function() {
                expect(viewModel.isExpanded).toBeObservable();
            });

        });

        describe('isVisible:', function () {

            it('should be observable', function () {
                expect(viewModel.isVisible).toBeObservable();
            });

        });

        describe('expand:', function () {

            it('should be function', function() {
                expect(viewModel.expand).toBeFunction();
            });

            it('should send event \'Expand navigation bar\'', function () {
                viewModel.expand();
                expect(eventTracker.publish).toHaveBeenCalledWith('Expand navigation bar');
            });

            it('should set isExpanded to true', function () {
                viewModel.isExpanded(false);
                viewModel.expand();
                expect(viewModel.isExpanded()).toBeTruthy();
            });

            it('should trigger event ' + constants.messages.treeOfContent.expanded, function () {
                viewModel.expand();
                expect(app.trigger).toHaveBeenCalledWith(constants.messages.treeOfContent.expanded);
            });

        });

        describe('collapse:', function () {

            it('should be function', function () {
                expect(viewModel.collapse).toBeFunction();
            });

            it('should send event \'Collapse navigation bar\'', function () {
                viewModel.collapse();
                expect(eventTracker.publish).toHaveBeenCalledWith('Collapse navigation bar');
            });

            it('should set isExpanded to false', function () {
                viewModel.isExpanded(true);
                viewModel.collapse();
                expect(viewModel.isExpanded()).toBeFalsy();
            });

            it('should trigger event ' + constants.messages.treeOfContent.collapsed, function () {
                viewModel.collapse();
                expect(app.trigger).toHaveBeenCalledWith(constants.messages.treeOfContent.collapsed);
            });

        });

        describe('onCollapsed:', function () {

            it('should be function', function () {
                expect(viewModel.onCollapsed).toBeFunction();
            });

            it('should set isVisible to false', function () {
                viewModel.isVisible(true);
                viewModel.onCollapsed();
                expect(viewModel.isVisible()).toBeFalsy();
            });

        });

        describe('activate:', function () {

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

        });

    });

});