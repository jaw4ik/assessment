import DocumentModel from 'models/document';

export default {
    map: document => new DocumentModel({
        id: document.Id,
        title: document.Title,
        embedCode: document.EmbedCode,
        documentType: document.DocumentType,
        createdBy: document.CreatedBy,
        createdOn: document.CreatedOn,
        modifiedOn: document.ModifiedOn
    })
}