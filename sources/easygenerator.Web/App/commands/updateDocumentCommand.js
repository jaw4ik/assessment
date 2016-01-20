import Repository from 'repositories/documentRepository';
var repository = new Repository();

export default {
    execute: async (id, title, embedCode) => {
        var requests = [],
            results = [];
        title && requests.push(repository.updateDocumentTitle(id, title));
        embedCode && requests.push(repository.updateDocumentEmbedCode(id, embedCode));

        if (requests.length) {
            results = await* requests;
        }

        return results[results.length -1];
    }
}