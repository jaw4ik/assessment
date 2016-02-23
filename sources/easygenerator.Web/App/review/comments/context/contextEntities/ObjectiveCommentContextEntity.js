import CommentContextEntity from 'review/comments/context/contextEntities/CommentContextEntity';
import getObjectiveQuery from 'review/comments/context/queries/getObjective';
import constants from 'constants';
import userContext from 'userContext';
import clientContext from 'clientContext';
import app from 'durandal/app';

export default class extends CommentContextEntity {
    constructor(courseId, objectiveId, objectiveTitle) {
        super(courseId, objectiveTitle);
        this.objectiveId = objectiveId;
    }

    getEntityUrl() {
        let objective = getObjectiveQuery.execute(this.courseId, this.objectiveId);
        if (!objective)
            return null;

        let url = 'courses/' + this.courseId;
        if(!userContext.identity.newEditor) {
            url += '/objectives/' + this.objectiveId;
        }

        return url;
    }

    open() {
        let objective = getObjectiveQuery.execute(this.courseId, this.objectiveId);
        if (objective && userContext.identity.newEditor) {
            clientContext.set(constants.clientContextKeys.highlightedObjectiveId, objective.id);
            app.trigger(constants.messages.objective.navigated);
        }

        super.open();
    }
}