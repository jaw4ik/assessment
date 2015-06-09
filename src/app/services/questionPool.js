(function () {
	"use strict";

	angular.module('quiz')
		.service('questionPool', questionPool);

	questionPool.$inject = ['settings'];

	function questionPool(settings) {
		var self = {
			isRefreshed: false
		};

		return {
			getQuestions: getQuestions,
			isRefreshed: isRefreshed,
			refresh: refresh
		};

		function getQuestions(allQuestions) {
			self.isRefreshed = false;

			var questionPool = allQuestions;
			if (settings.questionPool.randomizeOrder) {
				questionPool = _.shuffle(questionPool);
			}
			if (settings.questionPool.mode === 'subset') {
				questionPool = _.first(questionPool, settings.questionPool.subsetSize);
			}

			return questionPool;
		}

		function isRefreshed() {
			return self.isRefreshed;
		}

		function refresh() {
			if (settings.questionPool.randomizePerAttempt) {
				self.isRefreshed = true;
			}
		}
	}

})();