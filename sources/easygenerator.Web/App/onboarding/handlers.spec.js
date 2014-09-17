define(['onboarding/handlers'], function (handlers) {
    "use strict";

    var constants = require('constants'),
        httpWrapper = require('http/httpWrapper'),
        app = require('durandal/app');

    describe('onboarding [handlers]', function () {

        var httpPostDefer;

        beforeEach(function () {
            httpPostDefer = Q.defer();
            spyOn(httpWrapper, 'post').and.returnValue(httpPostDefer.promise);

            spyOn(app, 'off');
        });

        it('should be defined', function () {
            expect(handlers).toBeDefined();
        });

        describe('courseCreated:', function () {

            it('should be function', function () {
                expect(handlers.courseCreated).toBeFunction();
            });

            it('should call api \'api/onboarding/coursecreated\'', function () {
                handlers.courseCreated();
                httpPostDefer.resolve();
                expect(httpWrapper.post).toHaveBeenCalledWith('api/onboarding/coursecreated');
            });

            describe('when request is success', function () {

                beforeEach(function () {
                    httpPostDefer.resolve();
                });

                it('should turn off event ' + constants.messages.onboarding.courseCreated, function (done) {
                    handlers.courseCreated();
                    httpPostDefer.promise.fin(function () {
                        expect(app.off).toHaveBeenCalledWith(constants.messages.onboarding.courseCreated, jasmine.any(Function));
                        done();
                    });
                });

                it('should set courseCreated.isCompleted to true', function () {
                    var tasks = {
                        courseCreated: {
                            isCompleted: ko.observable(false)
                        }
                    };
                    handlers.courseCreated.apply(tasks);
                    httpPostDefer.promise.fin(function () {
                        expect(tasks.courseCreated.isCompleted()).toBeTruthy();
                        done();
                    });
                });

            });

        });

        describe('objectiveCreated:', function () {

            it('should be function', function () {
                expect(handlers.objectiveCreated).toBeFunction();
            });

            it('should call api \'api/onboarding/objectivecreated\'', function () {
                handlers.objectiveCreated();
                httpPostDefer.resolve();
                expect(httpWrapper.post).toHaveBeenCalledWith('api/onboarding/objectivecreated');
            });

            describe('when request is success', function () {

                beforeEach(function () {
                    httpPostDefer.resolve();
                });

                it('should turn off event ' + constants.messages.objective.created, function (done) {
                    handlers.objectiveCreated();
                    httpPostDefer.promise.fin(function () {
                        expect(app.off).toHaveBeenCalledWith(constants.messages.onboarding.objectiveCreated, jasmine.any(Function));
                        done();
                    });
                });

                it('should set courseCreated.isCompleted to true', function () {
                    var tasks = {
                        objectiveCreated: {
                            isCompleted: ko.observable(false)
                        }
                    };
                    handlers.objectiveCreated.apply(tasks);
                    httpPostDefer.promise.fin(function () {
                        expect(tasks.objectiveCreated.isCompleted()).toBeTruthy();
                        done();
                    });
                });

            });

        });

        describe('contentCreated:', function () {

            it('should be function', function () {
                expect(handlers.contentCreated).toBeFunction();
            });

            it('should call api \'api/onboarding/contentcreated\'', function () {
                handlers.contentCreated();
                httpPostDefer.resolve();
                expect(httpWrapper.post).toHaveBeenCalledWith('api/onboarding/contentcreated');
            });

            describe('when request is success', function () {

                beforeEach(function () {
                    httpPostDefer.resolve();
                });

                it('should turn off event ' + constants.messages.onboarding.contentCreated, function (done) {
                    handlers.contentCreated();
                    httpPostDefer.promise.fin(function () {
                        expect(app.off).toHaveBeenCalledWith(constants.messages.onboarding.contentCreated, jasmine.any(Function));
                        done();
                    });
                });

                it('should set courseCreated.isCompleted to true', function () {
                    var tasks = {
                        contentCreated: {
                            isCompleted: ko.observable(false)
                        }
                    };
                    handlers.contentCreated.apply(tasks);
                    httpPostDefer.promise.fin(function () {
                        expect(tasks.contentCreated.isCompleted()).toBeTruthy();
                        done();
                    });
                });

            });

        });

        describe('coursePublished:', function () {

            it('should be function', function () {
                expect(handlers.coursePublished).toBeFunction();
            });

            it('should call api \'api/onboarding/coursepublished\'', function () {
                handlers.coursePublished();
                httpPostDefer.resolve();
                expect(httpWrapper.post).toHaveBeenCalledWith('api/onboarding/coursepublished');
            });

            describe('when request is success', function () {

                beforeEach(function () {
                    httpPostDefer.resolve();
                });

                it('should turn off event ' + constants.messages.onboarding.coursePublished, function (done) {
                    handlers.courseCreated();
                    httpPostDefer.promise.fin(function () {
                        expect(app.off).toHaveBeenCalledWith(constants.messages.onboarding.coursePublished, jasmine.any(Function));
                        done();
                    });
                });

                it('should set courseCreated.isCompleted to true', function () {
                    var tasks = {
                        coursePublished: {
                            isCompleted: ko.observable(false)
                        }
                    };
                    handlers.coursePublished.apply(tasks);
                    httpPostDefer.promise.fin(function () {
                        expect(tasks.coursePublished.isCompleted()).toBeTruthy();
                        done();
                    });
                });

            });

        });

        describe('createdQuestionsCount:', function () {

            it('should be function', function () {
                expect(handlers.createdQuestionsCount).toBeFunction();
            });

            it('should call api \'api/onboarding/questioncreated\'', function () {
                handlers.createdQuestionsCount();
                httpPostDefer.resolve();
                expect(httpWrapper.post).toHaveBeenCalledWith('api/onboarding/questioncreated');
            });

            describe('when request is success', function () {
                var tasks;
                beforeEach(function () {
                    httpPostDefer.resolve();
                    tasks = {
                        createdQuestionsCount: {
                            isCompleted: ko.observable(false),
                            createdQuestionsCount: ko.observable(0)
                        }
                    };
                });

                describe('when createdQuestionsCount is less 3', function () {

                    it('should increment createdQuestionsCount', function () {
                        handlers.createdQuestionsCount.apply(tasks);
                        httpPostDefer.promise.fin(function () {
                            expect(tasks.createdQuestionsCount.createdQuestionsCount()).toBe(1);
                            done();
                        });
                    });

                });

                describe('when createdQuestionsCount more or equal 3', function () {

                    it('should turn off event' + constants.messages.onboarding.createdQuestionsCount, function () {
                        handlers.createdQuestionsCount.apply(tasks);
                        tasks.createdQuestionsCount.isCompleted(true);
                        httpPostDefer.promise.fin(function () {
                            expect(app.off).toHaveBeenCalledWith(constants.messages.onboarding.createdQuestionsCount, jasmine.any(Function));
                            done();
                        });
                    });

                });

            });

        });

    });
})