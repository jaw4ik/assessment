define([], function () {

    var download = function (experienceId) {
        var downloadUrl = window.location.href.replace(window.location.hash, 'download/' + experienceId + '.zip');
        window.location.assign(downloadUrl);
    };

    return {
        download: download
    };
});