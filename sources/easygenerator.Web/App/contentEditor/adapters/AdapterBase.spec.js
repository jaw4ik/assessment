import AdapterBase from './AdapterBase';

describe('[AdapterBase]', () => {

    let adapterBase;
    beforeEach(() => {
        adapterBase = new AdapterBase();
    });

    it('should has events methods', () => {
        expect(adapterBase.on).toBeFunction();
        expect(adapterBase.off).toBeFunction();
        expect(adapterBase.trigger).toBeFunction();
    });

    describe('created:', () => {

        it('should trigger \'created\' event', () => {
            let content = { id: 10 };
            spyOn(adapterBase, 'trigger');
            adapterBase.created(content);
            expect(adapterBase.trigger).toHaveBeenCalledWith('created', content);
        });

    });

    describe('deleted:', () => {

        it('should trigger \'deleted\' event', () => {
            let contentId = 10;
            spyOn(adapterBase, 'trigger');
            adapterBase.deleted(contentId);
            expect(adapterBase.trigger).toHaveBeenCalledWith('deleted', contentId);
        });

    });

    describe('updated:', () => {

        it('should trigger \'updated\' event', () => {
            let content = { id: 10 };
            spyOn(adapterBase, 'trigger');
            adapterBase.updated(content);
            expect(adapterBase.trigger).toHaveBeenCalledWith('updated', content);
        });

    });

});