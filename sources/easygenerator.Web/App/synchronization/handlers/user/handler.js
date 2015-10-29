define(['synchronization/handlers/user/eventHandlers/upgradedToStarter', 'synchronization/handlers/user/eventHandlers/upgradedToPlus', 'synchronization/handlers/user/eventHandlers/downgraded', 'synchronization/handlers/user/eventHandlers/upgradedToAcademy'],
    function (upgradedToStarter, upgradedToPlus, downgraded, upgradedToAcademy) {
        "use strict";

        return {
            upgradedToStarter: upgradedToStarter,
            upgradedToPlus: upgradedToPlus,
            upgradedToAcademy: upgradedToAcademy,
            downgraded: downgraded
        }
    }
);