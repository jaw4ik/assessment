define(['cultureInfo'], function (cultureInfo) {
    "use strict";

    describe('cultureInfo', function () {

        it('should be object', function () {
            expect(cultureInfo).toBeObject();
        });

        describe('language:', function () {
            it('should be defined', function () {
                expect(cultureInfo.language).toBeDefined();
            });
        });

        describe('translationsUrl:', function () {
            it('should be defined', function () {
                expect(cultureInfo.translationsUrl).toBeDefined();
            });
        });

        describe('initialize:', function () {

            it('should be function', function() {
                expect(cultureInfo.initialize).toBeFunction();
            });

            describe('when userCultures are not specified', function () {

                it('should set \'en\' as the default language', function () {
                    cultureInfo.initialize();
                    expect(cultureInfo.language).toBe('en');
                });

            });

            describe('when userCultures are not an array', function () {

                it('should set \'en\' as the default language', function () {
                    cultureInfo.initialize('');
                    expect(cultureInfo.language).toBe('en');
                });

            });

            describe('when userCultures are not supported', function () {

                it('should set \'en\' as the default language', function () {
                    cultureInfo.initialize(['not supported']);
                    expect(cultureInfo.language).toEqual("en");
                });

            });

            it('should set language by first supported culture', function () {
                cultureInfo.initialize(['ru-RU', 'uk', 'en']);
                expect(cultureInfo.language).toEqual('uk');
            });

            it('should igonore case of userCultures', function () {
                cultureInfo.initialize(['PT-BR']);
                expect(cultureInfo.language).toEqual('pt');
            });

            it('should set language by subculture', function () {
                cultureInfo.initialize(['en-US', 'uk']);
                expect(cultureInfo.language).toEqual('en');
            });

        });

    });

});