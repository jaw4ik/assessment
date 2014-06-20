define(['synchronization/handlers/user/eventHandlers/upgradedToStarter', 'synchronization/handlers/user/eventHandlers/downgraded'],
    function (upgradedToStarter, downgraded) {
        "use strict";

        return {
            upgradedToStarter: upgradedToStarter,
            downgraded: downgraded
        }
    }
);