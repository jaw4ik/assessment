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
			getObjectives: getObjectives,
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

		function getObjectives(allObjectives, poolOfQuestions) {
			var objectivesIds = _.chain(poolOfQuestions)
				.map(function (question) {
					return question.objectiveId;
				})
				.uniq()
				.value();

			return _.chain(allObjectives)
				.filter(function (objective) {
					return _.contains(objectivesIds, objective.id);
				})
				.each(function (objective) {
					objective.questions = _.intersection(objective.questions, poolOfQuestions);
				})
				.value();
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