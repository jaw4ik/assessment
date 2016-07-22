import ko from 'knockout';
import Events from 'durandal/events';

export const EVENT_COLORPICKER_COLOR_SELECTED = 'color:selected';

export default class ColorpickerPopover{
    constructor(value) {
        Events.includeIn(this);

        this.viewUrl = 'design/tabs/branding/interfaceColors/ColorpickerPopover.html';
        this.value = ko.observable(value || null);
        this.isVisible = ko.observable(false);
    }

    changed() {
        this.trigger(EVENT_COLORPICKER_COLOR_SELECTED, this.value());
    }
}

