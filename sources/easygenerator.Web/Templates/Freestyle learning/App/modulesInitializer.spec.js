define(['modulesInitializer'],
    function (modulesInitializer) {

        "use strict";

        describe('viewModel [modulesInitializer]', function () {

            it('should be defined', function () {
                expect(modulesInitializer).toBeDefined();
            });

            describe('register:', function () {

                it('should be function', function () {
                    expect(modulesInitializer.register).toBeFunction();
                });

            });

            describe('init:', function () {

                it('should be function', function () {
                    expect(modulesInitializer.init).toBeFunction();
                });

                it('should return promise', function () {
                    expect(modulesInitializer.init()).toBePromise();
                });

                describe('when modules to register count is 0', function () {

                    it('should be resolved', function () {
                        expect(modulesInitializer.init()).toBeResolved();
                    });

                });

                describe('when modules to register exists', function () {

                    describe('and when modules are not loaded', function () {

                        it('should throw exception', function () {
                            var f = function () { modulesInitializer._checkAndInitModules([]); };
                            expect(f).toThrow();
                        });

                    });

                    describe('and when loaded module is not defined', function () {

                        it('should throw exception', function () {
                            var f = function () { modulesInitializer._checkAndInitModules([undefined]); };
                            expect(f).toThrow();
                        });

                    });

                    describe('and when loaded module does not have method "initialize"', function () {

                        it('should trow exception', function () {
                            var f = function () { modulesInitializer._checkAndInitModules([{}]); };
                            expect(f).toThrow();
                        });
                        
                    });

                    describe('and when loaded module have method "initialize"', function() {

                        it('it should be called', function() {
                            var someModule = {
                                initialize: function() { }
                            };
                            spyOn(someModule, 'initialize');
                            
                            var promise = modulesInitializer._checkAndInitModules([someModule]);
                            waitsFor(function() {
                                return !promise.isPending();
                            });
                            runs(function() {
                                expect(someModule.initialize).toHaveBeenCalled();
                            });
                        });

                    });

                });

            });

        });

    }
);