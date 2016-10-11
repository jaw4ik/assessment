ko.bindingHandlers.textWithMarkedMatches = {
    update: function (element, valueAccessor) {
        var valueForCompare = ko.unwrap(valueAccessor().valueForCompare).trim().toLowerCase();
        var startText = ko.unwrap(valueAccessor().text);

        if (valueForCompare) {
            element.innerHTML = startText.replace(new RegExp(escapeRegExp(valueForCompare), 'gi'), "<mark class='marked'>$&</mark>");
        } else {
            element.innerHTML = startText;
        }

        function escapeRegExp(str) {
            return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }
    }
};