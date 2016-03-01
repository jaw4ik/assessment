import CommentContextEntity from 'review/comments/context/contextEntities/CommentContextEntity';
import getSectionQuery from 'review/comments/context/queries/getSection';
import constants from 'constants';
import userContext from 'userContext';
import clientContext from 'clientContext';
import app from 'durandal/app';

export default class extends CommentContextEntity {
    constructor(courseId, sectionId, sectionTitle) {
        super(courseId, sectionTitle);
        this.sectionId = sectionId;
    }

    getEntityUrl() {
        let section = getSectionQuery.execute(this.courseId, this.sectionId);
        if (!section)
            return null;

        let url = 'courses/' + this.courseId;
        if(!userContext.identity.newEditor) {
            url += '/sections/' + this.sectionId;
        }

        return url;
    }

    open() {
        let section = getSectionQuery.execute(this.courseId, this.sectionId);
        if (section && userContext.identity.newEditor) {
            clientContext.set(constants.clientContextKeys.highlightedSectionId, section.id);
            app.trigger(constants.messages.section.navigated);
        }

        super.open();
    }
}