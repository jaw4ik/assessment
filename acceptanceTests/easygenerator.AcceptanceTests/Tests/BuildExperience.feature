@BuildExperience
Feature: BuildExperience
	 As an author I can build selected Experience,
	 so I'm able to download archived package with content in form of HTML (with needed CSS, JS and media resources)
	 and then upload it unpacked to a web server. 

Background:
Given clear data context
#When open page by url 'http://localhost:5656/signout'
#When open page by url 'http://localhost:5656/signin'
#And sign in as 'test' user on sign in page
#Then browser navigates to url 'http://localhost:5656/'

Scenario: Building status is shown after click on build button
Given publications are present in database
| Title       | Id |
| Experience1 | 00000000000000000000000000000001  |
Given objectives are present in database
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
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
| Experience1 | 00000000000000000000000000000001  |
Given objectives are present in database
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
Given questions related to 'Objective11' are present in database
| Title      | Id |
| Question11 | 00000000000000000000000000000001  |
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

#Scenario: Failed status is shown after build failed
#Given publications are present in database
#| Title       | Id |
#| Experience1 | 00000000000000000000000000000001  |
#Given objectives are present in database
#| Title       | Id |
#| Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11 | 00000000000000000000000000000001  |
#Given objectives are linked to experiance 'Experience1'
#| Title       | Id |
#| Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11 | 00000000000000000000000000000001  |
#Given questions related to 'Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11' are present in database
#| Title      | Id |
#| Question11 | 00000000000000000000000000000001  |
#Given answer options related to 'Question11' of 'Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11' are present in database
#| Text           | isCorrect |
#| AnswerOption11 | true      |
#| AnswerOption12 | false     |
#Given explanations related to 'Question11' of 'Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11' are present in database
#| Explanation   |
#| Explanation11 |
#| Explanation12 |
#When open page by url 'http://localhost:5656/#/experiences'
#And mouse hover element of publications list with title 'Experience1'
#And click build publication list item with title 'Experience1'
#Then status failed is shown true for publication list item with title 'Experience1' after build finished

Scenario: Explanations are not required, build should succeed
Given publications are present in database
| Title       | Id |
| Experience1 | 00000000000000000000000000000001  |
Given objectives are present in database
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
Given questions related to 'Objective11' are present in database
| Title      | Id |
| Question11 | 00000000000000000000000000000001  |
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
| Experience1 | 00000000000000000000000000000001  |
Given objectives are present in database
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
Given questions related to 'Objective11' are present in database
| Title      | Id |
| Question11 | 00000000000000000000000000000001  |
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
| Experience1 | 00000000000000000000000000000001  |
Given objectives are present in database
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
Given questions related to 'Objective11' are present in database
| Title      | Id |
| Question11 | 00000000000000000000000000000001  |
| Question12 | 00000000000000000000000000000002  |
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
| Experience1 | 00000000000000000000000000000001  |
When open page by url 'http://localhost:5656/#/experiences'
And mouse hover element of publications list with title 'Experience1'
And click build publication list item with title 'Experience1'
Then status complete is shown true for publication list item with title 'Experience1' after build finished


Scenario: Open, select, rebuild and download actions become available after build on hover
Given publications are present in database
| Title       | Id |
| Experience1 | 00000000000000000000000000000001  |
Given objectives are present in database
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
Given questions related to 'Objective11' are present in database
| Title      | Id |
| Question11 | 00000000000000000000000000000001  |
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
And Action rebuild is enabled true for publications list item with title 'Experience1'
And Action download is enabled true for publications list item with title 'Experience1'

Scenario: Open, select, rebuild and download actions are available after rebuild on hover
Given publications are present in database
| Title       | Id |
| Experience1 | 00000000000000000000000000000001  |
Given objectives are present in database
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
Given questions related to 'Objective11' are present in database
| Title      | Id |
| Question11 | 00000000000000000000000000000001  |
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
And click rebuild publication list item with title 'Experience1'
And sleep 1000 milliseconds
And mouse hover element of publications list with title 'Experience1'
Then Action open is enabled true for publications list item with title 'Experience1'
And Action select is enabled true for publications list item with title 'Experience1'
And Action rebuild is enabled true for publications list item with title 'Experience1'
And Action download is enabled true for publications list item with title 'Experience1'

Scenario: Rebuild should succeed if some objective is empty
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
And click rebuild publication list item with title 'Experience1'
Then status complete is shown true for publication list item with title 'Experience1' after build finished

Scenario: Rebuild should succeed if some question is empty
Given publications are present in database
| Title       | Id |
| Experience1 | 00000000000000000000000000000001  |
Given objectives are present in database
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
Given questions related to 'Objective11' are present in database
| Title      | Id |
| Question11 | 00000000000000000000000000000001  |
| Question12 | 00000000000000000000000000000002  |
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
And click rebuild publication list item with title 'Experience1'
Then status complete is shown true for publication list item with title 'Experience1' after build finished

Scenario: Answer options are not required, rebuild should succeed
Given publications are present in database
| Title       | Id |
| Experience1 | 00000000000000000000000000000001  |
Given objectives are present in database
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
Given questions related to 'Objective11' are present in database
| Title      | Id |
| Question11 | 00000000000000000000000000000001  |
Given explanations related to 'Question11' of 'Objective11' are present in database
| Explanation   |
| Explanation11 |
| Explanation12 |
When open page by url 'http://localhost:5656/#/experiences'
And mouse hover element of publications list with title 'Experience1'
And click build publication list item with title 'Experience1'
And sleep 500 milliseconds
And mouse hover logo
And sleep 500 milliseconds
And mouse hover element of publications list with title 'Experience1'
And click rebuild publication list item with title 'Experience1'
Then status complete is shown true for publication list item with title 'Experience1' after build finished

Scenario: Explanations are not required, rebuild should succeed
Given publications are present in database
| Title       | Id |
| Experience1 | 00000000000000000000000000000001  |
Given objectives are present in database
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
Given questions related to 'Objective11' are present in database
| Title      | Id |
| Question11 | 00000000000000000000000000000001  |
Given answer options related to 'Question11' of 'Objective11' are present in database
| Text           | isCorrect |
| AnswerOption11 | true      |
| AnswerOption12 | false     |
When open page by url 'http://localhost:5656/#/experiences'
And mouse hover element of publications list with title 'Experience1'
And click build publication list item with title 'Experience1'
And click on objectives navigation menu item
Then browser navigates to url 'http://localhost:5656/#objectives'
When open page by url 'http://localhost:5656/#/experiences'
And mouse hover element of publications list with title 'Experience1'
And click rebuild publication list item with title 'Experience1'
Then status complete is shown true for publication list item with title 'Experience1' after build finished

Scenario: Building status is shown after click on rebuild button
Given clear data context
Given publications are present in database
| Title       | Id |
| Experience1 | 00000000000000000000000000000001  |
Given objectives are present in database
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
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
And mouse hover element of publications list with title 'Experience1'
And click build publication list item with title 'Experience1'
And sleep 1000 milliseconds
Then status building is shown for publication list item with title 'Experience1' on click rebuild

#Scenario: Same experience status is shown on both experience and experiences list pages
#Given publications are present in database
#| Title       | Id |
#| Experience1 | 00000000000000000000000000000001  |
#| Experience2 | 00000000000000000000000000000002  |
#When open page by url 'http://localhost:5656/#/experiences'
#And mouse hover element of publications list with title 'Experience1'
#And click build publication list item with title 'Experience1'
#And sleep 1000 milliseconds
#And mouse hover element of publications list with title 'Experience1'
#Then Action rebuild is enabled true for publications list item with title 'Experience1'
#And Action download is enabled true for publications list item with title 'Experience1'
#When click open publication list item with title 'Experience1'
#Then browser navigates to url 'http://localhost:5656/#experience/00000000000000000000000000000001'
#And download action on experiance page is available
#And rebuild action on experiance page is available
#When click on next experience
#Then browser navigates to url 'http://localhost:5656/#experience/00000000000000000000000000000002'
#When click on build button
#Then download action on experiance page is available
#And rebuild action on experiance page is available
#When click on back to experiences
#Then browser navigates to url 'http://localhost:5656/#experiences'
#When mouse hover element of publications list with title 'Experience2'
#Then Action rebuild is enabled true for publications list item with title 'Experience2'
#And Action download is enabled true for publications list item with title 'Experience2'

