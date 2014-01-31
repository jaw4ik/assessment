define(['viewmodels/introduction'], function (viewModel) {

    var router = require('plugins/router'),
        http = require('plugins/http'),
        context = require('context');

    describe('viewModel [introduction]', function () {

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('title:', function () {
            it('should be defined', function () {
                expect(viewModel.title).toBeDefined();
            });
        });

        describe('content:', function () {
            it('should be defined', function () {
                expect(viewModel.content).toBeDefined();
            });
        });

        describe('activate:', function () {
            it('should be defined', function () {
                expect(viewModel.activate).toBeFunction();
            });

            it('should return promise', function () {
                var result = viewModel.activate();
                expect(result).toBePromise();
            });

            it('should set the title of course', function() {
                context.course.title = "some title";

                viewModel.activate();
                expect(viewModel.title).toBe('"some title"');
            });

            describe('when course hasn\'t introduction', function () {
                beforeEach(function () {
                    context.course.hasIntroductionContent = false;
                });

                it('should navigate to objectives', function () {
                    spyOn(router, 'navigate');

                    var promise = viewModel.activate();
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(router.navigate).toHaveBeenCalledWith('objectives');
                    });
                });
            });

            describe('when course has introduction', function () {
                var getDeferred;

                beforeEach(function () {
                    context.course.hasIntroductionContent = true;
                });

                it('should get content from file \'content/content.html\'', function () {
                    getDeferred = Q.defer();
                    spyOn(http, 'get').andReturn(getDeferred.promise);
                    getDeferred.resolve();

                    var promise = viewModel.activate();
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(http.get).toHaveBeenCalledWith('content/content.html');
                    });
                });

                describe('when it is possible to get content', function () {
                    beforeEach(function () {
                        getDeferred = Q.defer();
                        spyOn(http, 'get').andReturn(getDeferred.promise);
                        getDeferred.resolve('some content');
                    });

                    it('should set viewModel content property', function () {
                        var promise = viewModel.activate();
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.content).toBe('some content');
                        });
                    });
                });

                describe('it is not possible to get content', function () {
                    beforeEach(function () {
                        getDeferred = Q.defer();
                        spyOn(http, 'get').andReturn(getDeferred.promise);
                        getDeferred.reject();
                    });

                    it('should set viewModel content property to empty string', function () {
                        var promise = viewModel.activate();
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.content).toBe('');
                        });
                    });
                });
            });
        });

        describe('startCourse:', function () {
            it('should be defined', function () {
                expect(viewModel.startCourse).toBeFunction();
            });

            it('should navigate to objectives', function() {
                spyOn(router, 'navigate');

                viewModel.startCourse();
                expect(router.navigate).toHaveBeenCalledWith('objectives');
            });
        });
        
    });

});