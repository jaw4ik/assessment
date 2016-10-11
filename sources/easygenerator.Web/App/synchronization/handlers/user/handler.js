define(['./eventHandlers/upgradedToStarter', './eventHandlers/upgradedToPlus', './eventHandlers/downgraded', './eventHandlers/upgradedToAcademy',
    './eventHandlers/upgradedToAcademyBT', './eventHandlers/upgradedToTrial'],
    function (upgradedToStarter, upgradedToPlus, downgraded, upgradedToAcademy, upgradedToAcademyBT, upgradedToTrial) {
        "use strict";

        return {
            upgradedToStarter: upgradedToStarter,
            upgradedToPlus: upgradedToPlus,
            upgradedToAcademy: upgradedToAcademy,
            upgradedToAcademyBT: upgradedToAcademyBT,
            downgraded: downgraded,
            upgradedToTrial: upgradedToTrial
        }
    }
);