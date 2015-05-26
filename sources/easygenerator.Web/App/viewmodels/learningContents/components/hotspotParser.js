define(['durandal/system', 'constants', 'viewmodels/learningContents/components/polygonModel'], function (system, constants, PolygonModel) {
    'use strict';
    var templates = {
            hotspotWrapper: '<span data-type="' + constants.learningContentsTypes.hotspot + '" class="hotspotOnImage" style="position: relative;display: inline-block;max-width: 100%"><img src="{url}" alt="" style="max-width:100%" />{spots}</span>',
            spotWrapper: '<span class="spot" style="position: absolute; display: inline-block;" data-text=""></span>'
        },
        attributes = {
            dataId: 'data-id',
            dataText: 'data-text',
            src: 'src'
        };

    return {
        getViewModelData: getViewModelData,
        updateHotspotOnAnImage: updateHotspotOnAnImage,
    };

    function updateHotspotOnAnImage(data, background, polygons) {
        if (_.isEmpty(data())) {
            return templates.hotspotWrapper.replace('{url}', background());
        }

        var $newData = $(templates.hotspotWrapper.replace('{url}', background()));

        _.each(polygons(), function (polygon) {
            var id = polygon.id,
                text = polygon.text,
                minMaxCoords = getMinMaxCoords(polygon.points()),
                width = minMaxCoords.maxX - minMaxCoords.minX,
                height = minMaxCoords.maxY - minMaxCoords.minY,
                top = minMaxCoords.minY,
                left = minMaxCoords.minX,
                $spot = $(templates.spotWrapper);
            $spot.attr(attributes.dataId, id).attr(attributes.dataText, text)
                .width(width).height(height)
                .css('top', top).css('left', left);
            $newData.append($spot);
        });

        return $('<div>').append($newData).html();
    }

    function getViewModelData(data) {
        var $data = $(data),
            $spots = $data.find('[' + attributes.dataId + ']'),
            background = $data.find('img').attr(attributes.src),
            polygons = [];

        $spots.each(function (index, element) {
            var $spot = $(element),
                id = $spot.attr(attributes.dataId),
                points = getPoints($spot[0]),
                text = $spot.attr(attributes.dataText);
            var polygon = {
                id: id,
                points: points,
                text: text
            };
            polygons.push(polygon);
        });
        return {
            background: background,
            polygons: polygons
        };
    }

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

});