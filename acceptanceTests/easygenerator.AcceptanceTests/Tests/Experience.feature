@Experience
Feature: Experience
	As an author I can see Title, list of related objectives and assigned Template name  of open Experience,
	so I can check if the current experience is ready for publishing.

Background:
Given clear data context
Given publications are present in database
| Title       | Id |
| Experience1 | 00000000000000000000000000000001  |
| Experience2 | 00000000000000000000000000000002  |
| Experience3 | 00000000000000000000000000000003  |
When open page by url 'http://localhost:5656/signout'
When open page by url 'http://localhost:5656/signin'
And sign in as 'test' user on sign in page
Then browser navigates to url 'http://localhost:5656/'

Scenario: Experience title is shown in experiance page header
When open page by url 'http://localhost:5656/#/experience/00000000000000000000000000000002'
Then 'Experience2' title is shown in experience page header

Scenario: All related objectives should be present in list
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
When open page by url 'http://localhost:5656/#/experience/00000000000000000000000000000002'
Then related objectives list contains only items with data
| Title       |
| Objective21 |
| Objective22 |

Scenario: Objectives list item name could contain special symbols
Given objectives are present in database
| Title                                | Id |
| ~`!@#$%^&*()_+-={[]}:;"'\|\\<,.>/?№ё | 00000000000000000000000000000001  |
Given objectives are linked to experiance 'Experience1'
| Title                                | Id |
| ~`!@#$%^&*()_+-={[]}:;"'\|\\<,.>/?№ё | 00000000000000000000000000000001  |
When open page by url 'http://localhost:5656/#/experience/00000000000000000000000000000001'
Then related objectives list contains only items with data
| Title                                |
| ~`!@#$%^&*()_+-={[]}:;"'\|\\<,.>/?№ё |

@NotFirefox
Scenario: Actions open and select are enabled if hover item of objectives list
Given objectives are present in database
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
| Objective12 | 00000000000000000000000000000002  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
| Objective12 | 00000000000000000000000000000002  |
When open page by url 'http://localhost:5656/#/experience/00000000000000000000000000000001'
And mouse hover element of related objectives list with title 'Objective11'
Then Action edit is enabled true for related objectives list item with title 'Objective11'
And Action select is enabled true for related objectives list item with title 'Objective11'

Scenario: No objectives are selected by default in related objectives list
Given objectives are present in database
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
| Objective12 | 00000000000000000000000000000002  |
| Objective13 | 00000000000000000000000000000003  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
| Objective12 | 00000000000000000000000000000002  |
| Objective13 | 00000000000000000000000000000003  |
When open page by url 'http://localhost:5656/#/experience/00000000000000000000000000000001'
Then related objectives list item with title 'Objective12' is not selected
And related objectives list item with title 'Objective11' is not selected
And related objectives list item with title 'Objective13' is not selected

#Scenario: Build action is available by default
#When open page by url 'http://localhost:5656/#/experience/00000000000000000000000000000001'
#Then build action on experiance page is available

Scenario: Download and Rebuild actions becomes available after build
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
When open page by url 'http://localhost:5656/#/experience/00000000000000000000000000000001'
And click on build button
Then download action on experiance page is available
And rebuild action on experiance page is available

Scenario: Selected objective should be highlited after selecting
Given objectives are present in database
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
| Objective12 | 00000000000000000000000000000002  |
| Objective13 | 00000000000000000000000000000003  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
| Objective12 | 00000000000000000000000000000002  |
| Objective13 | 00000000000000000000000000000003  |
When open page by url 'http://localhost:5656/#/experience/00000000000000000000000000000001'
And mouse hover element of related objectives list with title 'Objective12'
And select related objective list item with title 'Objective12'
Then related objectives list item with title 'Objective12' is selected
But related objectives list item with title 'Objective11' is not selected
And related objectives list item with title 'Objective13' is not selected

Scenario: Objective could be deselected
Given objectives are present in database
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
| Objective12 | 00000000000000000000000000000002  |
| Objective13 | 00000000000000000000000000000003  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
| Objective12 | 00000000000000000000000000000002  |
| Objective13 | 00000000000000000000000000000003  |
When open page by url 'http://localhost:5656/#/experience/00000000000000000000000000000001'
When mouse hover element of related objectives list with title 'Objective11'
And select related objective list item with title 'Objective11'
And mouse hover element of related objectives list with title 'Objective12'
And select related objective list item with title 'Objective12'
And mouse hover element of related objectives list with title 'Objective13'
And select related objective list item with title 'Objective13'
And mouse hover element of related objectives list with title 'Objective11'
And select related objective list item with title 'Objective11'
And mouse hover element of related objectives list with title 'Objective12'
And select related objective list item with title 'Objective12'
Then related objectives list item with title 'Objective11' is not selected
And related objectives list item with title 'Objective12' is not selected
And related objectives list item with title 'Objective13' is selected

Scenario: All elements of related objectives list can be made visible using scroll
Given objectives are present in database
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
| Objective12 | 00000000000000000000000000000002  |
| Objective13 | 00000000000000000000000000000003  |
| Objective14 | 00000000000000000000000000000004  |
| Objective15 | 00000000000000000000000000000005  |
| Objective16 | 00000000000000000000000000000006  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
| Objective12 | 00000000000000000000000000000002  |
| Objective13 | 00000000000000000000000000000003  |
| Objective14 | 00000000000000000000000000000004  |
| Objective15 | 00000000000000000000000000000005  |
| Objective16 | 00000000000000000000000000000006  |
When open page by url 'http://localhost:5656/#/experience/00000000000000000000000000000001'
When browser window width and height is set to 1024 and 600
And scroll related objective with title 'Objective16' into the view
Then element of related objectives list with title 'Objective16' is visible

@NotFirefox
Scenario: Open action of related objectives list item navigates to objective's editing page 
Given objectives are present in database
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11 | 00000000000000000000000000000001  |
When open page by url 'http://localhost:5656/#/experience/00000000000000000000000000000001'
When mouse hover element of related objectives list with title 'Objective11'
And click open related objective list item with title 'Objective11'
Then browser navigates to url 'http://localhost:5656/#objective/00000000000000000000000000000001?experienceId=00000000000000000000000000000001'

Scenario: Question count is shown for each related objective list item
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
Given questions related to 'Objective12' are present in database
| Title      | Id |
| Question21 | 00000000000000000000000000000003  |
When open page by url 'http://localhost:5656/#/experience/00000000000000000000000000000001'
Then question count for related objective item with title 'Objective11' is '2'
And question count for related objective item with title 'Objective12' is '1'

#Scenario: Back action of experience page navigates to experiences page
#When open page by url 'http://localhost:5656/#/experience/00000000000000000000000000000001'
#And click on back to experiences
#Then browser navigates to url 'http://localhost:5656/#experiences'

#Scenario: Next and previous actions of experience page navigate through experiences
#When open page by url 'http://localhost:5656/#/experience/00000000000000000000000000000001'
#And click on next experience
#Then browser navigates to url 'http://localhost:5656/#experience/00000000000000000000000000000002'
#When click on next experience
#Then browser navigates to url 'http://localhost:5656/#experience/00000000000000000000000000000003'
#When click on previous experience
#Then browser navigates to url 'http://localhost:5656/#experience/00000000000000000000000000000002'

Scenario: Previous experience action is not available for first experience
When open page by url 'http://localhost:5656/#/experience/00000000000000000000000000000001'
Then previous experience action is not available

Scenario: Next experience action is not available for last experience
When open page by url 'http://localhost:5656/#/experience/00000000000000000000000000000003'
Then next experience action is not available

Scenario: Building status is shown after click on build button on experience page
When open page by url 'http://localhost:5656/#/experience/00000000000000000000000000000001'
And click on build button
Then status building is shown on experience page

Scenario: Building status is shown after click on rebuild button on experience page
When open page by url 'http://localhost:5656/#/experience/00000000000000000000000000000001'
And click on build button
Then download action on experiance page is available
And rebuild action on experiance page is available
When click on rebuild button
Then status building is shown on experience page

#Scenario: Failed status is shown on experience page after build failed
#Given objectives are present in database
#| Title       | Id |
#| Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11 | 1  |
#Given objectives are linked to experiance 'Experience1'
#| Title       | Id |
#| Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11 | 1  |
#When open page by url 'http://localhost:5656/#/experience/1'
#And click on build button
#Then status failed is shown on experience page
#
#Scenario: Build action becomes available on experience page after Failed status mouse hover
#Given objectives are present in database
#| Title       | Id |
#| Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11 | 1  |
#Given objectives are linked to experiance 'Experience1'
#| Title       | Id |
#| Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11Objective11 | 1  |
#When open page by url 'http://localhost:5656/#/experience/1'
#And click on build button
#Then status failed is shown on experience page
#When mouse hover failed status element on experience page
#Then build action on experiance page is available




