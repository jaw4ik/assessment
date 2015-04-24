define(['synchronization/handlers/user/eventHandlers/upgradedToStarter', 'synchronization/handlers/user/eventHandlers/upgradedToPlus', 'synchronization/handlers/user/eventHandlers/downgraded'],
    function (upgradedToStarter, upgradedToPlus, downgraded) {
        "use strict";

        return {
            upgradedToStarter: upgradedToStarter,
            upgradedToPlus: upgradedToPlus,
            downgraded: downgraded
        }
    }
);