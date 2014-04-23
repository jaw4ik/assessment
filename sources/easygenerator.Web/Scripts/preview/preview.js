var app = app || {};

app.previewViewModel = function () {

    var isReady = ko.observable(false),
        previewUrl = ko.observable('#'),

        buildPreviewPackage = function (url) {
            if (_.isNullOrUndefined(url)) {
                throw 'Course preview build url is not specified';
            }

            var that = this;

            $.ajax({
                type: 'POST',
                url: url
            })
            .done(function (dataUrl) {
                that.previewUrl(dataUrl);
            })
            .fail(function () {
                that.previewUrl('/servererror');
            })
            .always(function () {
                that.isReady(true);
            });
        };

    return {
        isReady: isReady,
        previewUrl: previewUrl,
        buildPreviewPackage: buildPreviewPackage
    };
};