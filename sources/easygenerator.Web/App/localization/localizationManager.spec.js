define(['localization/localizationManager'], function (localizationManager) {
    "use strict";

    var jsonReader = require('jsonReader');
    var translations = localizationManager.translations;

    describe('localizationManager', function () {

        afterEach(function() {
            localizationManager.translations = translations;
        });

        it('should be object', function () {
            expect(localizationManager).toBeObject();
        });

        describe('initialize', function () {
            var readJson;
            beforeEach(function () {
                readJson = Q.defer();
                spyOn(jsonReader, 'read').and.returnValue(readJson.promise);
            });

            describe('when userCultures are not specified', function () {

                it('should set \'en\' as the default language', function () {
                    localizationManager.initialize();
                    expect(localizationManager.currentLanguage).toEqual("en");
                });

                it('should set \'en\' as the default culture', function () {
                    localizationManager.initialize();
                    expect(localizationManager.currentCulture).toEqual("en");
                });

            });

            describe('when userCultures are not an array', function () {

                it('should set \'en\' as the default language', function () {
                    localizationManager.initialize('ru-RU');
                    expect(localizationManager.currentLanguage).toEqual('en');
                });

                it('should set \'en\' as the default culture', function () {
                    localizationManager.initialize('ru-RU');
                    expect(localizationManager.currentCulture).toEqual('en');
                });

            });

            describe('when userCultures are not supported', function () {

                it('should set \'en\' as the default language', function () {
                    localizationManager.initialize(['ru-RU']);
                    expect(localizationManager.currentLanguage).toEqual("en");
                });

                it('should set \'en\' as the default culture', function () {
                    localizationManager.initialize(['ru-RU']);
                    expect(localizationManager.currentCulture).toEqual("en");
                });

            });

            it('should set first supported culture from userCultures as current', function () {
                localizationManager.initialize(['ru-RU', 'nl-NL', 'en']);
                expect(localizationManager.currentCulture).toEqual("en");
            });

            it('should igonore case of userCultures', function () {
                localizationManager.initialize(['PT-BR']);
                expect(localizationManager.currentCulture).toEqual("pt-br");
            });

            it('should set culture by subculture', function() {
                localizationManager.initialize(['en-US', 'uk']);
                expect(localizationManager.currentCulture).toEqual("en");
            });

            it('should read current culrure json file', function() {
                localizationManager.initialize(['uk']);
                expect(jsonReader.read).toHaveBeenCalledWith('/app/localization/lang/uk.json');
            });

            describe('when get translation json', function () {
                var translations = { key1: 'value1', key2: 'value2' };

                beforeEach(function() {
                    readJson.resolve(translations);
                });

                it('should set translations', function (done) {
                    localizationManager.initialize(['uk']);

                    readJson.promise.fin(function () {
                        console.log(localizationManager.translations);
                        expect(localizationManager.translations).toBe(translations);
                        done();
                    });
                });
            });
        });

        describe('localize', function () {

            var key = "resourceKey";
            var defaultString = 'default string';

            beforeEach(function () {
                localizationManager.translations = {};
                localizationManager.translations[key] = defaultString;
            });

            afterEach(function () {
                delete localizationManager.translations;
            });

            describe('when translations are not initialized', function () {
                beforeEach(function () {
                    localizationManager.translations = null;
                });

                it('should throw exception ', function () {
                    var action = function () {
                        localizationManager.localize(key);
                    };

                    expect(action).toThrowError('Translations are not initialized.');
                });
            });

            describe('when requested key is not specified', function () {
                it('should throw exception that resource with specified key was not found', function () {
                    var action = function () {
                        localizationManager.localize('omnomnom');
                    };

                    expect(action).toThrowError('A resource with key "omnomnom" was not found');
                });
            });

            it('should return localized string', function () {
                expect(localizationManager.localize(key)).toEqual(defaultString);
            });

        });

        describe('defaultCulture:', function () {

            it('should be defined', function () {
                expect(localizationManager.defaultCulture).toBeDefined();
            });

            it('should be equal \'en\'', function () {
                expect(localizationManager.defaultCulture).toEqual('en');
            });

        });

        describe('hasKey:', function () {

            var allowedKey = 'allowedKey',
                notAllowedKey = 'notAllowedKey',
                defaultString = 'default string';

            beforeEach(function () {
                localizationManager.translations = {};
                localizationManager.translations[allowedKey] = defaultString;
            });

            it('should be function', function () {
                expect(localizationManager.hasKey).toBeFunction();
            });

            describe('when translations are not initialized', function () {
                beforeEach(function () {
                    localizationManager.translations = null;
                });

                it('should throw exception ', function () {
                    var action = function () {
                        localizationManager.hasKey(allowedKey);;
                    };

                    expect(action).toThrowError('Translations are not initialized.');
                });
            });

            describe('when localizationManager has key', function () {

                it('should return true', function () {
                    var result = localizationManager.hasKey(allowedKey);
                    expect(result).toBeTruthy();
                });

            });

            describe('when localizationManager does not has key', function () {

                it('should return false', function () {
                    var result = localizationManager.hasKey(notAllowedKey);
                    expect(result).toBeFalsy();
                });

            });

        });

    });

});