import PanelButton from './PanelButton';

describe('[PanelButton]', () => {

    let cssClass = 'class',
        resourceKey = 'resourceKey',
        handler = () => {};

    let panelButton = new PanelButton(cssClass, resourceKey, handler);

    it('should be initialized', () => {
        expect(panelButton.cssClass).toBe(cssClass);
        expect(panelButton.resourceKey).toBe(resourceKey);
        expect(panelButton.handler).toBe(handler);
    });

});