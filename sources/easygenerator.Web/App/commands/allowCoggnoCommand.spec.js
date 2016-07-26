import command from './allowCoggnoCommand';

import userContext from 'userContext';
import apiHttpWrapper from 'http/apiHttpWrapper';

describe('command [allowCoggnoCommand]', () => {

    describe('execute:', () => {

        beforeEach(() => {
            spyOn(apiHttpWrapper, 'post').and.returnValue(Promise.resolve());
            userContext.identity = { isCoggnoSamlServiceProviderAllowed: false };
        });

        it('should be function', () => {
            expect(command.execute).toBeFunction();
        });

        it('should return promise', () => {
            expect(command.execute()).toBePromise();
        });

        it('should make post request', () => {
            command.execute();
            expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/user/allowcoggno');
        });

        describe('when request passed', () => {

            it('should set isCoggnoSamlServiceProviderAllowed to true', done => {
                var promise = command.execute();

                promise.then(() => {
                    expect(userContext.identity.isCoggnoSamlServiceProviderAllowed).toBeTruthy();
                    done();
                });
            });

        });

    });

});
