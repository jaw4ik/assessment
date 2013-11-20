@PackageListOfObjectives
Feature: PackageProgressScore
	- Effective score for each question = score of the last attempt for this question;
	- Learner’s score for current question is calculated by this rule (all options have the same weight):
		-- (Number of checked options that are correct + Number of not checked options that are incorrect)/(Number of answer options)×100% ;
	- Learner can see his progress summary (in percent) : overall experience progress value = arithmetical mean of all progress values of objectives, progress value per objective;



Background:
Given clear data context 
Given publications are present in database
| Title       | Id |
| Experience1 | 00000000000000000000000000000001  |
Given objectives are present in database
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
| Objective12 | 00000000000000000000000000000002  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
| Objective12 | 00000000000000000000000000000002  |

Given questions related to 'Objective11' are present in database
| Title      | Id |
| Question11 | 00000000000000000000000000000001  |
| Question12 | 00000000000000000000000000000002  |
Given answer options related to 'Question11' of 'Objective11' are present in database
| Text           | isCorrect |
| AnswerOption11 | true      |
| AnswerOption12 | false     |
| AnswerOption13 | false     |
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
| AnswerOption222 | true     |
| AnswerOption223 | false     |
Given explanations related to 'Question21' of 'Objective12' are present in database
| Explanation    |
| Explanation211 |
| Explanation212 |
Given explanations related to 'Question22' of 'Objective12' are present in database
| Explanation    |
| Explanation221 |
| Explanation222 |
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
And open page by url 'http://localhost:5656/Templates/tmp'
And click on DoNotReport link on package objective list page


Scenario: Package score should not be calculated if only visit pages and not submit answers
When toggle expand package objective item with title 'Objective11'
And click package question list item 'Question11' of 'Objective11'
And click on show explanations link on package question page
And click on back to objectives link on package explanations page
And toggle expand package objective item with title 'Objective12'
And click package question list item 'Question22' of 'Objective12'
And click on show explanations link on package question page
And click on progress summary link on package explanations page
Then overall progress score '0%' is shown on package summary page
And objective progress list contains items with data
| Title       | Value | MeterValue |
| Objective11 | 0%    | width: 0%; |
| Objective12 | 0%    | width: 0%; |


Scenario: All scores are 100% if all correct answers were checked and submited
When toggle expand package objective item with title 'Objective11'
And click package question list item 'Question11' of 'Objective11'
And toggle package answer option 'AnswerOption11' checkbox
And click on submit button on package question page
Then question progress score '100%' is shown on package feedback page

When click on back to objectives link on package feedback page
And click package question list item 'Question12' of 'Objective11'
And toggle package answer option 'AnswerOption21' checkbox
And click on submit button on package question page
Then question progress score '100%' is shown on package feedback page

When click on back to objectives link on package feedback page
And toggle expand package objective item with title 'Objective12'
And click package question list item 'Question21' of 'Objective12'
And toggle package answer option 'AnswerOption211' checkbox
And click on submit button on package question page
Then question progress score '100%' is shown on package feedback page

When click on back to objectives link on package feedback page
And click package question list item 'Question22' of 'Objective12'
And toggle package answer option 'AnswerOption221' checkbox
And toggle package answer option 'AnswerOption222' checkbox
And click on submit button on package question page
Then question progress score '100%' is shown on package feedback page

When click on progress summary link on package feedback page
Then overall progress score '100%' is shown on package summary page
And objective progress list contains items with data
| Title       | Value | MeterValue   |
| Objective11 | 100%  | width: 100%; |
| Objective12 | 100%  | width: 100%; |


Scenario: All scores are 0% if all incorrect answers were checked and submited
When toggle expand package objective item with title 'Objective11'
And click package question list item 'Question11' of 'Objective11'
And toggle package answer option 'AnswerOption12' checkbox
And toggle package answer option 'AnswerOption13' checkbox
And click on submit button on package question page
Then question progress score '0%' is shown on package feedback page

When click on back to objectives link on package feedback page
And click package question list item 'Question12' of 'Objective11'
And toggle package answer option 'AnswerOption22' checkbox
And click on submit button on package question page
Then question progress score '0%' is shown on package feedback page

When click on back to objectives link on package feedback page
And toggle expand package objective item with title 'Objective12'
And click package question list item 'Question21' of 'Objective12'
And toggle package answer option 'AnswerOption212' checkbox
And click on submit button on package question page
Then question progress score '0%' is shown on package feedback page

When click on back to objectives link on package feedback page
And click package question list item 'Question22' of 'Objective12'
And toggle package answer option 'AnswerOption223' checkbox
And click on submit button on package question page
Then question progress score '0%' is shown on package feedback page

When click on progress summary link on package feedback page
Then overall progress score '0%' is shown on package summary page
And objective progress list contains items with data
| Title       | Value | MeterValue |
| Objective11 | 0%    | width: 0%; |
| Objective12 | 0%    | width: 0%; |

Scenario: Not checked incorrect options are equal to checked correct options in score calculation and vice versa
When toggle expand package objective item with title 'Objective11'
And click package question list item 'Question11' of 'Objective11'
And toggle package answer option 'AnswerOption11' checkbox
And toggle package answer option 'AnswerOption13' checkbox
And click on submit button on package question page
Then question progress score '67%' is shown on package feedback page

When click on back to objectives link on package feedback page
And toggle expand package objective item with title 'Objective12'
And click package question list item 'Question22' of 'Objective12'
And toggle package answer option 'AnswerOption221' checkbox
And toggle package answer option 'AnswerOption223' checkbox
And click on submit button on package question page
Then question progress score '33%' is shown on package feedback page

Scenario: Overall experience progress value is arithmetical mean of all progress values of objectives
When toggle expand package objective item with title 'Objective11'
And click package question list item 'Question11' of 'Objective11'
And toggle package answer option 'AnswerOption11' checkbox
And toggle package answer option 'AnswerOption13' checkbox
And click on submit button on package question page
Then question progress score '67%' is shown on package feedback page

When click on back to objectives link on package feedback page
And click package question list item 'Question12' of 'Objective11'
And toggle package answer option 'AnswerOption21' checkbox
And click on submit button on package question page
Then question progress score '100%' is shown on package feedback page

When click on back to objectives link on package feedback page
And toggle expand package objective item with title 'Objective12'
And click package question list item 'Question21' of 'Objective12'
And toggle package answer option 'AnswerOption211' checkbox
And toggle package answer option 'AnswerOption212' checkbox
And click on submit button on package question page
Then question progress score '50%' is shown on package feedback page

When click on back to objectives link on package feedback page
And click package question list item 'Question22' of 'Objective12'
And toggle package answer option 'AnswerOption221' checkbox
And toggle package answer option 'AnswerOption223' checkbox
And click on submit button on package question page
Then question progress score '33%' is shown on package feedback page

When click on progress summary link on package feedback page
Then overall progress score '63%' is shown on package summary page
And objective progress list contains items with data
| Title       | Value | MeterValue  |
| Objective11 | 83%   | width: 83%; |
| Objective12 | 42%   | width: 42%; |


Scenario: Effective score for each question is score of the last attempt for this question
When toggle expand package objective item with title 'Objective11'
And click package question list item 'Question12' of 'Objective11'
And toggle package answer option 'AnswerOption21' checkbox
And click on submit button on package question page
Then question progress score '100%' is shown on package feedback page
When click on progress summary link on package feedback page
Then overall progress score '25%' is shown on package summary page
And objective progress list contains items with data
| Title       | Value | MeterValue  |
| Objective11 | 50%   | width: 50%; |
| Objective12 | 0%    | width: 0%;  |

When click on home link on progress summary page
And click package question list item 'Question12' of 'Objective11'
And toggle package answer option 'AnswerOption21' checkbox
And toggle package answer option 'AnswerOption22' checkbox
And click on submit button on package question page
Then question progress score '50%' is shown on package feedback page
When click on progress summary link on package feedback page
Then overall progress score '13%' is shown on package summary page
And objective progress list contains items with data
| Title       | Value | MeterValue  |
| Objective11 | 25%   | width: 25%; |
| Objective12 | 0%    | width: 0%;  |