﻿@PackageListOfObjectives
Feature: PackageSummaryPage
	As a learner I can unzip downloaded package and open “index” file that is contained by this package,
	so I'm able to see the tree of objectives and related to them questions.


Background:
Given clear data context 
Given publications are present in database
| Title       | Id |
| Experience1 | 00000000000000000000000000000001  |
| Experience2 | 00000000000000000000000000000002  |
Given objectives are present in database
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
| Objective12 | 00000000000000000000000000000002  |
| Objective21 | 00000000000000000000000000000003  |
| Objective22 | 00000000000000000000000000000004  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
| Objective12 | 00000000000000000000000000000002  |
Given objectives are linked to experiance 'Experience2'
| Title       | Id |
| Objective21 | 00000000000000000000000000000003  |
| Objective22 | 00000000000000000000000000000004  |

Given questions related to 'Objective11' are present in database
| Title      | Id |
| Question11 | 00000000000000000000000000000001  |
| Question12 | 00000000000000000000000000000002  |
Given answer options related to 'Question11' of 'Objective11' are present in database
| Text           | isCorrect |
| AnswerOption11 | true      |
| AnswerOption12 | false     |
Given answer options related to 'Question12' of 'Objective11' are present in database
| Text           | isCorrect |
| AnswerOption21 | true      |
| AnswerOption22 | false     |
Given explanations related to 'Question11' of 'Objective11' are present in database
| Explanation   |
| Explanation11 |
| Explanation12 |
Given explanations related to 'Question12' of 'Objective11' are present in database
| Explanation   |
| Explanation21 |
| Explanation22 |

Given questions related to 'Objective12' are present in database
| Title      | Id |
| Question21 | 00000000000000000000000000000003  |
| Question22 | 00000000000000000000000000000004  |
Given answer options related to 'Question21' of 'Objective12' are present in database
| Text            | isCorrect |
| AnswerOption211 | true      |
| AnswerOption212 | false     |
Given answer options related to 'Question22' of 'Objective12' are present in database
| Text            | isCorrect |
| AnswerOption221 | true      |
| AnswerOption222 | false     |
Given explanations related to 'Question21' of 'Objective12' are present in database
| Explanation    |
| Explanation211 |
| Explanation212 |
Given explanations related to 'Question22' of 'Objective12' are present in database
| Explanation    |
| Explanation221 |
| Explanation222 |


Given questions related to 'Objective21' are present in database
| Title        | Id |
| Question11e2 | 00000000000000000000000000000005  |
| Question12e2 | 00000000000000000000000000000006  |
Given answer options related to 'Question11e2' of 'Objective21' are present in database
| Text             | isCorrect |
| AnswerOption11e2 | true      |
| AnswerOption12e2 | false     |
Given answer options related to 'Question12e2' of 'Objective21' are present in database
| Text             | isCorrect |
| AnswerOption21e2 | true      |
| AnswerOption22e2 | false     |
Given explanations related to 'Question11e2' of 'Objective21' are present in database
| Explanation     |
| Explanation11e2 |
| Explanation12e2 |
Given explanations related to 'Question12e2' of 'Objective21' are present in database
| Explanation     |
| Explanation21e2 |
| Explanation22e2 |

Given questions related to 'Objective22' are present in database
| Title        | Id |
| Question21e2 | 00000000000000000000000000000007  |
| Question22e2 | 00000000000000000000000000000008  |
Given answer options related to 'Question21e2' of 'Objective22' are present in database
| Text              | isCorrect |
| AnswerOption211e2 | true      |
| AnswerOption212e2 | false     |
Given answer options related to 'Question22e2' of 'Objective22' are present in database
| Text              | isCorrect |
| AnswerOption221e2 | true      |
| AnswerOption222e2 | false     |
Given explanations related to 'Question21e2' of 'Objective22' are present in database
| Explanation      |
| Explanation211e2 |
| Explanation212e2 |
Given explanations related to 'Question22e2' of 'Objective22' are present in database
| Explanation      |
| Explanation221e2 |
| Explanation222e2 |
When open page by url 'http://localhost:5656/signout'
And open page by url 'http://localhost:5656/signin'
And sign in as 'test' user on sign in page
Then browser navigates to url 'http://localhost:5656/'

When open page by url 'http://localhost:5656/#/experiences'
And mouse hover element of publications list with title 'Experience1'
And click build publication list item with title 'Experience1'
And sleep 1000 milliseconds
And refresh page
And mouse hover element of publications list with title 'Experience1'
And click download publication list item with title 'Experience1'
And unzip '00000000000000000000000000000001' package to 'tmp'

Scenario: Progress indicators show current progress for experience
When open page by url 'http://localhost:5656/Templates/tmp'
And toggle expand package objective item with title 'Objective11'
And click package question list item 'Question11' of 'Objective11'
And click on submit button on package question page
And click on back to objectives link on package feedback page
And toggle expand package objective item with title 'Objective12'
And click package question list item 'Question21' of 'Objective12'
And click on submit button on package question page
And click on back to objectives link on package feedback page
And click package question list item 'Question22' of 'Objective12'
And click on submit button on package question page
And click on progress summary link on package feedback page
Then browser navigates to url 'http://localhost:5656/Templates/tmp/#summary'
And overall progress score '38%' is shown on package summary page
And objective progress list contains items with data
| Title       | Value | MeterValue  |
| Objective11 | 25%   | width: 25%; |
| Objective12 | 50%   | width: 50%; | 


Scenario: Back action on package summary page navigates to previous page

When open page by url 'http://localhost:5656/Templates/tmp'
And click on progress summary button on package list of objective page
And click on back link on progress summary page
Then browser navigates to url 'http://localhost:5656/Templates/tmp/'

When toggle expand package objective item with title 'Objective11'
And click package question list item 'Question11' of 'Objective11'
And click on progress summary link on package question page
And click on back link on progress summary page
Then browser navigates to url 'http://localhost:5656/Templates/tmp/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'

When click on submit button on package question page
And click on progress summary link on package feedback page
And click on back link on progress summary page
Then browser navigates to url 'http://localhost:5656/Templates/tmp/#objective/00000000000000000000000000000001/question/00000000000000000000000000000001/feedback'

When click on show explanations button on package feedback page
And click on progress summary link on package explanations page
And click on back link on progress summary page
Then browser navigates to url 'http://localhost:5656/Templates/tmp/#objective/00000000000000000000000000000001/question/00000000000000000000000000000001/learningContents'


Scenario: Thank you message popup appears on finish link click on package summary page
When open page by url 'http://localhost:5656/Templates/tmp'
And click on progress summary button on package list of objective page
And click on finish link on progress summary page
Then thank you popup appears on package summary page

Scenario: Home link on package summary page navigates to package home page
When open page by url 'http://localhost:5656/Templates/tmp'
And toggle expand package objective item with title 'Objective11'
And click package question list item 'Question11' of 'Objective11'
And click on progress summary link on package question page
And click on home link on progress summary page
Then browser navigates to url 'http://localhost:5656/Templates/tmp/#'

