import createDocumentCommand from 'commands/createDocumentCommand';
import Repository from 'repositories/documentRepository';
var repository = new Repository();

describe('createDocumentCommand:', () => {

    it('should be defined', () => {
        expect(createDocumentCommand).toBeDefined();
    });

    describe('execute:', () => {
        var resolvedDocument = { id: 1 };

        beforeEach(() => {
            spyOn(repository, 'addDocument').and.returnValue(Promise.resolve(resolvedDocument));
        });

        it('should be function', () => {
            expect(createDocumentCommand.execute).toBeFunction();
        });

        it('should return promise', () => {
            expect(createDocumentCommand.execute()).toBePromise();
        });

        it('should call repository method with correct arguments', () => {
            var type = 0;
            var title = 'title';
            var embedCode = 'embed code';

            createDocumentCommand.execute(type, title, embedCode);

            expect(repository.addDocument).toHaveBeenCalledWith(type, title, embedCode);
        });

        describe('when repository returs value', () => {

            it('should resolve promise with document returned by repository', done => (async () => {
                var type = 0;
                var title = 'title';
                var embedCode = 'embed code';
                var document = await createDocumentCommand.execute(type, title, embedCode);

                expect(document).toBe(resolvedDocument);
            })().then(done));

        });

    });

});