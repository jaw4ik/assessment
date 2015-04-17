define(function (require) {
	"use strict";

	var
        viewModel = require('viewmodels/questions/open/open'),
        localizationManager = require('localization/localizationManager');

	describe('[open question]', function () {

		beforeEach(function () {
			spyOn(localizationManager, 'localize').and.callFake(function(arg) {
			    return arg;
			});
		});

		describe('initialize:', function () {

			it('should be function', function () {
				expect(viewModel.initialize).toBeFunction();
			});

			it('should return promise', function () {
				var result = viewModel.initialize();
				expect(result).toBePromise();
			});

			describe('promise result: ', function () {

				it('should be an object', function (done) {
					var promise = viewModel.initialize();
					promise.then(function (result) {
						expect(result).toBeObject();
						done();
					});
				});

				it('should contain \'openQuestionEditor\' viewCaption', function (done) {
					var promise = viewModel.initialize();
					promise.then(function (result) {
					    expect(result.viewCaption).toBe('openQuestionEditor');
						done();
					});
				});

				it('should have hasQuestionView property with true value', function (done) {
				    var promise = viewModel.initialize();
				    promise.then(function (result) {
				        expect(result.hasQuestionView).toBeFalsy();
				        done();
				    });
				});

				it('should have hasQuestionContent property with true value', function (done) {
				    var promise = viewModel.initialize();
				    promise.then(function (result) {
				        expect(result.hasQuestionContent).toBeTruthy();
				        done();
				    });
				});

				it('should have hasFeedback property with true value', function (done) {
				    var promise = viewModel.initialize();
				    promise.then(function (result) {
				        expect(result.hasFeedback).toBeTruthy();
				        done();
				    });
				});

				it('should have showGeneralFeedback property with true value', function (done) {
				    var promise = viewModel.initialize();
				    promise.then(function (result) {
				        expect(result.showGeneralFeedback).toBeTruthy();
				        done();
				    });
				});
			});

		});

	});

});