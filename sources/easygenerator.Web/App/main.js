import has from 'has';
import viewEngine from 'durandal/viewEngine';
import system from 'durandal/system';
import app from 'durandal/app';
import bootstrapper from 'bootstrapper';
import userContext from 'userContext';
import synchronization from 'synchronization/listener';
import onboarding from 'onboarding/initialization';
import audio from 'audio/index';
import localizationManager from 'localization/localizationManager';

// hook for system.js support
viewEngine.convertViewIdToRequirePath = function (viewId) {
    var plugin = this.viewPlugin ? '!' + this.viewPlugin : '';
    return viewId + this.viewExtension + plugin;
};
        
if (!has('release')) {
    system.debug(true);
}

app.title = "easygenerator";

app.configurePlugins({
    router: true,
    dialog: true,
    http: true,
    widget: {
        kinds: ['preloader']
    }
});

var ltiAuthDefer;

if (window.auth.isLogoutKeyPresentInHash()) {
    window.auth.logout();
    window.location.replace('/#');
}

if (window.auth.isAuthTokenPresentInHash()) {
    window.auth.logout();
    ltiAuthDefer = window.auth.loginByAuthToken().always(function () {
        window.location.replace('/#');
    }).fail(function () {
        window.location.reload();
    });
} else {
    ltiAuthDefer = Q.fcall(function () { });
}

ltiAuthDefer.then(function () {
    app.start().then(function () {
        localizationManager.initialize(window.userCultures).then(function () {
            $('html').attr('lang', localizationManager.language);

            bootstrapper.run();
                    
            return Q.all([
                userContext.identify(),
                userContext.identifyStoragePermissions(),
                synchronization.start(),
                onboarding.initialize(),
                audio.initialize()
            ]).spread(function () {
                app.setRoot('viewmodels/shell', null, document.getElementById('app'));
            });
        });
    }).done();
});