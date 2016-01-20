import Repository from 'repositories/documentRepository';
var repository = new Repository();

export default {
    execute: (id) => {
        return repository.removeDocument(id);
    }
}