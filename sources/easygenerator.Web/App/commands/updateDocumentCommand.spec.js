import updateDocumentCommand from './updateDocumentCommand';

import Repository from 'repositories/documentRepository';
var repository = new Repository();

describe('updateDocumentCommand:', () => {

    it('should be defined', () => {
        expect(updateDocumentCommand).toBeDefined();
    });

    describe('execute:', () => {
        var updateTitleResolvedValue = 'date1';
        var updateEmbedCodeResolvedValue = 'date2';

        beforeEach(() => {
            spyOn(repository, 'updateDocumentTitle').and.returnValue(Promise.resolve(updateTitleResolvedValue));
            spyOn(repository, 'updateDocumentEmbedCode').and.returnValue(Promise.resolve(updateEmbedCodeResolvedValue));
        });

        it('should be function', () => {
            expect(updateDocumentCommand.execute).toBeFunction();
        });

        it('should return promise', () => {
            expect(updateDocumentCommand.execute()).toBePromise();
        });

        describe('when title is defined', () => {

            it('should call repository to update title', () => {
                updateDocumentCommand.execute('1', 'title');
                expect(repository.updateDocumentTitle).toHaveBeenCalledWith('1', 'title');
            });

        });

        describe('when embedCode is defined', () => {

            it('should call repository to update embedCode', () => {
                updateDocumentCommand.execute('1', '', 'embedCode');
                expect(repository.updateDocumentEmbedCode).toHaveBeenCalledWith('1', 'embedCode');
            });

        });

        describe('when title and embedCode are not defined', () => {

            it('should not call repository methods', () => {
                updateDocumentCommand.execute('1', '', '');
                expect(repository.updateDocumentTitle).not.toHaveBeenCalled();
                expect(repository.updateDocumentEmbedCode).not.toHaveBeenCalled();
            });

            it('should resolve promise with undefined', done => (async () => {
                var result = await updateDocumentCommand.execute('1', '', '');
                expect(result).toBe(undefined);
            })().then(done));

        });

        it('should resolve promise with latest response', done => (async () => {
            var result = await updateDocumentCommand.execute('1', 'title', 'embedCode');
            expect(result).toBe(updateEmbedCodeResolvedValue);
        })().then(done));

    });

});