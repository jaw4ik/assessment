import dialog from 'dialogs/releaseNotes/releaseNotes';

import dialogWidget from 'widgets/dialog/viewmodel';
import constants from 'constants';
import getReleaseNoteCommand from 'dialogs/releaseNotes/commands/getReleaseNote';
import updateLastReadReleaseNote from 'dialogs/releaseNotes/commands/updateLastReadReleaseNote';
import userContext from 'userContext';

describe('dialog [releaseNotes]', () => {

    beforeEach(() => {
        spyOn(dialogWidget, 'close');
    });

    describe('show:', () => {
        let getReleaseNotePromise;

        it('should be function', () => {
            expect(dialog.show).toBeFunction();
        });

        it('should get releasse notes', () => {
            spyOn(getReleaseNoteCommand, 'execute');
            dialog.show();
            expect(getReleaseNoteCommand.execute).toHaveBeenCalled();
        });

        describe('when response is not defined', () => {

            beforeEach(() => {
                getReleaseNotePromise = Promise.resolve();
                spyOn(getReleaseNoteCommand, 'execute').and.returnValue(getReleaseNotePromise);
            });

            it('should close dialog', done => (async () => {
                await dialog.show();
                expect(dialogWidget.close).toHaveBeenCalled();
            })().then(done));

        });

        describe('when release notes defined', () => {
            var releaseNotes = "foobar";

            beforeEach(() => {
                getReleaseNotePromise = Promise.resolve(releaseNotes);
                spyOn(getReleaseNoteCommand, 'execute').and.returnValue(getReleaseNotePromise);
                spyOn(dialogWidget, 'on');
                spyOn(dialogWidget, 'show');
            });

            it('should show dialog', done => (async () => {
                await dialog.show();
                expect(dialogWidget.show).toHaveBeenCalledWith(dialog, constants.dialogs.releaseNote.settings);
            })().then(done));

            it('should set release notes', done => (async () => {
                await dialog.show();
                expect(dialog.releaseNotes).toBe(releaseNotes);
            })().then(done));

            it('should subscribe on dialog close event', done => (async () => {
                await dialog.show();
                expect(dialogWidget.on).toHaveBeenCalledWith(constants.dialogs.dialogClosed, dialog.closed);
            })().then(done));

        });

    });

    describe('submit:', () => {

        it('should be function', () => {
            expect(dialog.submit).toBeFunction();
        });

        it('should close dialogWidget', () => {
            dialog.submit();
            expect(dialogWidget.close).toHaveBeenCalled();
        });

    });

    describe('closed:', () => {
        let lastReadReleaseNotePromise;
        
        beforeEach(() => {
            lastReadReleaseNotePromise = Promise.resolve();
            spyOn(updateLastReadReleaseNote, 'execute').and.returnValue(lastReadReleaseNotePromise);
            spyOn(dialogWidget, 'off');
        });

        it('should be function', () => {
            expect(dialog.closed).toBeFunction();
        });

        describe('when callbackAfterClose is function', () => {

            beforeEach(() => {
                dialog.callbackAfterClose = () => {};
                spyOn(dialog, 'callbackAfterClose');
            });

            it('should call callback', () => {
                dialog.closed();
                expect(dialog.callbackAfterClose).toHaveBeenCalled();
            });

        });

        it('should update last read release note for user', () => {
            dialog.closed();
            expect(updateLastReadReleaseNote.execute).toHaveBeenCalled();
        });

        it('should update showReleaseNote', done => (async () => {
            userContext.identity = { showReleaseNote: true };
            await dialog.closed();
            expect(userContext.identity.showReleaseNote).toBe(false);    
        })().then(done));


        it('should unsubscribe event dialog close', done => (async () => {
            await dialog.closed();
            expect(dialogWidget.off).toHaveBeenCalledWith(constants.dialogs.dialogClosed, dialog.closed);
        })().then(done));

    });

    describe('callbackAfterClose:', () => {

        it('should be defined', () => {
            expect(dialog.callbackAfterClose).toBeDefined();
        });

    });

    describe('releaseNotes', () => {

        it('should be defined', () => {
            expect(dialog.releaseNotes).toBeDefined();
        });

    });

});
