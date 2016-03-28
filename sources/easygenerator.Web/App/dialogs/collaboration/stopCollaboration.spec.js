import viewModel from 'dialogs/collaboration/stopCollaboration';

import router from 'plugins/router';
import finishCollaborationCommand from 'commands/collaboration/finishCollaborationCommand';
import notify from 'notify';
import eventTracker from 'eventTracker';
import localizationManager from 'localization/localizationManager';

describe('dialog collaboration [stopCollaboration]', () => {
    let courseId = 'courseId';

    beforeEach(() => {
        spyOn(eventTracker, 'publish');
        spyOn(localizationManager, 'localize').and.callFake(function(localizationKey) {
            return localizationKey;
        });
        spyOn(router, 'navigate');
        spyOn(notify, 'error');
        router.routeData.courseId = courseId;
    });

    describe('ctor:', () => {
        it('isStopCollaborationPopoverShown:', () => {
            expect(viewModel.isStopCollaborationPopoverShown()).toBeFalsy();
        });

        it('isCollaborationFinishing:', () => {
            expect(viewModel.isCollaborationFinishing()).toBeFalsy();
        });
    });

    describe('init:', () => {
        it('should set stop collaboration callback', () => {
            var f = () => {};
            viewModel.init(f);
            expect(viewModel.stopCollaborationCallback).toBe(f);
        });
    });

    describe('reset:', () => {
        it('should set isStopCollaborationPopoverShown to false', () => {
            viewModel.isStopCollaborationPopoverShown(true);
            viewModel.reset();
            expect(viewModel.isStopCollaborationPopoverShown()).toBeFalsy();
        });

        it('should set isCollaborationFinishing to false', () => {
            viewModel.isCollaborationFinishing(true);
            viewModel.reset();
            expect(viewModel.isCollaborationFinishing()).toBeFalsy();
        });
    });

    describe('showStopCollaborationPopover:', () => {
        it('should set isStopCollaborationPopoverShown to true', () => {
            viewModel.isStopCollaborationPopoverShown(false);
            viewModel.showStopCollaborationPopover();
            expect(viewModel.isStopCollaborationPopoverShown()).toBeTruthy();
        });
    });

    describe('hodeStopCollaborationPopover:', () => {
        it('should set isStopCollaborationPopoverShown to false', () => {
            viewModel.isStopCollaborationPopoverShown(true);
            viewModel.hideStopCollaborationPopover();
            expect(viewModel.isStopCollaborationPopoverShown()).toBeFalsy();
        });
    });

    describe('stopCollaboration:', () => {
        it('should publish \'Stop being a co-author\' event', () => {
            viewModel.stopCollaboration();
            expect(eventTracker.publish).toHaveBeenCalledWith('Stop being a co-author');
        });

        it('should set isCollaborationFinishing to true', () => {
            viewModel.isCollaborationFinishing(false);
            viewModel.stopCollaboration();
            expect(viewModel.isCollaborationFinishing()).toBeTruthy();
        });

        it('should execute stop collaboration command', () => {
            spyOn(finishCollaborationCommand, 'execute');
            viewModel.stopCollaboration();
            expect(finishCollaborationCommand.execute).toHaveBeenCalledWith(courseId);
        });

        describe('when stop collaboration command executed successfully', () => {
            it('should navigate to list of courses', done => (async () => {
                let promise = Promise.resolve(true);
                spyOn(finishCollaborationCommand, 'execute').and.returnValue(promise);

                await viewModel.stopCollaboration();
                expect(router.navigate).toHaveBeenCalledWith('courses');
            })().then(done));

            describe('and stop collaboration callback is defined', () => {
                it('should execute stop collaboration callback', done => (async () => {
                    let promise = Promise.resolve(true);
                    spyOn(finishCollaborationCommand, 'execute').and.returnValue(promise);
                    var callback = jasmine.createSpy();
                    viewModel.stopCollaborationCallback = callback;

                    await viewModel.stopCollaboration();
                    
                    expect(callback).toHaveBeenCalled();
                })().then(done));
            });
        });

        describe('when stop collaboration command failed', () => {
            it('should set isCollaborationFinishing to false', done => (async () => {
                let promise = Promise.reject();
                spyOn(finishCollaborationCommand, 'execute').and.returnValue(promise);

                await viewModel.stopCollaboration();
                expect(viewModel.isCollaborationFinishing()).toBeFalsy();
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