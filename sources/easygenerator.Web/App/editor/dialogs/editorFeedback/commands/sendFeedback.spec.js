import command from 'editor/dialogs/editorFeedback/commands/sendFeedback';

import apiHttpWrapper from 'http/apiHttpWrapper';

describe('editor dialogs editor feedback command [sendFeedback]', () => {
    describe('execute:', () => {
        let promise,
            data = {
                rate:5,
                message:'awesome!'
            };

        beforeEach(() => {
            promise = Promise.resolve();
            spyOn(apiHttpWrapper, 'post').and.returnValue(promise);
        });

        it('should return promise', function () {
            expect(command.execute()).toBePromise();
        });

        it('should send request to the server', done => (async () => {
            command.execute(data);
            await promise;
            expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/feedback/neweditor/send', data);
        })().then(done));
    });
});

