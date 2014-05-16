define(function (require) {
    "use strict";

    var module = require('modules/templateSettings');

    describe('module [templateSettings]', function () {

        var masteryScore;

        beforeEach(function () {
            masteryScore = 80;
        });

        it('should be defined', function () {
            expect(module).toBeDefined();
        });

        var settings = {
            masteryScore: {
                score: ''
            },
            logo: {
                url: ''
            },
            theme: {
                key: ''
            }
        };

        describe('initialize:', function () {

            it('should be function', function () {
                expect(module.initialize).toBeFunction();
            });

            it('should return promise', function () {
                expect(module.initialize()).toBePromise();
            });

            describe('masteryScore:', function() {
                
                describe('when settings mastery score is not a number', function () {

                    it('should set mastery score 100', function () {
                        settings.masteryScore.score = undefined;

                        var promise = module.initialize(settings);
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(module.masteryScore.score).toBe(100);
                        });
                    });

                });

                describe('when settings mastery score is less than 0', function () {

                    it('should set mastery score 100', function () {
                        settings.masteryScore.score = '-1';

                        var promise = module.initialize(settings);
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(module.masteryScore.score).toBe(100);
                        });
                    });

                });

                describe('when settings mastery score is more than 100', function () {

                    it('should set mastery score 100', function () {
                        settings.masteryScore.score = '101';

                        var promise = module.initialize(settings);
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(module.masteryScore.score).toBe(100);
                        });
                    });

                });

                describe('when settings have mastery score', function () {

                    it('should set mastery score', function () {
                        settings.masteryScore.score = new String(masteryScore);

                        var promise = module.initialize(settings);
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(module.masteryScore.score).toBe(masteryScore);
                        });
                    });

                });

            });

            describe('logo:', function() {
                
                var logoUrl = 'some logo url';
                module.logoUrl = logoUrl;

                describe('when settings has empty url', function () {

                    it('should not update logoUrl', function () {
                        settings.logo.url = '';

                        var promise = module.initialize(settings);
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(module.logoUrl).toBe(logoUrl);
                        });
                    });

                });

                describe('when settings has url', function () {

                    it('should update logoUrl', function () {
                        var newUrl = 'new logo url';
                        settings.logo.url = newUrl;

                        var promise = module.initialize(settings);
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(module.logoUrl).toBe(newUrl);
                        });
                    });

                });

            });

            describe('theme:', function () {

                var themeKey = 'some_theme';
                module.theme.key = themeKey;

                describe('when settings has empty key', function() {

                    it('should not update theme key', function() {
                        settings.theme.key = '';

                        var promise = module.initialize(settings);
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(module.theme.key).toBe(themeKey);
                        });
                    });

                });

                describe('when settings has theme key', function() {

                    it('should update key', function() {
                        settings.theme.key = 'new_theme';

                        var promise = module.initialize(settings);
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(module.theme.key).toBe(settings.theme.key);
                        });
                    });

                });

            });

        });

    });
});