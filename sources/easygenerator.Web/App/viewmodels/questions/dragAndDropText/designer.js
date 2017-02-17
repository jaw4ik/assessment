import Dropspot from './dropspot';
import dropspotToAdd from './dropspotToAdd';
import changeBackgroundCommand from './commands/changeBackground';
import addDropspotCommand from './commands/addDropspot';
import removeDropspotCommand from './commands/removeDropspot';

import getQuestionContentById from './queries/getQuestionContentById';

import eventTracker from 'eventTracker';

import uploadImage from 'images/commands/upload';
import notify from 'notify';
import uiLocker from 'uiLocker';

var self = {
    questionId: null,
    maxWidth: 939,
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
designer.background.isLoading = ko.observable(false);
designer.background.onload = function (width, height) {
    designer.background.isLoading(false);
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

function activate(questionId) {
    self.questionId = questionId;

    return getQuestionContentById.execute(questionId).then(function (question) {
        if (question) {
            designer.background.isLoading(true);
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

async function uploadBackground(file) {
    uiLocker.lock();
    try {
        let image = await uploadImage.execute(file);
        designer.background.isLoading(true);
        var backgroundUrl = image.url + '?width=' + self.maxWidth + '&height=' + self.maxHeight;
        await changeBackgroundCommand.execute(self.questionId, backgroundUrl);
        designer.background(backgroundUrl);
        designer.background.isDirty(true);
        notify.saved();
        eventTracker.publish(self.events.changeBackground);
    } catch (e) {
        notify.error(e);
    } finally {
        uiLocker.unlock();
    }
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

export default designer;