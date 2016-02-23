(function () {
	"use strict";
	
    angular.module('assessment')
		.factory('viewmodelsFactory', viewmodelsFactory);
		
	viewmodelsFactory.$inject = [
        'SingleSelectTextViewModel', 
        'StatementViewModel', 
		'SingleSelectImageViewModel', 
		'DragAndDropTextViewModel',
		'TextMatchingViewModel', 
		'FillInTheBlanksViewModel', 
		'HotspotViewModel', 
		'MultipleSelectTextViewModel', 
		'OpenQuestionViewModel',
        'ScenarioQuestionViewModel',
        'RankingTextViewModel'
	];
		
	function viewmodelsFactory (
		SingleSelectTextViewModel, 
        StatementViewModel, 
		SingleSelectImageViewModel, 
		DragAndDropTextViewModel,
		TextMatchingViewModel, 
		FillInTheBlanksViewModel, 
		HotspotViewModel, 
		MultipleSelectTextViewModel, 
		OpenQuestionViewModel,
        ScenarioQuestionViewModel,
        RankingTextViewModel
	) {
	
		var viewmodels = {
			singleSelectText: 	SingleSelectTextViewModel,
			statement: 			StatementViewModel,
			singleSelectImage: 	SingleSelectImageViewModel,
			dragAndDropText: 	DragAndDropTextViewModel,
			textMatching: 		TextMatchingViewModel,
			fillInTheBlank:		FillInTheBlanksViewModel,
			hotspot: 			HotspotViewModel,
			multipleSelect: 	MultipleSelectTextViewModel,
			openQuestion:       OpenQuestionViewModel,
			scenario:           ScenarioQuestionViewModel,
            rankingText:        RankingTextViewModel
		};
		
		return {
		    createQuestionViewmodel: function (question) {
				if (!_.isFunction(viewmodels[question.type])) {
					throw 'Unknown question type';
				}
				return new viewmodels[question.type](question);
			}
		};
	}
	
})();