define(function (require) {
	"use strict";

	var
        ctor = require('viewmodels/questions/voiceOver'),
        repository = require('repositories/questionRepository'),
        notify = require('notify')
	;

	describe('viewModel [voiceOver]', function () {

		var viewModel;
		var questionId = 'questionId',
			embed = "embed";

		beforeEach(function () {
			viewModel = ctor(questionId, embed);

			spyOn(notify, 'success');
		});

		describe('embed:', function () {

			it('should be observable', function () {
				expect(viewModel.embed).toBeObservable();
			});

			it('should be set', function () {
				expect(viewModel.embed()).toBe(embed);
			});

		});

		describe('update:', function () {
			var updateDefer;
			beforeEach(function () {
				updateDefer = Q.defer();
				spyOn(repository, 'updateVoiceOver').and.returnValue(updateDefer.promise);
				updateDefer.resolve();
			});

			it('should send response to server', function () {
				var embed = 'embed';
				viewModel.embed(embed);
				viewModel.update();
				expect(repository.updateVoiceOver).toHaveBeenCalledWith(questionId, embed);
			});

			describe('and when voice over is updated', function () {
				it('should show notification', function (done) {
					viewModel.update();
					updateDefer.promise.fin(function () {
						expect(notify.success).toHaveBeenCalled();
						done();
					});
				});
			});
		});
	});
})