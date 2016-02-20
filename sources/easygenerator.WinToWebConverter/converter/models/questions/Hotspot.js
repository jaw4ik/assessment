'use strict';

var Question = require('./Question');
var HotspotPolygons = require('../answers/HotspotPolygons');

class Hotspot extends Question {
    constructor(id, title, objectiveId, order) {
        super(id, title, objectiveId, order);
        this.type = Question.types.HotSpot;
        this.hotspotPolygons = [];
        this.isMultiple = true;
        this.background = '';
    }
    addHotspotPolygon(hotspotPolygon) {
        if (hotspotPolygon instanceof HotspotPolygons) {
            this.hotspotPolygons.push(hotspotPolygon);
        }
    }
}

module.exports = Hotspot;