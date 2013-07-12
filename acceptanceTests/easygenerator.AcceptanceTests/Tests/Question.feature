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
Given answer options related to 'Question3' are present in database
| Title          |
| AnswerOption31 |
| AnswerOption32 |
| AnswerOption33 |
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
Given explanations related to 'Question3' are present in database
| Title         |
| Explanation31 |
| Explanation32 |
| Explanation33 |


