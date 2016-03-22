import notify from 'notify';
import * as getSettings from './commands/getSettings';
import * as saveSettings  from './commands/saveSettings';
import TrackingDataModel from './trackingDataModel.js';
import localizationManager from 'localization/localizationManager';

class Configure {
    constructor() {
        this.learningPathId = null;
        this.trackingData = null;
    }

    activate(learningPathId) {
        this.learningPathId = learningPathId;
        return getSettings.execute(learningPathId)
            .then((data) => {
                if (!data || !data.xApi) {
                    throw localizationManager.localize('errorLoadLearningPathSettings');
                }

                this.trackingData = new TrackingDataModel(data.xApi, this.save.bind(this));
            })
            .catch((reason) => notify.error(reason));
    }
    
    save() {
        let settings = {
             xApi: this.trackingData.getData()
        };

        return saveSettings.execute(this.learningPathId, settings)
            .then(notify.saved)
            .catch((reason) => notify.error(reason));
    }
}

export default new Configure();