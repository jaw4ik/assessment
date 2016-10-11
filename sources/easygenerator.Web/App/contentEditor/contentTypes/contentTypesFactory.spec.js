import contentTypesFactory from './contentTypesFactory';

import modulesLoader from 'modulesLoader';

describe('[contentTypesFactory]', () => {

    describe('createContentViewmodel:', () => {

        class Content {}
        beforeEach(() => {
            spyOn(modulesLoader, 'import').and.returnValue(Promise.resolve(Content));
        });

        it('should call modulesLoader.import with needed content type', () => {
            let contentType = 'myContentType';
            contentTypesFactory.createContentViewmodel(contentType);
            expect(modulesLoader.import).toHaveBeenCalledWith(`contentEditor/contentTypes/${contentType}/Viewmodel`);
        });

        it('should return new instance of needed content viewmodel', done => (async () => {
            let viewmodel = await contentTypesFactory.createContentViewmodel();
            expect(viewmodel).toBeInstanceOf(Content);
        })().then(done));

    });

});