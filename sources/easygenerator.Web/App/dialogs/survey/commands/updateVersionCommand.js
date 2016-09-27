import apiHttpWrapper from 'http/apiHttpWrapper';

'use strict';

class UpdateSurveyVersionCommand {
    constructor(){ }
    
    execute() {
        return apiHttpWrapper.post('/api/user/updstesurveyversion');
    }
}

export default new UpdateSurveyVersionCommand();
