define([
    'viewmodels/questions/dragAndDrop/dropspot',
    'viewmodels/questions/dragAndDrop/dropspotToAdd',
    'viewmodels/questions/dragAndDrop/commands/changeBackground',
    'viewmodels/questions/dragAndDrop/commands/addDropspot',
    'viewmodels/questions/dragAndDrop/commands/removeDropspot',
    'imageUpload',
    'notify'
], function (Dropspot, dropspotToAdd, changeBackgroundCommand, addDropspotCommand, removeDropspotCommand, imageUpload, notify) {

    var designer = {
        background: ko.observable(),
        uploadBackground: uploadBackground,

        dropspotToAdd: dropspotToAdd,

        dropspots: ko.observableArray(),
        addDropspot: addDropspot,
        removeDropspot: removeDropspot
    };

    return designer;

    function uploadBackground() {
        imageUpload.upload({
            success: function (url) {
                designer.background(url);
                notify.saved();
            }
        });
    }

    function addDropspot() {
        if (!designer.dropspotToAdd.isValid()) {
            designer.dropspotToAdd.clear();
            designer.dropspotToAdd.hide();
            return;
        }

        addDropspotCommand.execute().then(function () {
            designer.dropspots.push(new Dropspot(designer.dropspotToAdd()));
            designer.dropspotToAdd.clear();
            designer.dropspotToAdd.hide();
            notify.saved();
        });
    }

    function removeDropspot(dropspot) {
        removeDropspotCommand.execute().then(function () {
            designer.dropspots.remove(dropspot);
            notify.saved();
        });
    }

});