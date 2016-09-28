import command from 'dialogs/releaseNotes/commands/getReleaseNote';

import apiHttpWrapper from 'http/apiHttpWrapper';

describe('command [addDropspot]', () => {

    describe('execute:', () => {

        let addDropspotPromise;

        beforeEach(() => {
            addDropspotPromise = Promise.resolve();
            spyOn(apiHttpWrapper, 'post').and.returnValue(addDropspotPromise);
        });

        it('should be function', () => {
            expect(command.execute).toBeFunction();
        });

        it('should return promise', () => {
            expect(command.execute()).toBePromise();
        });

        it('should send request to the server to create dropspot', done => (async () => {
            await command.execute()
            expect(apiHttpWrapper.post).toHaveBeenCalled();
        })().then(done));

    });
});
