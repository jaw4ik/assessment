define(['localization/localizationManager', 'plugins/router'],
    function (localizationManager, router) {

        var
            languages = ko.observableArray([
                { id: 'en', title: 'English' },
                { id: 'nl', title: 'Nederland' },
                { id: 'de', title: 'Deutsch' }
            ]),
            selectedLanguage = ko.observable(),
            save = function () {
                localizationManager.currentLanguage = selectedLanguage();
                router.navigate("");
            },

            activate = function () {
                selectedLanguage(localizationManager.currentLanguage);
            };

        return {
            languages: languages,
            selectedLanguage: selectedLanguage,
            save: save,

            activate: activate
        };
    }
);