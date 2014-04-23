define([], function () {
    "use strict";

    var viewModel = app.previewViewModel();

    describe('viewModel [preview]', function () {

        describe('isReady:', function () {
            it('should be observable', function () {
                expect(viewModel.isReady).toBeObservable();
            });
        });

        describe('previewUrl:', function () {
            it('should be observable', function () {
                expect(viewModel.previewUrl).toBeObservable();
            });
        });

        describe('buildPreviewPackage:', function () {

            var deferred, url = 'url';

            beforeEach(function () {
                deferred = $.Deferred();
                spyOn($, "ajax").and.returnValue(deferred.promise());
            });

            it('should be function', function () {
                expect(viewModel.buildPreviewPackage).toBeFunction();
            });

            describe('when url is not specified', function () {

                it('should throw exception', function () {
                    var f = function () {
                        viewModel.buildPreviewPackage(undefined);
                    };

                    expect(f).toThrow('Course preview build url is not specified');
                });
            });

            describe('when url is specified', function () {

                it('should send request to url', function () {
                    viewModel.buildPreviewPackage(url);

                    expect($.ajax).toHaveBeenCalledWith({
                        type: 'POST',
                        url: url
                    });
                });

                describe('when request failed', function () {

                    beforeEach(function (done) {
                        deferred.reject();
                        done();
                    });

                    it('should set previewUrl to \'/servererror\'', function () {
                        viewModel.buildPreviewPackage(url);
                        expect(viewModel.previewUrl()).toBe('/servererror');
                    });

                    it('should set isReady to true', function () {
                        viewModel.buildPreviewPackage(url);
                        expect(viewModel.isReady()).toBeTruthy();
                    });

                });

                describe('when request succeed', function () {
                    var resultUrl = "preview";
                    beforeEach(function (done) {
                        deferred.resolve(resultUrl);
                        done();
                    });

                    it('should set previewUrl', function () {
                        viewModel.buildPreviewPackage(url);
                        expect(viewModel.previewUrl()).toBe(resultUrl);
                    });

                    it('should set isReady to true', function () {
                        viewModel.buildPreviewPackage(url);
                        expect(viewModel.isReady()).toBeTruthy();
                    });

                });

            });

        });

    });

});