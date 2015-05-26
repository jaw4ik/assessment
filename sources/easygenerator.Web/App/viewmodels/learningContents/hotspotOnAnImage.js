define(['knockout', 'viewmodels/learningContents/content', 'viewmodels/learningContents/components/hotspotParser',
        'imageUpload', 'uiLocker', 'viewmodels/learningContents/components/polygonModel'],
    function (ko, Content, parser, imageUpload, uiLocker, PolygonModel) {
        "use strict";

        var viewModel = function (learningContent, questionId, questionType) {
            var that = this;
            Content.call(this, learningContent, questionId, questionType);

            this.polygons = ko.observableArray([]);

            this.background = ko.observable('');

            this.background.width = ko.observable();
            this.background.height = ko.observable();
            this.background.onload = function (width, height) {
                fitPointsIntoBounds(width, height);
                that.save();
            };

            this.addPolygon = function (points) {
                var polygon = new PolygonModel('', points, '', that.save);
                that.polygons.push(polygon);
                return polygon;
            };

            this.updatePolygon = function (id, points) {
                var polygonToUpdate = _.find(that.polygons(), function (polygon) {
                    return id == polygon.id;
                });

                polygonToUpdate.points(points);
            };

            this.deletePolygon = function (id) {
                var polygonToDelete = _.find(that.polygons(), function (polygon) {
                    return id == polygon.id;
                });
                that.polygons.remove(polygonToDelete);
            };

            this.uploadBackground = function () {
                imageUpload.upload({
                    startLoading: function () {
                        uiLocker.lock();
                    },
                    success: function (url) {
                        that.background(url);
                    },
                    complete: function () {
                        uiLocker.unlock();
                    }
                });
            };

            this.save = function () {
                that.text(parser.updateHotspotOnAnImage(that.text, that.background, that.polygons));
                that.updateText();
            };

            if (_.isEmpty(this.id())) {
                this.uploadBackground();
            } else {
                var data = parser.getViewModelData(this.text());
                this.background(data.background);
                _.each(data.polygons, function (polygon) {
                    that.polygons.push(new PolygonModel(polygon.id, polygon.points, polygon.text, that.save));
                });
            }

            function fitPointsIntoBounds(width, height) {
                var minPolygonSize = 10;
                _.each(that.polygons(), function (polygon) {
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
                            that.deletePolygon(polygon.id);
                        } else if (dirtyPointsCount > 0) {
                            that.updatePolygon(polygon.id, polygon.points());
                        }
                    } else {
                        that.deletePolygon(polygon.id);
                    }
                });
            }
        };

        return viewModel;
    }
);