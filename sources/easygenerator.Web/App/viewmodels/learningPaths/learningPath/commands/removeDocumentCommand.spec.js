import removeDocumentCommand from './removeDocumentCommand';

import Repository from 'repositories/documentRepository';
var repository = new Repository();

describe('removeDocumentCommand:', () => {

    beforeEach(() => {
        spyOn(repository, 'removeDocument').and.returnValue(Promise.resolve());
    });

    it('should be object', () => {
        expect(removeDocumentCommand).toBeObject();
    });

    describe('execute', () => {

        it('should be function', () => {
            expect(removeDocumentCommand.execute).toBeFunction();
        });

        it('should return promise', () => {
            expect(removeDocumentCommand.execute()).toBePromise();
        });

        it('should call repository method with correct args', () => {
            removeDocumentCommand.execute('123');
            expect(repository.removeDocument).toHaveBeenCalledWith('123');
        });

    });

});