define([], function () {

    var dropspotToAdd = ko.observable("");

    dropspotToAdd.isVisible = ko.observable(false);
    dropspotToAdd.hasFocus = ko.observable(false);

    dropspotToAdd.show = function () {
        dropspotToAdd.isVisible(true);
        dropspotToAdd.hasFocus(true);
    }

    dropspotToAdd.hide = function () {
        dropspotToAdd.isVisible(false);
    }

    dropspotToAdd.trim = function () {
        dropspotToAdd(dropspotToAdd().trim());
    }

    dropspotToAdd.clear = function () {
        dropspotToAdd("");
    }

    dropspotToAdd.isValid = ko.computed(function () {
        var text = dropspotToAdd();
        return !_.isNullOrUndefined(text) && !_.isEmptyOrWhitespace(text);
    });

    return dropspotToAdd;
})