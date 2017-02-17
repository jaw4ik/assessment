﻿import Polygon from './polygon';
import changeTypeCommand from './commands/changeType';
import changeBackgroundCommand from './commands/changeBackground';
import addPolygonCommand from './commands/addPolygon';
import removePolygonCommand from './commands/removePolygon';
import getQuestionContentById from './queries/getQuestionContentById';
import eventTracker from 'eventTracker';
import uploadImage from 'images/commands/upload';
import notify from 'notify';
import uiLocker from 'uiLocker';

var self = {
    questionId: null,
    maxWidth: 941,
    maxHeight: 785,
    events: {
        createRectangle: 'Add hotspot rectangle',
        deleteRectangle: 'Delete hotspot rectangle',
        changeType: 'Change hotspot type',
        changeBackground: 'Change hotspot background'
    }
};

var designer = {
    isMultiple: ko.observable(),
    changeType: changeType,
    background: ko.observable(),
    uploadBackground: uploadBackground,

    setToMutiple: setToMutiple,
    setToSingle: setToSingle,

    polygons: ko.observableArray(),
    addPolygon: addPolygon,
    updatePolygon: {},
    removePolygon: removePolygon,
    fitPointsIntoBounds: fitPointsIntoBounds,

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

    fitPointsIntoBounds(width, height);

    designer.background.width(width);
    designer.background.height(height);
};

designer.updatePolygon.start = function (polygon) {
    polygon.startEditing();
};

designer.updatePolygon.end = function (polygon, points) {
    if (polygon.isDeleted) {
        designer.polygons.remove(polygon);
    }

    if (points && points.length > 2) {
        polygon.endEditing(points);
    }
};

export default designer;

function activate(questionId) {
    self.questionId = questionId;

    return getQuestionContentById.execute(questionId).then(function (question) {
        if (question) {
            designer.background.isLoading(true);
            designer.isMultiple(question.isMultiple);
            designer.background(question.background);
            designer.polygons(_.map(question.polygons, function (polygon) {
                return new Polygon(polygon.id, JSON.parse(polygon.points));
            }));
        } else {
            designer.background(undefined);
            designer.polygons([]);
        }
    });
}

function setToMutiple() {
    if (designer.isMultiple()) {
        return;
    }

    designer.isMultiple(true);
    changeType();
}

function setToSingle() {
    if (!designer.isMultiple()) {
        return;
    }

    designer.isMultiple(false);
    changeType();
}

function changeType() {
    return changeTypeCommand.execute(self.questionId, ko.unwrap(designer.isMultiple)).then(function () {
        notify.saved();
        eventTracker.publish(self.events.changeType);
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

function fitPointsIntoBounds(width, height) {
    var minPolygonSize = 10;
    _.each(designer.polygons(), function (polygon) {
        var points = polygon.points();
        var polygonIsOutOfBounds = _.min(points, function (point) { return point.x; }).x > width || _.min(points, function (point) { return point.y; }).y > height;
        var dirtyPointsCount = 0;
        if (!polygonIsOutOfBounds) {
            _.each(polygon.points(), function (point) {
                if (point.x > width || point.y > height) {
                    if (point.x > width) {
                        point.x = width;
                    }
                    if (point.y > height) {
                        point.y = height;
                    }
                    dirtyPointsCount++;
                }
            });
            var polygonSizeIsValid = _.min(points, function (point) { return point.x; }).x + minPolygonSize < _.max(points, function (point) { return point.x; }).x
                                  && _.min(points, function (point) { return point.y; }).y + minPolygonSize < _.max(points, function (point) { return point.y; }).y;
            if (!polygonSizeIsValid) {
                designer.removePolygon(polygon);
            } else if (dirtyPointsCount > 0) {
                designer.updatePolygon.end(polygon, polygon.points());
            }
        } else {
            designer.removePolygon(polygon);
        }
    });
}

function addPolygon(points) {
    if (points && points.length > 2) {
        return addPolygonCommand.execute(self.questionId, points).then(function (id) {
            designer.polygons.push(new Polygon(id, points));
            notify.saved();
            eventTracker.publish(self.events.createRectangle);
            return id;
        });
    } else {
        throw "Points are invalid";
    }
}

function removePolygon(polygon) {
    removePolygonCommand.execute(self.questionId, polygon.id).then(function () {
        designer.polygons.remove(polygon);
        notify.saved();
        eventTracker.publish(self.events.deleteRectangle);
    });
}

function toggleExpand() {
    designer.isExpanded(!designer.isExpanded());
}
