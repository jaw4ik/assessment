import userContext from 'userContext';
import apiHttpWrapper from 'http/apiHttpWrapper';

export default {
    execute: async () => {
        await apiHttpWrapper.post('api/user/allowcoggno');
        userContext.identity.isCoggnoSamlServiceProviderAllowed = true;
    }
}