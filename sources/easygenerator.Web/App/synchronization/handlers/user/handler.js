define(['synchronization/handlers/user/eventHandlers/upgradedToStarter', 'synchronization/handlers/user/eventHandlers/downgraded'],
    function (upgradedToStarter, downgraded) {

    return {
        upgradedToStarter: upgradedToStarter,
        downgraded: downgraded
    }
});