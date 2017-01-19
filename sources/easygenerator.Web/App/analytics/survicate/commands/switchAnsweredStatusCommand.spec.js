import command from 'analytics/survicate/commands/switchAnsweredStatusCommand';

import apiHttpWrapper from 'http/apiHttpWrapper';

describe('command [switchAnsweredStatusCommand]', () => {

    describe('execute:', () => {

        let switchAnsweredStatusCommand;

        beforeEach(() => {
            switchAnsweredStatusCommand = Promise.resolve();
            spyOn(apiHttpWrapper, 'post').and.returnValue(switchAnsweredStatusCommand);
        });

        it('should be function', () => {
            expect(command.execute).toBeFunction();
        });

        it('should return promise', () => {
            expect(command.execute()).toBePromise();
        });

        it('should send request to the server to update last passed survey version', () => {
            command.execute();
            expect(apiHttpWrapper.post).toHaveBeenCalledWith('/api/user/switchsurvicateansweredstatus');
        });

    });
});
