import $ from 'jquery';
import ko from 'knockout';
import _ from 'underscore';
import moment from 'moment';

ko.bindingHandlers.date = {
    update: (element, valueAccessors) => {
        let language = ko.utils.unwrapObservable(valueAccessors().language) || 'en';
        let value = ko.utils.unwrapObservable(valueAccessors().value);
        let formatString = valueAccessors().formatString;

        if (_.isNullOrUndefined(value) || _.isNaN(value.valueOf())) {
            return;
        }

        let date = moment(value);
        date.locale(language);
        if (_.isNull(formatString)) {
            $(element).text(date.format('DD/MM/YY'));
        } else {
            $(element).text(date.format(formatString));
        }
    }
};