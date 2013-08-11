define(['repositories/objectiveBriefRepository'],
    function (objectiveBriefRepository) {
        "use strict";

        describe('objectiveBriefRepository', function () {

            beforeEach(function () {
                var deferred = Q.defer();
                deferred.resolve({
                    objectives: [
                        { id: '', title: '', image: '', questions: [{}, {}] },
                        { id: '', title: '', image: '', questions: [{}, {}] },
                        { id: '', title: '', image: '', questions: [{}, {}] },
                        { id: '', title: '', image: '', questions: [{}, {}] },
                        { id: '', title: '', image: '', questions: [{}, {}] }
                    ]
                });
                spyOn($, 'ajax').andReturn(deferred.promise);
            });

            it('should be object', function () {
                expect(objectiveBriefRepository).toBeObject();
            });

            describe('getCollection', function () {

                it('should return promise', function () {
                    var promise = objectiveBriefRepository.getCollection();
                    expect(promise).toBePromise();
                });

                describe('when promise is resolved', function () {

                    it('should get data via http if dataSet is not ready', function () {
                        objectiveBriefRepository.invalidate();

                        var promise = objectiveBriefRepository.getCollection();

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect($.ajax).toHaveBeenCalled();
                            expect(promise.inspect().state).toEqual("fulfilled");
                            expect(promise.inspect().value.length).toEqual(5);
                        });
                    });

                    it('should not get data via http if dataSet is ready', function () {
                        objectiveBriefRepository.invalidate();

                        waitsFor(function () {
                            return objectiveBriefRepository.getCollection().isFulfilled();
                        });
                        runs(function () {
                            $.ajax.reset();

                            var promise = objectiveBriefRepository.getCollection();

                            waitsFor(function () {
                                return promise.isFulfilled();
                            });
                            runs(function () {
                                expect($.ajax).not.toHaveBeenCalled();
                                expect(promise.inspect().state).toEqual("fulfilled");
                                expect(promise.inspect().value.length).toEqual(5);
                            });
                        });

                    });

                });

            });

            describe('invalidate', function () {

                it('should force getCollection() to get data via http', function () {

                    waitsFor(function () {
                        return objectiveBriefRepository.getCollection().isFulfilled();
                    });
                    runs(function () {

                        $.ajax.reset();
                        objectiveBriefRepository.invalidate();
                        
                        var promise = objectiveBriefRepository.getCollection();

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect($.ajax).toHaveBeenCalled();
                            expect(promise.inspect().state).toEqual("fulfilled");
                            expect(promise.inspect().value.length).toEqual(5);
                        });
                    });

                });
            });

        });

    });