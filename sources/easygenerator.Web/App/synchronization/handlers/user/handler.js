define(['synchronization/handlers/user/eventHandlers/upgradedToStarter', 'synchronization/handlers/user/eventHandlers/upgradedToPlus', 'synchronization/handlers/user/eventHandlers/downgraded', 'synchronization/handlers/user/eventHandlers/upgradedToAcademy', 'synchronization/handlers/user/eventHandlers/upgradedToAcademyBT'],
    function (upgradedToStarter, upgradedToPlus, downgraded, upgradedToAcademy, upgradedToAcademyBT) {
        "use strict";

        return {
            upgradedToStarter: upgradedToStarter,
            upgradedToPlus: upgradedToPlus,
            upgradedToAcademy: upgradedToAcademy,
            upgradedToAcademyBT: upgradedToAcademyBT,
            downgraded: downgraded
        }
    }
);