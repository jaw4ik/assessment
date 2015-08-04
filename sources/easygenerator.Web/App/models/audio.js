﻿define(['models/entity', 'constants'],
    function (Entity, constants) {
        "use strict";

        var Audio = function (spec) {
            var obj = new Entity(spec);
            obj.title = spec.title;
            obj.vimeoId = spec.vimeoId;            

            return obj;
        };

        return Audio;
    }
);