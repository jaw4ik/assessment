import addDocumentCommand from 'viewmodels/learningPaths/learningPath/commands/addDocumentCommand';
import apiHttpWrapper from 'http/apiHttpWrapper';
import dataContext from 'dataContext';

describe('addDocumentCommand:', () => {

    var document = { id: '124' };
    var learningPath = { id: '123', entities: [] };

    beforeEach(() => {
        dataContext.learningPaths = [learningPath];
        dataContext.documents = [document];
    });

    it('should be object', () => {
        expect(addDocumentCommand).toBeObject();
    });

    describe('execute', () => {

        beforeEach(() => {
            spyOn(apiHttpWrapper, 'post').and.returnValue(Promise.resolve());
        });

        it('should bu function', () => {
            expect(addDocumentCommand.execute).toBeFunction();
        });

        it('should return promise', () => {
            expect(addDocumentCommand.execute('123', '124')).toBePromise();
        });

        it('should do request with correct arguments', () => {
            addDocumentCommand.execute('123', '124');
            expect(apiHttpWrapper.post).toHaveBeenCalledWith('/api/learningpath/document/add', { learningPathId: '123', documentId: '124' });
        });

        describe('when request returns value', () => {

            it('', done => (async () => {
                await addDocumentCommand.execute('123', '124');
                expect(learningPath.entities[0]).toBe(document);
            })().then(done));

        });

    });

});