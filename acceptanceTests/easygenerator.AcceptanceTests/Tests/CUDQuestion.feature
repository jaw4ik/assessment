@CUDQuestion
Feature: CUDQuestion
	As an author I can define(create new/ update existing/ delete existing) Questions
	 that a learner has to be able to answer correctly
	 in order to prove that he has reached specific Learning Objective
	  or system could decide if a learner needs to go through more Explanations.

Background:
Given clear data context


Scenario: Add question action on objective page navigates to create question view
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
When open page by url 'http://localhost:5656/#objective/1'
And press add new question button on objective page
Then browser navigates to url 'http://localhost:5656/#objective/1/question/create'

Scenario: Create new question button on question page navigates to create question view
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
Given questions related to 'Objective1' are present in database
| Title     | Id |
| Question1 | 1  |
When open page by url 'http://localhost:5656/#objective/1/question/1'
And press create new question button on question page
Then browser navigates to url 'http://localhost:5656/#objective/1/question/create'

Scenario: Create new question text on question page navigates to create question view
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
Given questions related to 'Objective1' are present in database
| Title     | Id |
| Question1 | 1  |
When open page by url 'http://localhost:5656/#objective/1/question/1'
And click on create new question text on question page
Then browser navigates to url 'http://localhost:5656/#objective/1/question/create'

Scenario: Edit question title text block is active when open create question view
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
When open page by url 'http://localhost:5656/#objective/1/question/create'
Then edit title text block is active on create view

Scenario: Edit question title text block is empty when open create question view
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
When open page by url 'http://localhost:5656/#objective/1/question/create'
Then edit title text block is empty on create view

Scenario: Buttons CreateAndEdit and CreateAndNew are disabled if title text is empty on create question view
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
When open page by url 'http://localhost:5656/#objective/1/question/create'
Then buttons CreateAndEdit and CreateAndNew are enabled false on create view
When input 'text' into title edit area on create view
And clear edit area on create view
Then buttons CreateAndEdit and CreateAndNew are enabled false on create view

Scenario: Buttons CreateAndEdit and CreateAndNew are enabled if title text is not empty on create question view
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
When open page by url 'http://localhost:5656/#objective/1/question/create'
And input 'text' into title edit area on create view
Then buttons CreateAndEdit and CreateAndNew are enabled true on create view






