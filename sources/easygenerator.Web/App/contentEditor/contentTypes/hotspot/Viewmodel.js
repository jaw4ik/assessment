import ContentBase from './../ContentBase';

import imageUpload from 'imageUpload';
import uiLocker from 'uiLocker';
import parser from './components/hotspotParser';
import PolygonModel from './components/polygonModel';
import eventTracker from 'eventTracker';

const minPolygonSize = 10;
const events = {
    changeBackground: 'Change background of hotspot content block',
    addPolygon: 'Add rectangle in hotspot content block',
    updatePolygon: 'Resize/move rectangle in hotspot content block',
    editText: 'Edit text in hotspot content block',
    deletePolygon: 'Delete rectangle in hotspot content block'
};

export default class extends ContentBase {
    constructor() {
        super();
        let that = this;

        this.addPolygon = this.addPolygon.bind(this);
        this.updatePolygon = this.updatePolygon.bind(this);
        this.deletePolygon = this.deletePolygon.bind(this);
        this.uploadBackground = this.uploadBackground.bind(this);
        this.updateTextInHotspotContentBlock = this.updateTextInHotspotContentBlock.bind(this);
        this.endEditing = this.endEditing.bind(this);

        this.buttonsPanel.addButton('change-image', 'changeImage', this.uploadBackground, 2);

        this.polygons = ko.observableArray([]);
        this.background = ko.observable('');
        this.background.width = ko.observable();
        this.background.height = ko.observable();
        this.background.isLoading = ko.observable(false);
        this.background.subscribe(() => {
            that.background.isLoading(true);
        });
        this.background.onload = (width, height) => {
            that.background.isLoading(false);
            that.polygons.isDirty = false;

            that.fitPointsIntoBounds(width, height);
            if (that.polygons.isDirty) {
                that.updateHotspotOnAnImage();
            }
        };

        this.data = ko.observable(null);
        this.hasFocus = ko.observable(false);
        this.hasFocus.subscribe((value) => {
            if (value) {
                this.startEditing();
            } else {
                this.endEditing();
            }
        });
    }
    activate(data, justCreated) {
        if (_.isEmpty(data) && justCreated) {
            this.hasFocus(true);
        } else {
            this.update(data);
        }
    }
    update(data) {
        var viewModelData = parser.getViewModelData(data);
        this.background(viewModelData.background);
        var results = [];
        _.each(viewModelData.polygons, polygon => results.push(new PolygonModel(polygon.id, polygon.points, polygon.text, this.updateTextInHotspotContentBlock)));
        this.polygons(results);
        this.data(viewModelData);
    }

    addPolygon(points) {
        eventTracker.publish(events.addPolygon);
        let polygon = new PolygonModel('', points, '', this.updateTextInHotspotContentBlock);
        this.polygons.push(polygon);
        return polygon;
    }
    updatePolygon(id, points) {
        eventTracker.publish(events.updatePolygon);
        let polygonToUpdate = _.find(this.polygons(), polygon => polygon.id === id);
        polygonToUpdate.points(points);
    }
    deletePolygon(id) {
        eventTracker.publish(events.deletePolygon);
        let polygonToDelete = _.find(this.polygons(), polygon => polygon.id === id);
        this.polygons.remove(polygonToDelete);
        polygonToDelete.removed();
    }
    uploadBackground() {
        let that = this;
        imageUpload.upload({
            startLoading: function () {
                uiLocker.lock();
            },
            success: function (url) {
                eventTracker.publish(events.changeBackground);
                that.background(url);
                that.updateHotspotOnAnImage();
            },
            complete: function () {
                uiLocker.unlock();
            },
            abort: function() {
                if (_.isEmpty(that.background())) {
                    that.delete();
                }
            }
        });
    }
    updateHotspotOnAnImage() {
        let text = parser.updateHotspotOnAnImage(this.data(), this.background(), this.polygons());
        this.data(text);
        this.save(text);
    }
    updateTextInHotspotContentBlock() {
        eventTracker.publish(events.editText);
        this.updateHotspotOnAnImage();
    }
    fitPointsIntoBounds(width, height) {
        let that = this;
        _.each(_.clone(that.polygons()), polygon => {
            let points = polygon.points();
            let polygonIsOutOfBounds = _.min(points, point => point.x).x > width || _.min(points, point => point.y).y > height;
            let dirtyPointsCount = 0;
            if (!polygonIsOutOfBounds) {
                _.each(polygon.points(), point => {
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
                let polygonSizeIsValid = _.min(points, point => point.x).x + minPolygonSize < _.max(points, point => point.x).x
                                      && _.min(points, point => point.y).y + minPolygonSize < _.max(points, point => point.y).y;
                if (!polygonSizeIsValid) {
                    that.deletePolygon(polygon.id);
                    that.polygons.isDirty = true;
                } else if (dirtyPointsCount > 0) {
                    that.updatePolygon(polygon.id, polygon.points());
                    that.polygons.isDirty = true;
                }
            } else {
                that.deletePolygon(polygon.id);
                that.polygons.isDirty = true;
            }
        });
    }
    editingEnded() {
        this.hasFocus(false);
    }
}