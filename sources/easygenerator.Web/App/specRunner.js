function runSpecs(env) {

    Q.stopUnhandledRejectionTracking();

    require.config({
        paths: {
            'text': '../Scripts/text',
            'durandal': '../Scripts/durandal',
            'plugins': '../Scripts/durandal/plugins',
            'transitions': '../Scripts/durandal/transitions'
        },
        urlArgs: 'v=' + Math.random()
    });

    define('jquery', function () {
        return jQuery;
    });

    define('knockout', function () {
        return ko;
    });

    require(['bootstrapper'], function (bootstrapper) {
        bootstrapper.run();


        var specs = [
            'viewmodels/questions/dragAndDrop/designer.spec',
            'viewmodels/questions/dragAndDrop/dropspot.spec',
            'viewmodels/questions/dragAndDrop/dropspotToAdd.spec',
            'viewmodels/questions/dragAndDrop/commands/addDropspot.spec',
            'viewmodels/questions/dragAndDrop/commands/removeDropspot.spec',
            'viewmodels/questions/dragAndDrop/commands/changeBackground.spec'
        ];

        require(specs, function () {
            env.execute();
        });
    });

}