import viewModel from './editorFeedback';

import constants from 'constants';
import dialog from 'widgets/dialog/viewmodel';
import sendFeedbackCommand from 'editor/dialogs/editorFeedback/commands/sendFeedback';

describe('editor dialogs [editorFeedback]', () => {
    let callback = function() {},
        rate = 5,
        message = 'awesome!';

    beforeEach(() => {
        spyOn(dialog, 'show');
        spyOn(dialog, 'close');
        spyOn(sendFeedbackCommand, 'execute');
    });

    describe('rating:', () => {
        it('should be observable', () => {
            expect(viewModel.rating).toBeObservable();
        });

        it('should be 0', () => {
            expect(viewModel.rating()).toBe(0);
        });
    });

    describe('message:', () => {
        describe('isEditing:', () => {
            it('should be observable', () => {
                expect(viewModel.message.isEditing).toBeObservable();
            });

            it('should be false', () => {
                expect(viewModel.message.isEditing()).toBeFalsy();
            });
        });
    });

    describe('show:', () => {
        it('should set callback', () => {
            viewModel.show(callback);
            expect(viewModel.callback).toBe(callback);
        });

        it('should show dialog', () => {
            viewModel.show(callback);
            expect(dialog.show).toHaveBeenCalledWith(viewModel, constants.dialogs.editorFeedback.settings);
        });
    });

    describe('submit:', () => {
        beforeEach(() => {
            viewModel.rating(rate);
            viewModel.message.text(message);
        });

        it('should execute send feedback command', () => {
            viewModel.submit();
            expect(sendFeedbackCommand.execute).toHaveBeenCalledWith({
                rate: rate,
                message: message
            });
        });

        it('should close dialog', () => {
            viewModel.submit();
            expect(dialog.close).toHaveBeenCalled();
        });

        describe('when callback is set', () => {
            beforeEach(() => {
                viewModel.callback = callback;
                spyOn(viewModel, 'callback');
            });

            it('should call callback', () => {
                viewModel.submit();
                expect(viewModel.callback).toHaveBeenCalled();
            });
        });
    });

    describe('skip:', () => {
        it('should close dialog', () => {
            viewModel.skip();
            expect(dialog.close).toHaveBeenCalled();
        });

        describe('when callback is set', () => {
            beforeEach(() => {
                viewModel.callback = callback;
                spyOn(viewModel, 'callback');
            });

            it('should call callback', () => {
                viewModel.skip();
                expect(viewModel.callback).toHaveBeenCalled();
            });
        });
    });

    describe('beginEditMessage:', () => {
        it('should set message.isEditing to true', () => {
            viewModel.message.isEditing(false);
            viewModel.beginEditMessage();
            expect(viewModel.message.isEditing()).toBeTruthy();
        });
    });

    describe('endEditMessage:', () => {
        it('should set message.isEditing to false', () => {
            viewModel.message.isEditing(true);
            viewModel.endEditMessage();
            expect(viewModel.message.isEditing()).toBeFalsy();
        });
    });
});