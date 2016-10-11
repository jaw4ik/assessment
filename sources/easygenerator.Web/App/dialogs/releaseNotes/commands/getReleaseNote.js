import apiHttpWrapper from 'http/apiHttpWrapper';

'use strict';

export default {
    execute () {
        return apiHttpWrapper.post('/api/releasenote/get');
    }
}