define([], function () {

    var dropspotToAdd = ko.observable();

    dropspotToAdd.isVisible = ko.observable(false);

    dropspotToAdd.show = function () {
        dropspotToAdd.isVisible(true);
    }

    dropspotToAdd.hide = function () {
        dropspotToAdd.isVisible(false);
    }

    dropspotToAdd.clear = function () {
        dropspotToAdd(undefined);
    }

    dropspotToAdd.isValid = ko.computed(function () {
        var text = dropspotToAdd();
        return !_.isNullOrUndefined(text) && !_.isEmptyOrWhitespace(text);
    });

    return dropspotToAdd;
})