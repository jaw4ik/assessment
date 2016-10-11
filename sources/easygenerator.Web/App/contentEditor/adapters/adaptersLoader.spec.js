import adaptersLoader from './adaptersLoader';

import modulesLoader from 'modulesLoader';

describe('[adaptersLoader]', () => {

    let module = (value) => { return value; };
    beforeEach(() => {
        spyOn(modulesLoader, 'import').and.returnValue(Promise.resolve(module));
    });

    describe('load:', () => {
        
        describe('when adapterPath is null', () => {

            it('should return null', done => (async () => {
                let result = await adaptersLoader.load(null);
                expect(result).toBeNull();
            })().then(done));

        });

        describe('when adapterPath is undefined', () => {

            it('should return null', done => (async () => {
                let result = await adaptersLoader.load();
                expect(result).toBeNull();
            })().then(done));

        });

        describe('when adapterPath is valid', () => {

            it('should call modulesLoader.import', done => (async () => {
                let adapterPath = 'some/path';
                await adaptersLoader.load(adapterPath);
                expect(modulesLoader.import).toHaveBeenCalledWith(adapterPath);
            })().then(done));

            it('should initialize adapter', done => (async () => {
                let adapterActivationData = { id: 22 };
                let result = await adaptersLoader.load('some/path', adapterActivationData);
                expect(result).toBe(adapterActivationData);
            })().then(done));

        });

    });

});