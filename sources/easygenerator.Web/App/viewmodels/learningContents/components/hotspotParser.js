define(['durandal/system', 'constants', 'widgets/hotSpotOnImageTextEditor/viewmodel'], function (system, constants, hotSpotOnImageTextEditor) {
    'use strict';
    var templates = {
        hotspotWrapper: '<span data-type="' + constants.learningContentsTypes.hotspot + '" class="hotspotOnImage" style="position: relative;display: inline-block;"><img src="{url}" alt="" /></span>',
        spotWrapper: '<span class="spot" style="position: absolute; display: inline-block;" data-text=""></span>'
    };

    var PolygonModel = function (id, points, text) {
        var that = this;
        this.id = id || system.guid();
        this.points = ko.observable(points);
        this.text = text || '';
        this.onClick = function () {
            hotSpotOnImageTextEditor.show(that.text, that.points()[0].y, that.points()[0].x, function (text) {
                that.text = text;
            });
        };
    };

    return {
        getHotspot: getHotspot,
        getImageUrl: getImageUrl,
        getPolygons: getPolygons,
        createSpots: createSpots
    };

    function getHotspot(url) {
        return templates.hotspotWrapper.replace('{url}', url);
    }

    function getImageUrl(html) {
        var $output = $(html);
        var $img = $output.find('img');
        return $img.attr('src');
    }

    function createSpots(html, polygons) {
        var $output = $('<output>');

        $output.html(html);

        var $spotWrapper = $('.hotspotOnImage', $output),
            $spots = $('.spot', $spotWrapper);

        $spots.remove();

        _.each(polygons, function (polygon) {
            var $spot = $(templates.spotWrapper),
                minMaxCoords = getMinMaxCoords(polygon.points());
            $spot.width(minMaxCoords.maxX - minMaxCoords.minX)
                .height(minMaxCoords.maxY - minMaxCoords.minY)
                .attr('data-id', polygon.id)
                .attr('data-text', polygon.text)
                .css('top', minMaxCoords.minY)
                .css('left', minMaxCoords.minX);
            $spotWrapper.append($spot);
        });
       
        return $output.html();
    }

    function getPolygons(html) {
        var $output = $(html);
        var $spots = $output.find('[data-id]');
        var spots = [];
        $spots.each(function (index, element) {
            var $spot = $(element),
                id = $spot.attr('data-id'),
                points = getPoints($spot[0]),
                text = $spot.attr('data-text');
            var polygon = new PolygonModel(id, points, text);
            spots.push(polygon);
        });
        return spots;

        function getPoints(element) {
            var width = parseInt(element.style.width),
                height = parseInt(element.style.height),
                top = parseInt(element.style.top),
                left = parseInt(element.style.left),
                points = [];

            //top-left corn
            points.push({
                x: left,
                y: top
            });
            //top-right corn
            points.push({
                x: left + width,
                y: top
            });
            //bottom-right corn
            points.push({
                x: left + width,
                y: top + height
            });
            //bottom-left corn
            points.push({
                x: left,
                y: top + height
            });

            return points;
        }
    }

    function getMinMaxCoords(points) {
        var minX = _.min(points, function (point) {
                return point.x;
            }),
            minY = _.min(points, function (point) {
                return point.y;
            }),
            maxX = _.max(points, function (point) {
                return point.x;
            }),
            maxY = _.max(points, function (point) {
                return point.y;
            });

        return {
            minX: minX.x,
            minY: minY.y,
            maxX: maxX.x,
            maxY: maxY.y
        };
    }

    function updateImage(html, url) {
        var $output = $('<output>');
        $output.html(html);
        var $spotWrapper = $('img', $output);
        $img.attr('src', url);
        return $output.html();
    }

});

    //define(['viewmodels/learningContents/hotspotOnImage/utils/polygon',
    //    'text!viewmodels/learningContents/hotspotOnImage/templates/spotWrapper.html'],
    //    function (PolygonModel, spotWrapper) {
    //        'use strict';

    //        return {
    //            getPolygons: getPolygons,
    //            getImageUrl: getImageUrl,
    //            updateImage: updateImage,
    //            generateSpot: generateSpot,
    //            updateSpot: updateSpot,
    //            removeSpot: removeSpot
    //        };

    //        function generateSpot(id, points) {
    //            var $spot = $(spotWrapper),
    //                minMaxCoords = getMinMaxCoords(points);
    //            $spot.width(minMaxCoords.maxX - minMaxCoords.minX)
    //                .height(minMaxCoords.maxY - minMaxCoords.minY)
    //                .attr('data-id', id)
    //                .css('top', minMaxCoords.minY)
    //                .css('left', minMaxCoords.minX);
    //            return $spot;
    //        }

    //        function updateSpot(id, points, $editor) {
    //            var $spot = $editor.find('[data-id="' + id + '"]'),
    //                minMaxCoords = getMinMaxCoords(points);
    //            $spot.width(minMaxCoords.maxX - minMaxCoords.minX).height(minMaxCoords.maxY - minMaxCoords.minY).css('top', minMaxCoords.minY).css('left', minMaxCoords.minX);
    //        }

    //        function removeSpot(id, $editor) {
    //            $('[data-id="' + id + '"]', $editor).remove();
    //        }

    //        function getImageUrl(html) {
    //            var $output = $(html);
    //            var $img = $output.find('[data-image]');
    //            return $img.attr('src');
    //        }

    //        function updateImage($editor, url) {
    //            var $img = $editor.find('[data-image]');
    //            $img.attr('src', url);
    //        }

    //        function getPolygons(html) {
    //            var $output = $(html);
    //            var $spots = $output.find('[data-id]');
    //            var spots = [];
    //            $spots.each(function (index, element) {
    //                var $spot = $(element);
    //                spots.push(new PolygonModel($spot.attr('data-id'), getPoints($spot[0])));
    //            });

    //            return spots;

    //            function getPoints(element) {
    //                var width = parseInt(element.style.width.replace('px', '')),
    //                    height = parseInt(element.style.height.replace('px', '')),
    //                    top = parseInt(element.style.top.replace('px', '')),
    //                    left = parseInt(element.style.left.replace('px', '')),
    //                    points = [];

    //                //top-left corn
    //                points.push({
    //                    x: left,
    //                    y: top
    //                });
    //                //top-right corn
    //                points.push({
    //                    x: left + width,
    //                    y: top
    //                });
    //                //bottom-right corn
    //                points.push({
    //                    x: left + width,
    //                    y: top + height
    //                });
    //                //bottom-left corn
    //                points.push({
    //                    x: left,
    //                    y: top + height
    //                });

    //                return points;
    //            }
    //        }

    //        function getMinMaxCoords(points) {
    //            var minX = _.min(points, function (point) {
    //                return point.x;
    //            }),
    //                minY = _.min(points, function (point) {
    //                    return point.y;
    //                }),
    //                maxX = _.max(points, function (point) {
    //                    return point.x;
    //                }),
    //                maxY = _.max(points, function (point) {
    //                    return point.y;
    //                });

    //            return {
    //                minX: minX.x,
    //                minY: minY.y,
    //                maxX: maxX.x,
    //                maxY: maxY.y
    //            };
    //        }
    //    });
