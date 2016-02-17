import localizationManager from './localizationManager';

import jsonReader from 'jsonReader';
var translations = localizationManager.translations;

describe('localizationManager', function () {

    afterEach(function () {
        localizationManager.translations = translations;
    });

    it('should be object', function () {
        expect(localizationManager).toBeObject();
    });

    describe('currentCulture:', function () {
        it('should be defined', function () {
            expect(localizationManager.currentCulture).toBeDefined();
        });
    });

    describe('language:', function () {
        it('should be defined', function () {
            expect(localizationManager.currentLanguage).toBeDefined();
        });
    });

    describe('initialize', function () {
        var readJson;

        beforeEach(function () {
            readJson = Q.defer();
            spyOn(jsonReader, 'read').and.returnValue(readJson.promise);
        });

        it('should be function', function () {
            expect(localizationManager.initialize).toBeFunction();
        });

        describe('when userCultures is not specified', function () {

            it('should set \'en\' as the default language', function () {
                localizationManager.initialize();
                expect(localizationManager.currentLanguage).toBe('en');
            });

        });

        describe('when userCultures is not an array', function () {

            it('should set \'en\' as the default language', function () {
                localizationManager.initialize('');
                expect(localizationManager.currentLanguage).toBe('en');
            });

        });

        describe('when user has not supported cultures', function () {

            it('should set \'en\' as the default language', function () {
                localizationManager.initialize(['not supported']);
                expect(localizationManager.currentLanguage).toEqual("en");
            });

            describe('but culture language is supported', function () {
                it('should set culture by language', function() {
                    localizationManager.initialize(['uk-not_supported']);
                    expect(localizationManager.currentCulture).toEqual("uk");
                });
            });
        });

        describe('when user has several cultures', function() {
            it('should set first supported culture', function () {
                localizationManager.initialize(['ru-RU', 'uk', 'en']);
                expect(localizationManager.currentLanguage).toEqual('uk');
            });
        });

        describe('when user culture in different case', function() {
            it('should igonore case', function () {
                localizationManager.initialize(['PT-BR']);
                expect(localizationManager.currentLanguage).toEqual('pt');
            });
        });

        it('should set culture', function () {
            localizationManager.initialize(['pt-br']);
            expect(localizationManager.currentCulture).toBe('pt-br');
        });

        it('should set language', function () {
            localizationManager.initialize(['pt-br']);
            expect(localizationManager.currentLanguage).toBe('pt');
        });

        describe('when language location is not specified', function() {
            it('should read translations from default path', function () {
                localizationManager.initialize();
                expect(jsonReader.read).toHaveBeenCalledWith('/app/localization/lang/en.json');
            });
        });

        it('should read translations according to culture', function () {
            localizationManager.initialize(['pt-br'], 'languageLocation/');
            expect(jsonReader.read).toHaveBeenCalledWith('languageLocation/pt-br.json');
        });

        describe('when json is read', function () {
            var translations = { key1: 'value1', key2: 'value2' };

            beforeEach(function () {
                readJson.resolve(translations);
            });

            it('should set translations', function (done) {
                localizationManager.initialize();

                readJson.promise.fin(function () {
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
