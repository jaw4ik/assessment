import viewModel from './branchtrack';

import app from 'durandal/app';
import constants from 'constants';
import dialog from 'widgets/dialog/viewmodel';

describe('dialog [branchtrack]', function () {

    beforeEach(function () {
        spyOn(app, 'trigger');
    });

    it('should be defined', function () {
        expect(viewModel).toBeDefined();
    });

    describe('frameSrc:', function () {

        it('should be observable', function() {
            expect(viewModel.frameSrc).toBeObservable();
        });

    });

    describe('isLoading:', function () {

        it('should be observable', function() {
            expect(viewModel.isLoading).toBeObservable();
        });

    });

    describe('show:', function () {

        beforeEach(function() {
            spyOn(dialog, 'show');
        });

        it('should be function', function() {
            expect(viewModel.show).toBeFunction();
        });

        it('should set isLoading to true', function () {
            viewModel.isLoading(false);
            viewModel.show();
            expect(viewModel.isLoading()).toBeTruthy();
        });

        it('should update frameSrc', function () {
            var src = 'frame_src';
            viewModel.frameSrc(null);
            viewModel.show(src);
            expect(viewModel.frameSrc()).toBe(src);
        });

        it('should show dialog', function () {
            viewModel.show();
            expect(dialog.show).toHaveBeenCalledWith(viewModel, constants.dialogs.branchtrack.settings);
        });

    });

    describe('frameLoaded:', function () {

        it('should be function', function() {
            expect(viewModel.frameLoaded).toBeFunction();
        });

        it('should set isLoading to false', function () {
            viewModel.isLoading(true);
            viewModel.frameLoaded();
            expect(viewModel.isLoading()).toBeFalsy();
        });

    });

    describe('onGetWindowMessage:', function () {

        beforeEach(function() {
            spyOn(dialog, 'close');
        });

        it('should be function', function() {
            expect(viewModel.onGetWindowMessage).toBeFunction();
        });

        var eventType;
        describe('when event type \'branchtrack:apps:project\'', function () {

            beforeEach(function() {
                eventType = 'branchtrack:apps:project';
            });

            it('should trigger ' + constants.messages.branchtrack.projectSelected + ' event', function () {
                var projectId = 'some_project_id',
                    message = JSON.stringify({ provider: 'branchtrack', type: eventType, project_uid: projectId });
                    
                viewModel.onGetWindowMessage(message);

                expect(app.trigger).toHaveBeenCalledWith(constants.messages.branchtrack.projectSelected, projectId);
            });

            it('should close dialog', function() {
                var message = JSON.stringify({ provider: 'branchtrack', type: eventType });

                viewModel.onGetWindowMessage(message);

                expect(dialog.close).toHaveBeenCalled();
            });

        });

        describe('when event type \'branchtrack:apps:close\'', function () {

            beforeEach(function () {
                eventType = 'branchtrack:apps:close';
            });

            it('should close dialog', function () {
                var message = JSON.stringify({ provider: 'branchtrack', type: eventType });

                viewModel.onGetWindowMessage(message);

                expect(dialog.close).toHaveBeenCalled();
            });

        });

    });

});
