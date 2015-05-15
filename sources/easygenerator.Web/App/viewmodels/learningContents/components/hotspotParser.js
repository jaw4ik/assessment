define([], function () {
    'use strict';
    var templates = {
        hotspotWrapper: '<span class="hotspotOnImage" style="position: relative;display: inline-block;"><img data-image="" src="{url}" alt="" /></span>',
        spotWrapper: '<span class="spot" style="position: absolute; display: inline-block;" data-text=""></span>'
    };

    return {
        getHotspot: getHotspot
    };

    function getHotspot(url) {
        return templates.hotspotWrapper.replace('{url}', url);
    }
});