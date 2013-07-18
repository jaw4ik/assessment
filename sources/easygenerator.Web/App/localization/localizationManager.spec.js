define(['localization/localizationManager'],
    function (localizationManager) {
        "use strict";


        describe('localizationManager', function () {

            it('should be object', function () {
                expect(localizationManager).toEqual(jasmine.any(Object));
            });

            describe('initialize', function () {

                describe('should set \'en\' as the default language', function () {
                    it('when userCultures are not specified', function () {
                        localizationManager.initialize();
                        expect(localizationManager.currentLanguage).toEqual("en");
                    });
                    it('when userCultures are not an array', function () {
                        localizationManager.initialize('ru-RU');
                        expect(localizationManager.currentLanguage).toEqual("en");
                    })
                    it('when userCultures are not supported', function () {
                        localizationManager.initialize(['ru-RU']);
                        expect(localizationManager.currentLanguage).toEqual("en");
                    });
                });

                describe('should set \'en\' as the default culture', function () {
                    it('when userCultures are not specified', function () {
                        localizationManager.initialize();
                        expect(localizationManager.currentCulture).toEqual("en");
                    });
                    it('when userCultures are not an array', function () {
                        localizationManager.initialize('ru-RU');
                        expect(localizationManager.currentCulture).toEqual("en");
                    })
                    it('when userCultures are not supported', function () {
                        localizationManager.initialize(['ru-RU']);
                        expect(localizationManager.currentCulture).toEqual("en");
                    });
                });

                it('should set first supported culture from userCultures as current', function () {
                    localizationManager.initialize(['ru-RU', 'nl-NL', 'nl']);
                    expect(localizationManager.currentCulture).toEqual("nl-NL");
                });

                it('should set first supported language from userCultures as current', function () {
                    localizationManager.initialize(['ru-RU', 'nl-NL', 'nl']);
                    expect(localizationManager.currentLanguage).toEqual("nl");
                });
            });

            describe('localize', function () {

                var resources = require('localization/resources');

                var key = "resourceKey";
                var defaultString = 'default string'

                beforeEach(function () {
                    resources[key] = {};
                    resources[key]["en"] = defaultString;
                });

                afterEach(function () {
                    delete resources[key];
                });

                it('should throw exception when resource with specified key was not found', function () {                    
                    expect(function () { localizationManager.localize('omnomnom'); }).toThrow(new Error("A resource with key omnomnom was not found"));
                });

                it('should return localized string for current language when it exists', function () {
                    var currentLanguage = 'ar';
                    var localizedString = 'localized string';
                    resources[key][currentLanguage] = localizedString;
                    localizationManager.currentLanguage = currentLanguage;

                    expect(localizationManager.localize(key)).toEqual(localizedString);
                });

                it('should return string for default language if it does not exist for current language', function () {
                    localizationManager.currentLanguage = 'ar';

                    expect(localizationManager.localize(key)).toEqual(defaultString);
                });

            });

        });

    });