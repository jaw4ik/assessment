import $ from 'jquery';
import ko from 'knockout';
import _ from 'underscore';
import moment from 'moment';

ko.bindingHandlers.dateFromNow = {
    update: (element, valueAccessors) => {
        let $element = $(element),
            value = ko.utils.unwrapObservable(valueAccessors().value),
            updateInterval = ko.utils.unwrapObservable(valueAccessors().updateInterval) || 60000,
            autoUpdate = ko.utils.unwrapObservable(valueAccessors().autoUpdate);

        if (_.isNullOrUndefined(value) || _.isNaN(value.valueOf())) {
            return;
        }

        let date = moment(value);
        $element.text(date.fromNow());

        if (autoUpdate) {
            var interval = setInterval(() => {
                $element.text(date.fromNow());
            }, updateInterval);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                clearInterval(interval);
            });
        }
    }
};