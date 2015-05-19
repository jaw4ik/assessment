define(['durandal/system', 'constants', 'viewmodels/learningContents/components/polygonModel'], function (system, constants, PolygonModel) {
    'use strict';
    var templates = {
        hotspotWrapper: '<span data-type="' + constants.learningContentsTypes.hotspot + '" class="hotspotOnImage" style="position: relative;display: inline-block;max-width: 100%"><img src="{url}" alt="" style="max-width:100%" /></span>',
        spotWrapper: '<span class="spot" style="position: absolute; display: inline-block;" data-text=""></span>'
    };

    return {
        getHotspot: getHotspot,
        getImageUrl: getImageUrl,
        getPolygons: getPolygons,

        createSpot: createSpot,
        removeSpot: removeSpot,
        updateSpot: updateSpot,

        updateImage: updateImage
    };

    function getHotspot(url) {
        return templates.hotspotWrapper.replace('{url}', url);
    }

    function getImageUrl(html) {
        var $output = $(html);
        var $img = $output.find('img');
        return $img.attr('src');
    }

    function createSpot(html, points) {
        var $output = $('<output>');
        $output.html(html);

        var $spotWrapper = $('.hotspotOnImage', $output),
            $spot = $(templates.spotWrapper),
            minMaxCoords = getMinMaxCoords(points);
        $spot.width(minMaxCoords.maxX - minMaxCoords.minX)
            .height(minMaxCoords.maxY - minMaxCoords.minY)
            .attr('data-id', system.guid())
            .css('top', minMaxCoords.minY)
            .css('left', minMaxCoords.minX);
        $spotWrapper.append($spot);
        return $output.html();
    }

    function removeSpot(html, id) {
        var $output = $('<output>');
        $output.html(html);
        var $spotWrapper = $('.hotspotOnImage', $output),
            $spot = $('[data-id="' + id + '"]', $spotWrapper);
        $spot.remove();
        return $output.html();
    }
    
    function updateSpot(html, id, text, points) {
        var $output = $('<output>');
        $output.html(html);

        var $spotWrapper = $('.hotspotOnImage', $output),
            $spot = $('[data-id="' + id + '"]', $spotWrapper),
            minMaxCoords = getMinMaxCoords(points);

        $spot.width(minMaxCoords.maxX - minMaxCoords.minX)
            .height(minMaxCoords.maxY - minMaxCoords.minY)
            .attr('data-text', text)
            .css('top', minMaxCoords.minY)
            .css('left', minMaxCoords.minX);
        return $output.html();
    }

    function getPolygons(html, updateCallback) {
        var $output = $(html);
        var $spots = $output.find('[data-id]');
        var spots = [];
        $spots.each(function (index, element) {
            var $spot = $(element),
                id = $spot.attr('data-id'),
                points = getPoints($spot[0]),
                text = $spot.attr('data-text');
            var polygon = new PolygonModel(id, points, text, updateCallback);
            spots.push(polygon);
        });
        return spots;
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
        var $img = $('img', $output);
        $img.attr('src', url);
        return $output.html();
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

});