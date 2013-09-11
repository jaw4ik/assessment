@CUDObjective
Feature: CUDObjective
	As an author I can define by creating new Learning Objective
	 what learner's behavior and how will be changed after getting Experience that will include this Learning Objective,
	  so I do not create content not related to the learning objectives. 


Background:
Given clear data context


Scenario: Add objective action on objective list page navigates to create objective view
When open page by url 'http://localhost:5656/#objectives'
And press add new objective button on objective list page
Then browser navigates to url 'http://localhost:5656/#objective/create'