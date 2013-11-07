@Question
Feature: Question
	As an author I can see content of open Question, so I can check if it is enough to check/provide a learner's knowledge. 

Background:
Given clear data context 
Given objectives are present in database
| Title      | Id                               |
| Objective1 | 00000000000000000000000000000001 |
| Objective2 | 00000000000000000000000000000002 |
Given questions related to 'Objective1' are present in database
| Title      | Id                               |
| Question11 | 00000000000000000000000000000001 |
| Question12 | 00000000000000000000000000000002 |
| Question13 | 00000000000000000000000000000003 |
Given questions related to 'Objective2' are present in database
| Title       | Id |
| Question112 | 00000000000000000000000000000011  |
| Question113 | 00000000000000000000000000000013  |
Given answer options related to 'Question11' of 'Objective1' are present in database
| Text           | isCorrect |
| AnswerOption11 | true      |
| AnswerOption12 | false     |
| AnswerOption13 | true      |
Given answer options related to 'Question12' of 'Objective1' are present in database
| Text           |
| AnswerOption21 |
| AnswerOption22 |
| AnswerOption23 |
Given explanations related to 'Question11' of 'Objective1' are present in database
| Explanation   |
| Explanation11 |
| Explanation12 |
| Explanation13 |
Given explanations related to 'Question12' of 'Objective1' are present in database
| Explanation   |
| Explanation21 |
| Explanation22 |
| Explanation23 |
When open page by url 'http://localhost:5656/signout'
When open page by url 'http://localhost:5656/signin'
And sign in as 'test' user on sign in page
Then browser navigates to url 'http://localhost:5656/'

Scenario: All answer options and explanations related to question are present on question page
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000002'
Then answer options list contains only items with data
| Text           |
| AnswerOption21 |
| AnswerOption22 |
| AnswerOption23 |
And explanations list contains only items with data
| Explanation   |
| Explanation21 |
| Explanation22 |
| Explanation23 |

#Scenario: Related objective title is shown in back to objective link
#When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000002'
#Then 'Objective1' title is shown in back to objective link

Scenario: Related question title is shown in question page header
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000002'
Then 'Question12' title is shown in question page header

Scenario: Correct indicators are shown for answer options on question page
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
Then correct answer option is set to 'true' for 'AnswerOption11'
And correct answer option is set to 'false' for 'AnswerOption12'

#Scenario: Next and previous actions of question page navigate through questions of current objective
#When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
#And click on next question
#Then browser navigates to url 'http://localhost:5656/#objective/00000000000000000000000000000001/question/00000000000000000000000000000002'
#When click on next question
#Then browser navigates to url 'http://localhost:5656/#objective/00000000000000000000000000000001/question/00000000000000000000000000000003'
#When click on previous question
#Then browser navigates to url 'http://localhost:5656/#objective/00000000000000000000000000000001/question/00000000000000000000000000000002'

Scenario: Previous question action is not available for first question
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
Then previous question action is not available

Scenario: Next question action is not available for last question
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000003'
Then next question action is not available

Scenario: answer options block and explanations block are expanded by default
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
Then answer options block is expanded
And explanations block is expanded

Scenario: Collapse answer options action on question page collapses answer options block
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And click on collapse answer options
Then answer options block is collapsed
And explanations block is expanded

Scenario: Collapse explanations action on question page collapses explanations block
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And click on collapse explanations
Then explanations block is collapsed
And answer options block is expanded

Scenario: Expand answer options action on question page expands answer option block
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And click on collapse answer options
And click on collapse explanations
And click on expand answer options
Then answer options block is expanded
And explanations block is collapsed

Scenario: Expand explanations action on question page expands explanations block
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And click on collapse answer options
And click on collapse explanations
And click on expand explanations options
Then explanations block is expanded
And answer options block is collapsed

#Scenario: Back action of question page navigates to relative objective page
#When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
#And click on back to objective on question page
#Then browser navigates to url 'http://localhost:5656/#objective/00000000000000000000000000000001'

#Scenario: Objectiive title of question page navigates to relative objective page
#When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
#And click on back to objective title on question page
#Then browser navigates to url 'http://localhost:5656/#objective/00000000000000000000000000000001'
