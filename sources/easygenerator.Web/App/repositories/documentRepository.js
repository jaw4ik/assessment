import _ from 'underscore';
import dataContext from 'dataContext';
import constants from 'constants';
import guard from 'guard';
import apiHttpWrapper from 'http/apiHttpWrapper';
import documentModelMapper from 'mappers/documentModelMapper';

var instance = null;

export default class {
    constructor () {
        if (!instance) {
            instance = this;
        }
        return instance;
    }
    getById(id) {
        guard.throwIfNotString(id, 'Document id (string) was expected');
        var result = _.find(dataContext.documents, item => item.id === id);
        if (_.isUndefined(result)) {
            throw 'Document with this id is not found';
        };
        return result;
    }
    getCollection() {
        return dataContext.documents;
    }
    async addDocument(type, title, embedCode) {
        if (_.isNullOrUndefined(_.find(Array.from(constants.documentType), documentType => documentType === type))) {
            throw `${type} is not valid document type`;
        }
        guard.throwIfNotString(title, 'Document title (string) was expected');
        guard.throwIfNotString(embedCode, 'EmbedCode (string) was expected');

        var response = await apiHttpWrapper.post('api/document/create', { title: title, embedCode: embedCode, documentType: type });
        guard.throwIfNotAnObject(response, 'Response is not an object');

        var document = documentModelMapper.map(response);
        dataContext.documents.push(document);

        return document;
    }
    async updateDocumentTitle(id, title) {
        guard.throwIfNotString(id, 'Document id is not a string');
        guard.throwIfNotString(title, 'Document title is not a string');

        var requestArgs = {
            documentId: id,
            documentTitle: title
        };

        var response = await apiHttpWrapper.post('api/document/updateTitle', requestArgs);
        guard.throwIfNotAnObject(response, 'Response is not an object');
        guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

        var document = _.find(dataContext.documents, item => item.id === id);
        guard.throwIfNotAnObject(document, 'Document does not exist in dataContext');

        document.title = title;
        document.modifiedOn = new Date(response.ModifiedOn);

        return document.modifiedOn;
    }
    async updateDocumentEmbedCode(id, embedCode) {
        guard.throwIfNotString(id, 'Document id is not a string');
        guard.throwIfNotString(embedCode, 'Document embedCode is not a string');

        var requestArgs = {
            documentId: id,
            documentEmbedCode: embedCode
        };

        var response = await apiHttpWrapper.post('api/document/updateEmbedCode', requestArgs);
        guard.throwIfNotAnObject(response, 'Response is not an object');
        guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

        var document = _.find(dataContext.documents, item => item.id === id);
        guard.throwIfNotAnObject(document, 'Document does not exist in dataContext');

        document.embedCode = embedCode;
        document.modifiedOn = new Date(response.ModifiedOn);

        return document.modifiedOn;
    }
    async removeDocument(id) {
        guard.throwIfNotString(id, 'Document id (string) was expected');

        var response = await apiHttpWrapper.post('api/document/delete', { documentId: id });

        dataContext.documents = _.reject(dataContext.documents, document => document.id === id);
        
        if (_.isNullOrUndefined(response)) {
            return;
        }

        var learningPathsWithDeletedDocument = _.filter(dataContext.learningPaths, learningPath => _.contains(response.deletedFromLearningPathIds, learningPath.id));

        _.each(learningPathsWithDeletedDocument, learningPathWithDeletedDocument => {
            learningPathWithDeletedDocument.entities = _.reject(learningPathWithDeletedDocument.entities, item => item.id === id);
        });
    }
}

