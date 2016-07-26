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
import fonts from './fonts';

// hook for system.js support
viewEngine.convertViewIdToRequirePath = function (viewId) {
    var plugin = this.viewPlugin ? '!' + this.viewPlugin : '';
    return viewId + this.viewExtension + plugin;
};
        
if (!has('release')) {
    system.debug(true);
}

app.title = 'easygenerator';

app.configurePlugins({
    router: true,
    dialog: true,
    http: true,
    widget: {
        kinds: ['preloader', 'tags', 'searchInput', 'selectPopover']
    }
});

userContext.ltiData.companyId = window.auth.getCompanyIdFromHash();
userContext.ltiData.ltiUserInfoToken = window.auth.getLtiUserInfoTokenFromHash();
userContext.samlData.samlIdPUserInfoToken = window.auth.getSamlIdPUserInfoTokenFromHash();

(async () => {
    if (window.auth.isAuthTokenPresentInHash()) {
        await window.auth.logout();
        try {
            await window.auth.loginByAuthToken();
            window.location.replace('/#');
        } catch (reason) {
            window.location.reload();
            return;
        }
    }

    await handleExternalUser('ltiUserInfoToken', 'token.user.lti', userContext.ltiData.ltiUserInfoToken, userContext.identifyLtiUser);
    await handleExternalUser('samlIdPUserInfoToken', 'token.user.saml', userContext.samlData.samlIdPUserInfoToken, userContext.identifySamlUser);

    await app.start();
    await localizationManager.initialize(window.userCultures);

    $('html').attr('lang', localizationManager.language);
    bootstrapper.run();

    await* [
        fonts.load(['Open+Sans:400,400italic,300italic,300,600,600italic:latin,cyrillic-ext', 'Droid+Sans+Mono::latin']),
        userContext.identify(),
        userContext.identifyStoragePermissions(),
        synchronization.start(),
        onboarding.initialize(),
        audio.initialize()
    ];

    app.setRoot('viewmodels/shell', null, document.getElementById('app'));

    async function handleExternalUser(tokenName, tokenHashName, token, action) {
        if (!token) {
            return;
        }
        try {
            await action();
        } catch (reason) {
            if (!reason || !reason.logout) {
                window.location.replace('/#');
                return;
            }
            await window.auth.logout();
            if (reason[tokenName]) {
                window.location.replace(`/signin#${tokenHashName}=${encodeURIComponent(reason[tokenName])}`);
                return;
            }
            window.location.replace('/#signin');
            return;
        }
    }
})();