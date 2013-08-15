@BuildExperience
Feature: BuildExperience
	 As an author I can build selected Experience,
	 so I'm able to download archived package with content in form of HTML (with needed CSS, JS and media resources)
	 and then upload it unpacked to a web server. 


Scenario: Building status is shown after click on build button
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
Given objectives are present in database
| Title       | Id |
| Objective11 | 1  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11 | 1  |
Given questions related to 'Objective11' are present in database
| Title      | Id |
| Question11 | 1  |
| Question12 | 2  |
Given answer options related to 'Question11' of 'Objective11' are present in database
| Text           | isCorrect |
| AnswerOption11 | true      |
| AnswerOption12 | false     |
Given answer options related to 'Question12' of 'Objective11' are present in database
| Text           | isCorrect |
| AnswerOption11 | true      |
| AnswerOption12 | false     |
Given explanations related to 'Question11' of 'Objective11' are present in database
| Explanation   |
| Explanation11 |
| Explanation12 |
Given explanations related to 'Question12' of 'Objective11' are present in database
| Explanation   |
| Explanation11 |
| Explanation12 |
When open page by url 'http://localhost:5656/#/experiences'
Then status building is shown for publication list item with title 'Experience1' on click build

Scenario: Complete status is shown after build finished
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
Given objectives are present in database
| Title       | Id |
| Objective11 | 1  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11 | 1  |
Given questions related to 'Objective11' are present in database
| Title      | Id |
| Question11 | 1  |
Given answer options related to 'Question11' of 'Objective11' are present in database
| Text           | isCorrect |
| AnswerOption11 | true      |
| AnswerOption12 | false     |
Given explanations related to 'Question11' of 'Objective11' are present in database
| Explanation   |
| Explanation11 |
| Explanation12 |
When open page by url 'http://localhost:5656/#/experiences'
And mouse hover element of publications list with title 'Experience1'
And click build publication list item with title 'Experience1'
Then status complete is shown true for publication list item with title 'Experience1' after build finished

Scenario: Failed status is shown after build failed
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
Given objectives are present in database
| Title       | Id |
| Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11 | 1  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11 | 1  |
Given questions related to 'Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11' are present in database
| Title      | Id |
| Question11 | 1  |
Given answer options related to 'Question11' of 'Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11' are present in database
| Text           | isCorrect |
| AnswerOption11 | true      |
| AnswerOption12 | false     |
Given explanations related to 'Question11' of 'Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11' are present in database
| Explanation   |
| Explanation11 |
| Explanation12 |
When open page by url 'http://localhost:5656/#/experiences'
And mouse hover element of publications list with title 'Experience1'
And click build publication list item with title 'Experience1'
Then status failed is shown true for publication list item with title 'Experience1' after build finished

Scenario: Explanations are not required, build should succeed
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
Given objectives are present in database
| Title       | Id |
| Objective11 | 1  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11 | 1  |
Given questions related to 'Objective11' are present in database
| Title      | Id |
| Question11 | 1  |
Given answer options related to 'Question11' of 'Objective11' are present in database
| Text           | isCorrect |
| AnswerOption11 | true      |
| AnswerOption12 | false     |
When open page by url 'http://localhost:5656/#/experiences'
And mouse hover element of publications list with title 'Experience1'
And click build publication list item with title 'Experience1'
Then status complete is shown true for publication list item with title 'Experience1' after build finished

Scenario: Answer options are not required, build should succeed
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
Given objectives are present in database
| Title       | Id |
| Objective11 | 1  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11 | 1  |
Given questions related to 'Objective11' are present in database
| Title      | Id |
| Question11 | 1  |
Given explanations related to 'Question11' of 'Objective11' are present in database
| Explanation   |
| Explanation11 |
| Explanation12 |
When open page by url 'http://localhost:5656/#/experiences'
And mouse hover element of publications list with title 'Experience1'
And click build publication list item with title 'Experience1'
Then status complete is shown true for publication list item with title 'Experience1' after build finished

Scenario: Build should succeed if some question is empty
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
Given objectives are present in database
| Title       | Id |
| Objective11 | 1  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11 | 1  |
Given questions related to 'Objective11' are present in database
| Title      | Id |
| Question11 | 1  |
| Question12 | 2  |
Given answer options related to 'Question11' of 'Objective11' are present in database
| Text           | isCorrect |
| AnswerOption11 | true      |
| AnswerOption12 | false     |
Given explanations related to 'Question11' of 'Objective11' are present in database
| Explanation   |
| Explanation11 |
| Explanation12 |
When open page by url 'http://localhost:5656/#/experiences'
And mouse hover element of publications list with title 'Experience1'
And click build publication list item with title 'Experience1'
Then status complete is shown true for publication list item with title 'Experience1' after build finished

Scenario: Build should succeed if some objective is empty
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
Given objectives are present in database
| Title       | Id |
| Objective11 | 1  |
| Objective12 | 2  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11 | 1  |
| Objective12 | 2  |
Given questions related to 'Objective11' are present in database
| Title      | Id |
| Question11 | 1  |
Given answer options related to 'Question11' of 'Objective11' are present in database
| Text           | isCorrect |
| AnswerOption11 | true      |
| AnswerOption12 | false     |
Given explanations related to 'Question11' of 'Objective11' are present in database
| Explanation   |
| Explanation11 |
| Explanation12 |
When open page by url 'http://localhost:5656/#/experiences'
And mouse hover element of publications list with title 'Experience1'
And click build publication list item with title 'Experience1'
Then status complete is shown true for publication list item with title 'Experience1' after build finished

Scenario: Build should succeed even for empty experience
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
When open page by url 'http://localhost:5656/#/experiences'
And mouse hover element of publications list with title 'Experience1'
And click build publication list item with title 'Experience1'
Then status complete is shown true for publication list item with title 'Experience1' after build finished

Scenario: complete status message disappears after 10 seconds
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
Given objectives are present in database
| Title       | Id |
| Objective11 | 1  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11 | 1  |
Given questions related to 'Objective11' are present in database
| Title      | Id |
| Question11 | 1  |
Given answer options related to 'Question11' of 'Objective11' are present in database
| Text           | isCorrect |
| AnswerOption11 | true      |
| AnswerOption12 | false     |
Given explanations related to 'Question11' of 'Objective11' are present in database
| Explanation   |
| Explanation11 |
| Explanation12 |
When open page by url 'http://localhost:5656/#/experiences'
And mouse hover element of publications list with title 'Experience1'
And click build publication list item with title 'Experience1'
And sleep 10000 milliseconds
Then status complete is shown false for publication list item with title 'Experience1' after build finished

Scenario: Failed status message disappears after 10 seconds
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
Given objectives are present in database
| Title       | Id |
| Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11 | 1  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11 | 1  |
Given questions related to 'Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11' are present in database
| Title      | Id |
| Question11 | 1  |
Given answer options related to 'Question11' of 'Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11' are present in database
| Text           | isCorrect |
| AnswerOption11 | true      |
| AnswerOption12 | false     |
Given explanations related to 'Question11' of 'Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11' are present in database
| Explanation   |
| Explanation11 |
| Explanation12 |
When open page by url 'http://localhost:5656/#/experiences'
And mouse hover element of publications list with title 'Experience1'
And click build publication list item with title 'Experience1'
And sleep 10000 milliseconds
Then status failed is shown false for publication list item with title 'Experience1' after build finished

Scenario: Open, select and download actions become available after build on hover
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
Given objectives are present in database
| Title       | Id |
| Objective11 | 1  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11 | 1  |
Given questions related to 'Objective11' are present in database
| Title      | Id |
| Question11 | 1  |
Given answer options related to 'Question11' of 'Objective11' are present in database
| Text           | isCorrect |
| AnswerOption11 | true      |
| AnswerOption12 | false     |
Given explanations related to 'Question11' of 'Objective11' are present in database
| Explanation   |
| Explanation11 |
| Explanation12 |
When open page by url 'http://localhost:5656/#/experiences'
And mouse hover element of publications list with title 'Experience1'
And click build publication list item with title 'Experience1'
And sleep 1000 milliseconds
And mouse hover element of publications list with title 'Experience1'
Then Action open is enabled true for publications list item with title 'Experience1'
And Action select is enabled true for publications list item with title 'Experience1'
And Action download is enabled true for publications list item with title 'Experience1'


