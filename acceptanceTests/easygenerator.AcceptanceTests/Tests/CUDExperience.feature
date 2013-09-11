@CUDExperience
Feature: CUDExperience
	As an author I can create new set of learner's experience settings and save it in form of Experience,
	 so I could build package with same set of settings several times if I need.
	As an author I can update set of learner's experience settings in existing Experience,
	 so I could build package with some specific setting adjusted.
	As an author I can delete exisitng Experience, so I do not keep not needed sets of settings.


Background:
Given clear data context


Scenario: Add experience action on experiences list page navigates to create experience view
When open page by url 'http://localhost:5656/#experiences'
And press add new experience button on experiences list page
Then browser navigates to url 'http://localhost:5656/#experience/create'
