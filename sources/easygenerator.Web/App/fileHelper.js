define(function () {
    "use strict";

    var fileHelper = {
        _hiddenIFrameID: 'hiddenDownloader',

        downloadFile: function (url) {
            var iframe = document.getElementById(fileHelper._hiddenIFrameID);
            if (_.isNullOrUndefined(iframe)) {
                iframe = document.createElement('iframe');
                iframe.id = fileHelper._hiddenIFrameID;
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
            }
            iframe.src = url;
        }
    };

    return fileHelper;

});