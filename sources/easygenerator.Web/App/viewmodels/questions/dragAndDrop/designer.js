define([
    'viewmodels/questions/dragAndDrop/dropspot',
    'viewmodels/questions/dragAndDrop/dropspotToAdd',
    'viewmodels/questions/dragAndDrop/commands/changeBackground',
    'viewmodels/questions/dragAndDrop/commands/addDropspot',
    'viewmodels/questions/dragAndDrop/commands/removeDropspot',

    'viewmodels/questions/dragAndDrop/queries/getQuestionContentById',

    'eventTracker',

    'imageUpload',
    'notify',
    'uiLocker'
], function (Dropspot, dropspotToAdd, changeBackgroundCommand, addDropspotCommand, removeDropspotCommand, getQuestionContentById, eventTracker, imageUpload, notify, uiLocker) {


    var self = {
        questionId: null,
        maxWidth: 899,
        maxHeight: 785,
        events: {
            createDropspot: 'Create dropspot',
            deleteDropspot: 'Delete dropspot',
            changeBackground: 'Change drag and drop background'
        }
    };

    var designer = {
        background: ko.observable(),
        uploadBackground: uploadBackground,

        dropspotToAdd: dropspotToAdd,

        dropspots: ko.observableArray(),
        addDropspot: addDropspot,
        removeDropspot: removeDropspot,
        dropspotEndEdit: dropspotEndEdit,

        isExpanded: ko.observable(true),
        toggleExpand: toggleExpand,

        activate: activate
    };

    designer.background.width = ko.observable();
    designer.background.height = ko.observable();
    designer.background.isDirty = ko.observable(false);
    designer.background.onload = function (width, height) {
        designer.background.width(width);
        designer.background.height(height);

        _.each(designer.dropspots(), function (dropspot) {
            if (dropspot.position.x() > width ||
                dropspot.position.y() > height ||
                dropspot.position.x() + dropspot.size.width() > width ||
                dropspot.position.y() + dropspot.size.height() > height) {
                dropspot.position.endMoveDropspot(0, 0);
            }
        });

        if (designer.dropspots() && designer.dropspots().length === 0 && designer.background.isDirty()) {
            designer.dropspotToAdd.show();
        }
    }

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
            startLoading: function () {
                uiLocker.lock();
            },
            success: function (url) {
                var backgroundUrl = url + '?width=' + self.maxWidth + '&height=' + self.maxHeight;
                changeBackgroundCommand.execute(self.questionId, backgroundUrl);
                designer.background(backgroundUrl);
                designer.background.isDirty(true);
                notify.saved();
                eventTracker.publish(self.events.changeBackground);
            },
            complete: function () {
                uiLocker.unlock();
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
            eventTracker.publish(self.events.createDropspot);
        });
    }

    function removeDropspot(dropspot) {
        removeDropspotCommand.execute(self.questionId, dropspot.id).then(function () {
            designer.dropspots.remove(dropspot);
            notify.saved();
            eventTracker.publish(self.events.deleteDropspot);
        });
    }

    function toggleExpand() {
        designer.isExpanded(!designer.isExpanded());
    }

    function dropspotEndEdit(dropspot) {
        if (!_.isNullOrUndefined(dropspot.isDeleted) && dropspot.isDeleted) {
            designer.dropspots.remove(dropspot);
        }

        if (dropspot.position.x() > designer.background.width() || dropspot.position.y() > designer.background.height() ||
            dropspot.position.x() + dropspot.size.width() > designer.background.width() || dropspot.position.y() + dropspot.size.height() > designer.background.height()) {
            dropspot.position.endMoveDropspot(0, 0);
        }
    }
});