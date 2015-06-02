define(['http/apiHttpWrapper'], function (apiHttpWrapper) {

    return {
        execute: function (id, points) {
            return apiHttpWrapper.post('/api/question/hotspot/polygon/update', { hotspotPolygonId: id, points: JSON.stringify(points) });
        }
    }

})