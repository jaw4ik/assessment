import command from 'dialogs/releaseNotes/commands/updateLastReadReleaseNote';

import apiHttpWrapper from 'http/apiHttpWrapper';

describe('command [updateLastReadReleaseNote]', () => {

    describe('execute:', () => {

        let updateLastReadReleasePromise;

        beforeEach(() => {
            updateLastReadReleasePromise = Promise.resolve();
            spyOn(apiHttpWrapper, 'post').and.returnValue(updateLastReadReleasePromise);
        });

        it('should be function', () => {
            expect(command.execute).toBeFunction();
        });

        it('should return promise', () => {
            expect(command.execute()).toBePromise();
        });

        it('should send request to the server to update last read release version', done => (async () => {
            await command.execute()
            expect(apiHttpWrapper.post).toHaveBeenCalled();
        })().then(done));

    });
});
