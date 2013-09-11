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

