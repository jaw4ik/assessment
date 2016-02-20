import viewModel from './defaultPublish';

import eventTracker from 'eventTracker';
import constants from 'constants';
import publish from 'viewmodels/courses/publishingActions/publish';

describe('publish course dialog [defaultPublish]', function () {

    beforeEach(function () {
        spyOn(eventTracker, 'publish');
    });

    it('should be object', function() {
        expect(viewModel).toBeObject();
    });
        
    describe('publishAction:', function() {
        it('should be defined', function() {
            expect(viewModel.publishAction).toBeDefined();
        });
    });

    describe('embedTabOpened:', function () {
        it('should be observable', function () {
            expect(viewModel.embedTabOpened).toBeObservable();
        });
    });

    describe('linkTabOpened:', function () {
        it('should be observable', function () {
            expect(viewModel.linkTabOpened).toBeObservable();
        });
    });

    describe('openEmbedTab:', function () {

        it('should be function', function() {
            expect(viewModel.openEmbedTab).toBeFunction();
        });

        describe('when embed tab opened', function () {

            beforeEach(function () {
                viewModel.embedTabOpened(true);
            });

            it('should not send event \'Open embed tab\'', function () {
                viewModel.openEmbedTab();
                expect(eventTracker.publish).not.toHaveBeenCalled();
            });

        });

        describe('when embed tab not opened', function () {

            beforeEach(function () {
                viewModel.embedTabOpened(false);
            });

            it('should send event \'Open embed tab\'', function () {
                viewModel.openEmbedTab();
                expect(eventTracker.publish).toHaveBeenCalledWith('Open embed tab', constants.eventCategories.header);
            });

            it('should open embed tab', function () {
                viewModel.openEmbedTab();
                expect(viewModel.embedTabOpened()).toBeTruthy();
            });

            it('should close link tab', function () {
                viewModel.linkTabOpened(true);
                viewModel.openEmbedTab();
                expect(viewModel.linkTabOpened()).toBeFalsy();
            });

        });

    });

    describe('openLinkTab', function () {

        it('should be function', function() {
            expect(viewModel.openLinkTab).toBeFunction();
        });

        describe('when link tab opened', function () {

            beforeEach(function () {
                viewModel.linkTabOpened(true);
            });

            it('should not send event \'Open link tab\'', function () {
                viewModel.openLinkTab();
                expect(eventTracker.publish).not.toHaveBeenCalled();
            });

        });

        describe('when link tab not opened', function () {

            beforeEach(function () {
                viewModel.linkTabOpened(false);
            });

            it('should send event \'Open link tab\'', function () {
                viewModel.openLinkTab();
                expect(eventTracker.publish).toHaveBeenCalledWith('Open link tab', constants.eventCategories.header);
            });

            it('should open link tab', function () {
                viewModel.openLinkTab();
                expect(viewModel.linkTabOpened()).toBeTruthy();
            });

            it('should close embed tab', function () {
                viewModel.embedTabOpened(true);
                viewModel.openLinkTab();
                expect(viewModel.embedTabOpened()).toBeFalsy();
            });

        });
    });
    describe('activate:', function () {
        var publishAction,
            activateDfr;

        beforeEach(function () {
            publishAction = publish();
            viewModel.publishAction = publishAction;
            activateDfr = Q.defer();
            spyOn(publishAction, 'activate').and.returnValue(activateDfr.promise);
        });

        it('should be function', function() {
            expect(viewModel.activate).toBeFunction();
        });

        it('should return promise', function () {
            expect(viewModel.activate()).toBePromise();
        });

        it('should activate publish action', function () {
            var courseId = 'courseId';
            viewModel.activate(courseId);

            expect(publishAction.activate).toHaveBeenCalledWith(courseId);
        });

    });

    describe('deactivate:', function() {
        var publishAction,
            deactivateDfr;

        beforeEach(function () {
            publishAction = publish();
            viewModel.publishAction = publishAction;
            deactivateDfr = Q.defer();
            spyOn(publishAction, 'deactivate').and.returnValue(deactivateDfr.promise);
        });

        it('should be function', function () {
            expect(viewModel.deactivate).toBeFunction();
        });

        it('should return promise', function () {
            expect(viewModel.deactivate()).toBePromise();
        });

        it('should activate publish action', function () {
            viewModel.deactivate();
            expect(publishAction.deactivate).toHaveBeenCalled();
        });
    });
});
