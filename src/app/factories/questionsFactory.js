(function () {
	"use strict";

    angular.module('assessment')
		.factory('questionsFactory', questionsFactory);

	questionsFactory.$inject = [
		'SingleSelectText',
		'MultipleSelectText',
		'TextMatching',
		'DragAndDropText',
		'Statement',
		'SingleSelectImage',
		'FillInTheBlanks',
		'Hotspot',
		'OpenQuestion'
	];

	function questionsFactory (
		SingleSelectText,
		MultipleSelectText,
		TextMatching,
		DragAndDropText,
		Statement,
		SingleSelectImage,
		FillInTheBlanks,
		Hotspot,
		OpenQuestion
	) {
			
		var models = {
			singleSelectText: 	function (data) { return new SingleSelectText(data.objectiveId, data.id, data.title, data.hasContent, data.learningContents, data.type, data.answers); },
			statement: 			function (data) { return new Statement(data.objectiveId, data.id, data.title, data.hasContent, data.learningContents, data.type, data.answers); },
			singleSelectImage: 	function (data) { return new SingleSelectImage(data.objectiveId, data.id, data.title, data.hasContent, data.learningContents, data.type, data.answers, data.correctAnswerId); },
			dragAndDropText: 	function (data) { return new DragAndDropText(data.objectiveId, data.id, data.title, data.hasContent, data.learningContents, data.type, data.background, data.dropspots); },
			textMatching: 		function (data) { return new TextMatching(data.objectiveId, data.id, data.title, data.hasContent, data.learningContents, data.type, data.answers); },
			fillInTheBlank:		function (data) { return new FillInTheBlanks(data.objectiveId, data.id, data.title, data.hasContent, data.learningContents, data.type, data.answerGroups); },
			hotspot: 			function (data) { return new Hotspot(data.objectiveId, data.id, data.title, data.hasContent, data.learningContents, data.type, data.background, data.spots, data.isMultiple); },
			multipleSelect: 	function (data) { return new MultipleSelectText(data.objectiveId, data.id, data.title, data.hasContent, data.learningContents, data.type, data.answers); },
			openQuestion: 		function (data) { return new OpenQuestion(data.objectiveId, data.id, data.title, data.hasContent, data.learningContents, data.type); }
		};
		
		return {
			createQuestion: function (objectiveId, questionData) {
				questionData.objectiveId = objectiveId;
				
				if (!_.isFunction(models[questionData.type])) {
					return null;
                } else {
					return models[questionData.type](questionData);
				}
			}
		};
	}

})();