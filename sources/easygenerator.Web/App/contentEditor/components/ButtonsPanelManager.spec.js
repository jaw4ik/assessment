import ButtonsPanelManager from './ButtonsPanelManager';

describe('[ButtonsPanelManager]', () => {

    let buttonsPanelManager = new ButtonsPanelManager();

    it('should contain buttons collection', () => {
        expect(buttonsPanelManager.buttons).toBeArray();
    });

    describe('addButton:', () => {

        it('should throw exception when cssClass is not a string', () => {
            expect(() => buttonsPanelManager.addButton(null)).toThrow('Button must have a css class.');
        });

        it('should throw exception when resourceKey is not a string', () => {
            expect(() => buttonsPanelManager.addButton('css-class', null)).toThrow('Button must have a resource key.');
        });

        let position,
            cssClass = 'class',
            resourceKey = 'resourceKey',
            binderOption = {};

        describe('when position is not defined', () => {

            beforeEach(() => {
                position = undefined;
            });

            it('should add button to the end of list', () => {
                buttonsPanelManager.buttons = [{}, {}, {}, {}, {}];
                let count = buttonsPanelManager.buttons.length;
                buttonsPanelManager.addButton(cssClass, resourceKey, binderOption, position);
                expect(buttonsPanelManager.buttons.length).toBe(count + 1);
                expect(buttonsPanelManager.buttons[buttonsPanelManager.buttons.length - 1].cssClass).toBe(cssClass);
                expect(buttonsPanelManager.buttons[buttonsPanelManager.buttons.length - 1].resourceKey).toBe(resourceKey);
                expect(buttonsPanelManager.buttons[buttonsPanelManager.buttons.length - 1].binderOption).toBe(binderOption);
            });

        });

        describe('when position is defined', () => {

            beforeEach(() => {
                position = 2;
            });

            it('should add button to the appropriate position', () => {
                buttonsPanelManager.buttons = [{}, {}, {}, {}, {}];
                let count = buttonsPanelManager.buttons.length;
                buttonsPanelManager.addButton(cssClass, resourceKey, binderOption, position);
                expect(buttonsPanelManager.buttons.length).toBe(count + 1);
                expect(buttonsPanelManager.buttons[1].cssClass).toBe(cssClass);
                expect(buttonsPanelManager.buttons[1].resourceKey).toBe(resourceKey);
                expect(buttonsPanelManager.buttons[1].binderOption).toBe(binderOption);
            });

        });

    });

});