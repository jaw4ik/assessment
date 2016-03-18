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
		'OpenQuestion',
        'ScenarioQuestion',
        'RankingText'
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
		OpenQuestion,
        ScenarioQuestion,
        RankingText
	) {
			
		var models = {
			singleSelectText: 	function (data) { return new SingleSelectText(data.sectionId, data.id, data.title, data.hasContent, data.learningContents, data.type, data.answers); },
			statement: 			function (data) { return new Statement(data.sectionId, data.id, data.title, data.hasContent, data.learningContents, data.type, data.answers); },
			singleSelectImage: 	function (data) { return new SingleSelectImage(data.sectionId, data.id, data.title, data.hasContent, data.learningContents, data.type, data.answers, data.correctAnswerId); },
			dragAndDropText: 	function (data) { return new DragAndDropText(data.sectionId, data.id, data.title, data.hasContent, data.learningContents, data.type, data.background, data.dropspots); },
			textMatching: 		function (data) { return new TextMatching(data.sectionId, data.id, data.title, data.hasContent, data.learningContents, data.type, data.answers); },
			fillInTheBlank:		function (data) { return new FillInTheBlanks(data.sectionId, data.id, data.title, data.hasContent, data.learningContents, data.type, data.answerGroups); },
			hotspot: 			function (data) { return new Hotspot(data.sectionId, data.id, data.title, data.hasContent, data.learningContents, data.type, data.background, data.spots, data.isMultiple); },
			multipleSelect: 	function (data) { return new MultipleSelectText(data.sectionId, data.id, data.title, data.hasContent, data.learningContents, data.type, data.answers); },
			openQuestion: 		function (data) { return new OpenQuestion(data.sectionId, data.id, data.title, data.hasContent, data.learningContents, data.type); },
			scenario:           function (data) { return new ScenarioQuestion(data.sectionId, data.id, data.title, data.hasContent, data.learningContents, data.type, data.projectId, data.embedCode, data.embedUrl, data.masteryScore) },
			rankingText:        function (data) { return new RankingText(data.sectionId, data.id, data.title, data.hasContent, data.learningContents, data.type, data.answers) }
		};
		
		return {
			createQuestion: function (sectionId, questionData) {
				questionData.sectionId = sectionId;
				
				if (!_.isFunction(models[questionData.type])) {
					return null;
                } else {
					return models[questionData.type](questionData);
				}
			}
		};
	}

})();