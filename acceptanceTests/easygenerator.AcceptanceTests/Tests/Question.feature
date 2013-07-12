@Question
Feature: Question
	As an author I can see content of open Question, so I can check if it is enough to check/provide a learner's knowledge. 

Background: 
When open page by url 'http://localhost:5656'
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
Given questions related to 'Objective1' are present in database
| Title      | Id |
| Question11 | 1  |
| Question12 | 2  |
| Question13 | 3  |
Given answer options related to 'Question1' are present in database
| Title          |
| AnswerOption11 |
| AnswerOption12 |
| AnswerOption13 |
Given answer options related to 'Question2' are present in database
| Title          |
| AnswerOption21 |
| AnswerOption22 |
| AnswerOption23 |
Given explanations related to 'Question1' are present in database
| Title         |
| Explanation11 |
| Explanation12 |
| Explanation13 |
Given explanations related to 'Question2' are present in database
| Title         |
| Explanation21 |
| Explanation22 |
| Explanation23 |

Scenario: All answer options and explanations related to question are present on question page
When mouse hover element of objectives list with title 'Objective1'
And click open objective list item with title 'Objective1'
And mouse hover element of questions list with title 'Question1'
And click on edit question with title 'Question1'
Then answer options list contains items with data
| Title          |
| AnswerOption11 |
| AnswerOption12 |
| AnswerOption13 |
And explanations list contains items with data
| Title         |
| Explanation11 |
| Explanation12 |
| Explanation13 |



