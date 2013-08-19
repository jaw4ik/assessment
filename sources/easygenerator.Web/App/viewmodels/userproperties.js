define(['localization/localizationManager', 'plugins/router'],
    function (localizationManager, router) {

        var
            languages = ko.observableArray([
                { id: 'en', title: 'English' },
                { id: 'nl', title: 'Netherlands' },
                { id: 'de', title: 'German' }
            ]),
            selectedLanguage = ko.observable(),
            save = function () {
                localizationManager.currentLanguage = selectedLanguage();
                router.navigateTo("#/");
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