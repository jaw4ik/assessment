@Question
Feature: Question
	As an author I can see content of open Question, so I can check if it is enough to check/provide a learner's knowledge. 

Background: 
When open page by url 'http://localhost:5656'
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
| Objective2 | 2  |
Given questions related to 'Objective1' are present in database
| Title      | Id |
| Question11 | 1  |
| Question12 | 2  |
| Question13 | 3  |
Given questions related to 'Objective2' are present in database
| Title       | Id |
| Question112 | 1  |
| Question113 | 2  |
Given answer options related to 'Question11' are present in database
| Title          | isCorrect |
| AnswerOption11 | 1         |
| AnswerOption12 | 0         |
| AnswerOption13 | 1         |
Given answer options related to 'Question12' are present in database
| Title          |
| AnswerOption21 |
| AnswerOption22 |
| AnswerOption23 |
Given explanations related to 'Question11' are present in database
| Title         |
| Explanation11 |
| Explanation12 |
| Explanation13 |
Given explanations related to 'Question12' are present in database
| Title         |
| Explanation21 |
| Explanation22 |
| Explanation23 |

Scenario: All answer options and explanations related to question are present on question page
When mouse hover element of objectives list with title 'Objective1'
And click open objective list item with title 'Objective1'
And mouse hover element of questions list with title 'Question12'
And click on edit question with title 'Question12'
Then answer options list contains only items with data
| Title          |
| AnswerOption21 |
| AnswerOption22 |
| AnswerOption23 |
And explanations list contains only items with data
| Title         |
| Explanation21 |
| Explanation22 |
| Explanation23 |

Scenario: Related objective title is shown in back to objective link
When navigate to 'Question12' of 'Objective1'
Then 'Objective1' title is shown in back to objective link

Scenario: Related question title is shown in question page header
When navigate to 'Question12' of 'Objective1'
Then 'Question12' title is shown in question page header

Scenario: Correct indicators are shown for answer options on question page
When navigate to 'Question11' of 'Objective1'
Then correct is set to true for 'AnswerOption11'
And correct is set to false for 'AnswerOption12'

Scenario: Next and previous actions of question page navigate through questions of current objective
When navigate to 'Question11' of 'Objective1'
And click on next question
And click on next question
And click on previous question
Then browser navigates to url 'http://localhost:5656/#/objective/1/question/2'

Scenario: Previous question action is not available for first question
When navigate to 'Question11' of 'Objective1'
Then previous question action is not available

Scenario: Next question action is not available for last question
When navigate to 'Question13' of 'Objective1'
Then next question action is not available

Scenario: answer options block and explanations block are expanded by default
When navigate to 'Question11' of 'Objective1'
Then answer options block is expanded
And explanations block is expanded

Scenario: Collapse answer options action on question page collapses answer options block
When navigate to 'Question11' of 'Objective1'
And click on collapse answer options
Then answer options block is collapsed
And explanations block is expanded

Scenario: Collapse explanations action on question page collapses explanations block
When navigate to 'Question11' of 'Objective1'
And click on collapse explanations
Then explanations block is collapsed
And answer options block is expanded

Scenario: Expand answer options action on question page expands answer option block
When navigate to 'Question11' of 'Objective1'
And click on collapse answer options
And click on collapse explanations
And click on expand answer options
Then answer options block is expanded
And explanations block is collapsed

Scenario: Expand explanations action on question page expands explanations block
When navigate to 'Question11' of 'Objective1'
And click on collapse answer options
And click on collapse explanations
And click on expand explanations options
Then explanations block is expanded
And answer options block is collapsed

Scenario: Back action of question page navigates to relative objective page
When navigate to 'Question11' of 'Objective1'
And click on back to objective
Then browser navigates to url 'http://localhost:5656/#/objective/1'


