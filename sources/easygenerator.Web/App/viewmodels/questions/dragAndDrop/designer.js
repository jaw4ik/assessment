define([
    'viewmodels/questions/dragAndDrop/dropspot',
    'viewmodels/questions/dragAndDrop/dropspotToAdd',
    'viewmodels/questions/dragAndDrop/commands/changeBackground',
    'viewmodels/questions/dragAndDrop/commands/addDropspot',
    'viewmodels/questions/dragAndDrop/commands/removeDropspot',

    'viewmodels/questions/dragAndDrop/queries/getQuestionContentById',

    'imageUpload',
    'notify'
], function (Dropspot, dropspotToAdd, changeBackgroundCommand, addDropspotCommand, removeDropspotCommand, getQuestionContentById, imageUpload, notify) {


    var self = {
        questionId: null
    };

    var designer = {
        background: ko.observable(),
        uploadBackground: uploadBackground,

        dropspotToAdd: dropspotToAdd,

        dropspots: ko.observableArray(),
        addDropspot: addDropspot,
        removeDropspot: removeDropspot,

        isExpanded: ko.observable(true),
        toggleExpand: toggleExpand,

        activate: activate
    };

    return designer;

    function activate(questionId) {
        self.questionId = questionId;

        return getQuestionContentById.execute(questionId).then(function (question) {
            if (question) {
                designer.background(question.background);

                designer.dropspots(_.map(question.dropspots, function (dropspot) {
                    return new Dropspot(dropspot.id, dropspot.text, dropspot.x, dropspot.y);
                }));
            } else {
                designer.background(undefined);
                designer.dropspots([]);
            }
        });
    }

    function uploadBackground() {
        imageUpload.upload({
            success: function (url) {
                changeBackgroundCommand.execute(self.questionId, url);
                designer.background(url);
                notify.saved();
            }
        });
    }

    function addDropspot() {
        designer.dropspotToAdd.trim();

        if (!designer.dropspotToAdd.isValid()) {
            designer.dropspotToAdd.clear();
            designer.dropspotToAdd.hide();
            return;
        }

        addDropspotCommand.execute(self.questionId, designer.dropspotToAdd()).then(function (id) {
            designer.dropspots.push(new Dropspot(id, designer.dropspotToAdd(), 0, 0));
            designer.dropspotToAdd.clear();
            designer.dropspotToAdd.hide();
            notify.saved();
        });
    }

    function removeDropspot(dropspot) {
        removeDropspotCommand.execute(self.questionId, dropspot.id).then(function () {
            designer.dropspots.remove(dropspot);
            notify.saved();
        });
    }

    function toggleExpand() {
        designer.isExpanded(!designer.isExpanded());
    }

});