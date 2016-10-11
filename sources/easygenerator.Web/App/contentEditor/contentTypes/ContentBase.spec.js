import ContentBase from './ContentBase';

import ButtonsPanelManager from './../components/ButtonsPanelManager';

describe('[ContentBase]', () => {

    describe('when inheriting class not contain activate function', () => {

        it('should throw exception', () => {
            class Content extends ContentBase {}

            expect(() => new Content()).toThrow();
        });

    });

    describe('when inheriting class not contain update function', () => {

        it('should throw exception', () => {
            class Content extends ContentBase {
                activate() {}
            }

            expect(() => new Content()).toThrow();
        });

    });

    describe('when inheriting class contains activate & update functions', () => {

        it('should not throw exception', () => {
            class Content extends ContentBase {
                activate() {}
                update() {}
            }

            expect(() => new Content()).not.toThrow();
        });

    });

    class Content extends ContentBase {
        activate() {}
        update() {}
    }

    let contentBase;
    beforeEach(() => {
        contentBase = new Content();
        spyOn(contentBase, 'trigger');
    });

    it('should has events methods', () => {
        expect(contentBase.on).toBeFunction();
        expect(contentBase.off).toBeFunction();
        expect(contentBase.trigger).toBeFunction();
    });

    it('should define buttonsPanel', () => {
        expect(contentBase.buttonsPanel).toBeInstanceOf(ButtonsPanelManager);
    });

    it('should define three default buttons', () => {
        expect(contentBase.buttonsPanel.buttons.length).toBe(3);
        expect(contentBase.buttonsPanel.buttons[0].cssClass).toBe('content-reordering-handle');
        expect(contentBase.buttonsPanel.buttons[0].resourceKey).toBe('changeOrder');
        expect(contentBase.buttonsPanel.buttons[1].cssClass).toBe('content-duplicate');
        expect(contentBase.buttonsPanel.buttons[1].resourceKey).toBe('duplicate');
        expect(contentBase.buttonsPanel.buttons[1].handler).toBeFunction();
        expect(contentBase.buttonsPanel.buttons[2].cssClass).toBe('content-delete');
        expect(contentBase.buttonsPanel.buttons[2].resourceKey).toBe('delete');
        expect(contentBase.buttonsPanel.buttons[2].handler).toBeFunction();
    });

    describe('save:', () => {

        it('should trigger save event with data', () => {
            let dataToSave = 'dataToSave';
            contentBase.save(dataToSave);
            expect(contentBase.trigger).toHaveBeenCalledWith('save', dataToSave);
        });

    });

    describe('delete:', () => {

        it('should trigger deleteContent event', () => {
            contentBase.delete();
            expect(contentBase.trigger).toHaveBeenCalledWith('deleteContent');
        });

    });

    describe('duplicate:', () => {

        it('should trigger duplicateContent event', () => {
            contentBase.duplicate();
            expect(contentBase.trigger).toHaveBeenCalledWith('duplicateContent');
        });

    });

    describe('startEditing:', () => {

        it('should trigger startEditing event', () => {
            contentBase.startEditing();
            expect(contentBase.trigger).toHaveBeenCalledWith('startEditing');
        });

    });

    describe('endEditing:', () => {

        it('should trigger endEditing event', () => {
            contentBase.endEditing();
            expect(contentBase.trigger).toHaveBeenCalledWith('endEditing');
        });

    });

});