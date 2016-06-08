import ko from 'knockout';
import userContext from 'userContext';
import defaultPublishModel from 'dialogs/learningPath/defaultPublish';
import customPublishModel from 'dialogs/learningPath/customPublish';

class IShareLearningPathDialog {
    constructor() {
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.activate = this.activate.bind(this);
    }
}

class ShareLearningPathDialog extends IShareLearningPathDialog {
    constructor() {
        super();
        this.publishModel = null;
        this.company = null;
        this.isShown = ko.observable(false);
        this.isActivated = ko.observable(false);
    }
    async show(learningPathId) {
        await this.publishModel.activate(this.company ? { learningPathId: learningPathId, companyInfo: this.company } : learningPathId);
        this.isActivated(true);
        this.isShown(true);
    }
    hide() {
        this.isShown(false);
        this.publishModel.deactivate();
        this.isActivated(false);
    }
    activate() {
        var company = userContext.identity.companies.sort((company1, company2) => {
            if (company1.priority === company2.priority) {
                return (new Date(company1.createdOn)).getTime() > (new Date(company2.createdOn)).getTime() ? 1 : -1;
            }
            return company1.priority < company2.priority ? 1 : -1;
        })[0];
        
        this.publishModel = company ? customPublishModel : defaultPublishModel;
        this.company = company || null;
    }
}

export default new ShareLearningPathDialog();