import command from 'dialogs/survey/commands/updateVersionCommand';

import apiHttpWrapper from 'http/apiHttpWrapper';

describe('command [updateVersionCommand]', () => {

    describe('execute:', () => {

        let UpdateSurveyVersionPromise;

        beforeEach(() => {
            UpdateSurveyVersionPromise = Promise.resolve();
            spyOn(apiHttpWrapper, 'post').and.returnValue(UpdateSurveyVersionPromise);
        });

        it('should be function', () => {
            expect(command.execute).toBeFunction();
        });

        it('should return promise', () => {
            expect(command.execute()).toBePromise();
        });

        it('should send request to the server to update last passed survey version', () => {
            command.execute();
            expect(apiHttpWrapper.post).toHaveBeenCalledWith('/api/user/updatesurveyversion');
        });

    });
});
