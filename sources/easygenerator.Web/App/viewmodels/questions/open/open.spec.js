﻿define(function (require) {
	"use strict";

	var
        viewModel = require('viewmodels/questions/open/open'),
        localizationManager = require('localization/localizationManager');

	describe('[open question]', function () {

		beforeEach(function () {
			spyOn(localizationManager, 'localize').and.callFake(function(arg) {
			    return arg === 'openContentEditor' ? 'title' : '';
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

			describe('should return promise and promise', function () {
				it('should be an object', function (done) {
					var promise = viewModel.initialize();
					promise.then(function (result) {
						expect(result).toBeObject();
						done();
					});
				});

				it('should contain  isQuestionContentNeeded property with value true', function (done) {
					var promise = viewModel.initialize();
					promise.then(function (result) {
					    expect(result. isQuestionContentNeeded).toBeTruthy();
						done();
					});
				});

				it('should contain viewCaption with correct title', function (done) {
					var promise = viewModel.initialize();
					promise.then(function (result) {
						expect(result.viewCaption).toBe('title');
						done();
					});
				});
			});

		});

	});

});