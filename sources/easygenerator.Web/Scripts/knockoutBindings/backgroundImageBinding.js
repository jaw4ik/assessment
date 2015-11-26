ko.bindingHandlers.backgroundImage = {
    update: function (element, valueAccessor) {
        var src = ko.unwrap(valueAccessor());

        if (src && src.length) {
            $(element).css({
                'background-repeat': 'no-repeat',
                'background-position': 'center',
                'background-size': 'cover',
                'background-image': 'url(' + src + ')'
            });
        }
    }
};