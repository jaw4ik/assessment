import _ from 'underscore';
import apiHttpWrapper from 'http/apiHttpWrapper';
import dataContext from 'dataContext';

export default {
    execute: async (learningPathId, documentId) => {
        await apiHttpWrapper.post('/api/learningpath/document/add', { learningPathId: learningPathId, documentId: documentId });

        var learningPath = _.find(dataContext.learningPaths, item => item.id === learningPathId);
        var document = _.find(dataContext.documents, item => item.id === documentId);

        learningPath.entities.push(document);
    }
}