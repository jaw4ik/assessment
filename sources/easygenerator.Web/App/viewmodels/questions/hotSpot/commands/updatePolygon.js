define(['http/httpWrapper'], function (httpWrapper) {

    return {
        execute: function (id, points) {
            return httpWrapper.post('/api/question/hotspot/polygon/update', { hotspotPolygonId: id, points: JSON.stringify(points) });
        }
    }

})