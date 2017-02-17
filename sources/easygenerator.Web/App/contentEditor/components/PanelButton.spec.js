import PanelButton from './PanelButton';

describe('[PanelButton]', () => {

    let cssClass = 'class',
        resourceKey = 'resourceKey',
        binderOption = {};

    let panelButton = new PanelButton(cssClass, resourceKey, binderOption);

    it('should be initialized', () => {
        expect(panelButton.cssClass).toBe(cssClass);
        expect(panelButton.resourceKey).toBe(resourceKey);
        expect(panelButton.binderOption).toBe(binderOption);
    });

});