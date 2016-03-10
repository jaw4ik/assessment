import ko from 'knockout';

import styleService from './../textStyleService.js';
import { TextStyle } from './../textStyleService.js';

ko.bindingHandlers.textStyle = {
    init: (element, valueAccessor) => {
        var value = valueAccessor();

        let registration = new TextStyle(ko.unwrap(value), element);

        let subscription = null;
        if (ko.isObservable(value.isVisible)) {
            subscription = value.isVisible.subscribe(newValue => {
                if (newValue) {
                    styleService.attach(registration);
                } else {
                    styleService.detach(registration);
                }
            });
        }

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            styleService.detach(registration);
            if (subscription) {
                subscription.dispose();
            }
        });


    }
};
