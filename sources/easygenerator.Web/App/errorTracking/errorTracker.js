import _ from 'underscore';
import userContext from 'userContext';
import RavenWrapper from './ravenWrapper';


class ErrorTracker{
    constructor() {
        this.ravenWrapper = new RavenWrapper();
    }
    initUserContext() {
        if (!_.isObject(userContext.identity)) {
            return;
        }

        this.ravenWrapper.setUserContext(userContext.identity.email);

    }
}

export default new ErrorTracker();