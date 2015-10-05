define(['localization/localizationManager'], function (localizationManager) {
    "use strict";

    var jsonReader = require('jsonReader');
    var cultureProvider = require('localization/cultureProvider');
    var translations = localizationManager.translations;

    describe('localizationManager', function () {

        afterEach(function () {
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
                spyOn(cultureProvider, 'getCultureInfo').and.returnValue({ translationsUrl: 'cultureTranslationsUrl' });
            });

            describe('when cultureInfo is not specified', function () {

                it('should retrive cultureInfo from cultureProvider', function () {
                    localizationManager.initialize();
                    expect(cultureProvider.getCultureInfo).toHaveBeenCalled();
                });

            });

            it('should read translations by url', function () {
                localizationManager.initialize({ translationsUrl: 'translationsUrl' });
                expect(jsonReader.read).toHaveBeenCalledWith('translationsUrl');
            });

            describe('when json is read', function () {
                var translations = { key1: 'value1', key2: 'value2' };

                beforeEach(function () {
                    readJson.resolve(translations);
                });

                it('should set translations', function (done) {
                    localizationManager.initialize({ translationsUrl: 'translationsUrl' });

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