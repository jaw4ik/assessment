import viewModel from 'dialogs/course/stopCollaboration/stopCollaboration';

import finishCollaborationCommand from 'commands/collaboration/finishCollaborationCommand';
import notify from 'notify';
import eventTracker from 'eventTracker';
import localizationManager from 'localization/localizationManager';
import dialog from 'widgets/dialog/viewmodel';
import constants from 'constants';

describe('dialog course [stopCollaboration]', () => {
    let courseId = 'courseId',
        courseTitle = 'courseTitle';

    beforeEach(() => {
        spyOn(eventTracker, 'publish');
        spyOn(localizationManager, 'localize').and.callFake(function(localizationKey) {
            return localizationKey;
        });
        spyOn(notify, 'error');
        spyOn(dialog, 'show');
        spyOn(dialog, 'close');
    });

    describe('ctor:', () => {
        describe('isRemoving:', () => {
            it('should be observable:', () => {
                expect(viewModel.isStopping).toBeObservable();
            });
        });
    });

    describe('show:', () => {
        it('should set course id', () => {
            viewModel.courseId = null;
            viewModel.show(courseId, courseTitle);
            expect(viewModel.courseId).toBe(courseId);
        });

        it('should setcourseTitle', () => {
            viewModel.courseTitle = null;
            viewModel.show(courseId, courseTitle);
            expect(viewModel.courseTitle).toBe(courseTitle);
        });

        it('should isRemoving to false', () => {
            viewModel.isStopping(true);
            viewModel.show(courseId, courseTitle);
            expect(viewModel.isStopping()).toBeFalsy();
        });

        it('should show dialog', () => {
            viewModel.show(courseId, courseTitle);
            expect(dialog.show).toHaveBeenCalledWith(viewModel, constants.dialogs.deleteItem.settings);
        });
    });

    describe('cancel:', () => {
        it('should close dialog', () => {
            viewModel.cancel();
            expect(dialog.close).toHaveBeenCalled();
        });
    });

    describe('stopCollaboration:', () => {
        beforeEach(() => {
            viewModel.courseId = courseId;
        });

        it('should publish \'Stop being a co-author\' event', () => {
            spyOn(finishCollaborationCommand, 'execute');
            viewModel.stopCollaboration();
            expect(eventTracker.publish).toHaveBeenCalledWith('Stop being a co-author');
        });

        it('should set isRemoving to true', () => {
            spyOn(finishCollaborationCommand, 'execute');
            viewModel.isStopping(false);
            viewModel.stopCollaboration();
            expect(viewModel.isStopping()).toBeTruthy();
        });

        it('should execute stop collaboration command', () => {
            spyOn(finishCollaborationCommand, 'execute');
            viewModel.stopCollaboration();
            expect(finishCollaborationCommand.execute).toHaveBeenCalledWith(courseId);
        });

        describe('when stop collaboration command executed successfully', () => {
            it('should set isRemoving to false', done => (async () => {
                let promise = Promise.resolve(true);
                spyOn(finishCollaborationCommand, 'execute').and.returnValue(promise);

                await viewModel.stopCollaboration();
                expect(viewModel.isStopping()).toBeFalsy();
            })().then(done));

            it('should close dialog', done => (async () => {
                let promise = Promise.resolve(true);
                spyOn(finishCollaborationCommand, 'execute').and.returnValue(promise);

                await viewModel.stopCollaboration();
                expect(dialog.close).toHaveBeenCalled();
            })().then(done));
        });

        describe('when stop collaboration command failed', () => {
            it('should set isRemoving to false', done => (async () => {
                let promise = Promise.reject();
                spyOn(finishCollaborationCommand, 'execute').and.returnValue(promise);

                await viewModel.stopCollaboration();
                expect(viewModel.isStopping()).toBeFalsy();
            })().then(done));

            it('should notify an error', done => (async () => {
                let promise = Promise.reject();
                spyOn(finishCollaborationCommand, 'execute').and.returnValue(promise);

                await viewModel.stopCollaboration();
                expect(notify.error).toHaveBeenCalledWith('responseFailed');
            })().then(done));
        });
    });
});