import Repository from 'repositories/documentRepository';
var repository = new Repository();

export default {
    execute: (type, title, embedCode) => {
        return repository.addDocument(type, title, embedCode);
    }
}