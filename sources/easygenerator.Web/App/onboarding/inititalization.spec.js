define(['onboarding/inititalization'], function (viewModel) {
    "use strict";

    var
        httpWrapper = require('http/httpWrapper'),
        constants = require('constants'),
        app = require('durandal/app');

    describe('viewmodel [inititalization]', function () {

        var httpPostDefer;
        beforeEach(function () {
            httpPostDefer = Q.defer();
            spyOn(httpWrapper, 'post').and.returnValue(httpPostDefer.promise);

            spyOn(app, 'trigger');
            spyOn(app, 'on');
        });

        describe('getTasksList:', function () {

            it('should be function', function () {
                expect(viewModel.getTasksList).toBeFunction();
            });

        });

        describe('close:', function () {

            it('should be function', function () {
                expect(viewModel.close).toBeFunction();
            });

            it('should call api \'api/onboarding/close\'', function () {
                viewModel.close();
                httpPostDefer.resolve();
                expect(httpWrapper.post).toHaveBeenCalledWith('api/onboarding/close');
            });

            describe('when request success', function () {

                beforeEach(function () {
                    httpPostDefer.resolve();
                });

                it('should trigger event ' + constants.messages.onboarding.closed, function (done) {
                    viewModel.close().fin(function () {
                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.onboarding.closed);
                        done();
                    });
                });

            });

        });

        describe('initialize:', function () {

            it('should be function', function () {
                expect(viewModel.initialize).toBeFunction();
            });

            it('should get states', function () {
                httpPostDefer.resolve({});
                viewModel.initialize();
                expect(httpWrapper.post).toHaveBeenCalledWith('api/onboarding');
            });

            it('should set isClosed', function(done) {
                httpPostDefer.resolve({ isClosed: false });
                viewModel.initialize().fin(function () {
                    expect(viewModel.isClosed()).toBeFalsy();
                    done();
                });
            });

            describe('when courseCreated is false', function () {

                beforeEach(function () {
                    httpPostDefer.resolve({ courseCreated: false });
                });

                it('should subscribe to event ' + constants.messages.onboarding.courseCreated, function (done) {
                    viewModel.initialize().fin(function () {
                        expect(app.on).toHaveBeenCalledWith(constants.messages.onboarding.courseCreated, jasmine.any(Function), jasmine.any(Object));
                        done();
                    });
                });

            });

            describe('when objectiveCreated is false', function () {

                beforeEach(function () {
                    httpPostDefer.resolve({ objectiveCreated: false });
                });

                it('should subscribe to event ' + constants.messages.onboarding.objectiveCreated, function (done) {
                    viewModel.initialize().fin(function () {
                        expect(app.on).toHaveBeenCalledWith(constants.messages.onboarding.objectiveCreated, jasmine.any(Function), jasmine.any(Object));
                        done();
                    });
                });

            });

            describe('when contentCreated is false', function () {

                beforeEach(function () {
                    httpPostDefer.resolve({ contentCreated: false });
                });

                it('should subscribe to event ' + constants.messages.onboarding.contentCreated, function (done) {
                    viewModel.initialize().fin(function () {
                        expect(app.on).toHaveBeenCalledWith(constants.messages.onboarding.contentCreated, jasmine.any(Function), jasmine.any(Object));
                        done();
                    });
                });

            });

            describe('when createdQuestionsCount < 3', function () {

                beforeEach(function () {
                    httpPostDefer.resolve({ createdQuestionsCount: 0 });
                });

                it('should subscribe to event ' + constants.messages.onboarding.createdQuestionsCount, function (done) {
                    viewModel.initialize().fin(function () {
                        expect(app.on).toHaveBeenCalledWith(constants.messages.onboarding.createdQuestionsCount, jasmine.any(Function), jasmine.any(Object));
                        done();
                    });
                });

            });

            describe('when coursePublished is false', function () {

                beforeEach(function () {
                    httpPostDefer.resolve({ coursePublished: false });
                });

                it('should subscribe to event ' + constants.messages.onboarding.coursePublished, function (done) {
                    viewModel.initialize().fin(function () {
                        expect(app.on).toHaveBeenCalledWith(constants.messages.onboarding.coursePublished, jasmine.any(Function), jasmine.any(Object));
                        done();
                    });
                });

            });

            describe('when courseCreated is true', function () {

                beforeEach(function () {
                    httpPostDefer.resolve({ courseCreated: true });
                });

                it('should not subscribe to event ' + constants.messages.onboarding.coursePublished, function (done) {
                    viewModel.initialize().fin(function () {
                        expect(app.on).not.toHaveBeenCalledWith(constants.messages.course.created, jasmine.any(Function), jasmine.any(Object));
                        done();
                    });
                });

            });

            describe('when objectiveCreated is true', function () {

                beforeEach(function () {
                    httpPostDefer.resolve({ objectiveCreated: true });
                });

                it('should not subscribe to event ' + constants.messages.objective.created, function (done) {
                    viewModel.initialize().fin(function () {
                        expect(app.on).not.toHaveBeenCalledWith(constants.messages.objective.created, jasmine.any(Function), jasmine.any(Object));
                        done();
                    });
                });

            });

            describe('when contentCreated is true and createdQuestionsCount === 3', function () {

                beforeEach(function () {
                    httpPostDefer.resolve({ contentCreated: true, createdQuestionsCount: 4 });
                });

                it('should not subscribe to event ' + constants.messages.question.created, function (done) {
                    viewModel.initialize().fin(function () {
                        expect(app.on).not.toHaveBeenCalledWith(constants.messages.question.created, jasmine.any(Function), jasmine.any(Object));
                        done();
                    });
                });

            });

            describe('when coursePublished is true', function () {

                beforeEach(function () {
                    httpPostDefer.resolve({ coursePublished: true });
                });

                it('should not subscribe to event ' + constants.messages.onboarding.coursePublished, function (done) {
                    viewModel.initialize().fin(function () {
                        expect(app.on).not.toHaveBeenCalledWith(constants.messages.onboarding.coursePublished, jasmine.any(Function), jasmine.any(Object));
                        done();
                    });
                });

            });

        });

    });

});