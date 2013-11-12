@ListOfQuestions
Feature: ListOfQuestions
	As an author I can see list of previously created Questions related to selected Learning Objective, so I can select one for editing.

Background: 
Given clear data context
Given objectives are present in database
| Title      | Id                               |
| Objective1 | 00000000000000000000000000000001 |
| Objective2 | 00000000000000000000000000000002 |
When open page by url 'http://localhost:5656/signout'
When open page by url 'http://localhost:5656/signin'
And sign in as 'test' user on sign in page
Then browser navigates to url 'http://localhost:5656/'

Scenario: All questions should be present in list
Given questions related to 'Objective1' are present in database
| Title     |
| Question1 |
| Question2 |
| Question3 |
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001'
Then questions list contains items with data 
| Title     |
| Question1 |
| Question2 |
| Question3 |

Scenario: Questions list item name could contain special symbols
Given questions related to 'Objective1' are present in database
| Title                                |
| ~`!@#$%^&*()_+-={[]}:;"'\|\\<,.>/?№ё |
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001'
Then questions list contains items with data  
| Title                                |
| ~`!@#$%^&*()_+-={[]}:;"'\|\\<,.>/?№ё |

Scenario: Only questions related to selected objective should be present in list
Given questions related to 'Objective1' are present in database
| Title      |
| Question11 |
| Question12 |
| Question13 |
Given questions related to 'Objective2' are present in database
| Title      |
| Question21 |
| Question22 |
| Question23 |
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000002'
Then questions list consists of ordered items
| Title      |
| Question21 |
| Question22 |
| Question23 |

Scenario: Questions are sorted by title ascending by default
Given questions related to 'Objective1' are present in database
| Title      |
| Question_a |
| a_Question |
| Question_z |
| 1_Question |
| _Question  |
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001'
Then questions list consists of ordered items
| Title      |
| 1_Question |
| _Question  |
| a_Question |
| Question_a |
| Question_z |
#And questions list order switch is set to 'ascending'


#Scenario: Questions are sorted by title descending if set descending order
#Given questions related to 'Objective1' are present in database
#| Title      |
#| Question_a |
#| a_Question |
#| Question_z |
#| 1_Question |
#| _Question  |
#When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001'
#And I switch questions list order to 'ascending'
#And I switch questions list order to 'descending'
#Then questions list consists of ordered items
#| Title      |
#| Question_z |
#| Question_a |
#| a_Question |
#| _Question  |
#| 1_Question |
#And questions list order switch is set to 'descending'

#Scenario: Questions are sorted by title ascending if set ascending order
#Given questions related to 'Objective1' are present in database
#| Title      |
#| Question_a |
#| a_Question |
#| Question_z |
#| 1_Question |
#| _Question  |
#When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001'
#And I switch questions list order to 'descending'
#And I switch questions list order to 'ascending'
#Then questions list consists of ordered items
#| Title      |
#| 1_Question |
#| _Question  |
#| a_Question |
#| Question_a |
#| Question_z |
#And questions list order switch is set to 'ascending'

Scenario: No questions are selected by default in questions list
Given questions related to 'Objective1' are present in database
| Title      |
| Question1  |
| Question2  |
| Question3  |
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001'
Then questions list item with title 'Question2' is not selected
And questions list item with title 'Question1' is not selected
And questions list item with title 'Question3' is not selected

Scenario: All elements of questions list can be made visible using scroll
Given questions related to 'Objective1' are present in database
| Title      |
| Question1  |
| Question2  |
| Question3  |
| Question4  |
| Question5  |
| Question6  |
| Question7  |
| Question8  |
| Question9  |
| Question10 |
| Question11 |
| Question12 |
| Question13 |
| Question14 |
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001'
And browser window width and height is set to 1024 and 600
And scroll questions list item with title 'Question14' into the view
Then element with title 'Question14' of questions list is visible

@NotFirefox
Scenario: Actions select and edit are enabled if hover item of questions list
Given questions related to 'Objective1' are present in database
| Title     |
| Question1 |
| Question2 |
| Question3 |
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001'
And mouse hover element of questions list with title 'Question2'
Then Action select is enabled true for questions list item with title 'Question2'
And Action open is enabled true for questions list item with title 'Question2'

Scenario: Selected question should remain selected
Given questions related to 'Objective1' are present in database
| Title     |
| Question1 |
| Question2 |
| Question3 |
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001'
And mouse hover element of questions list with title 'Question1'
And click on select questions list item with title 'Question1'
And mouse hover element of questions list with title 'Question3'
And click on select questions list item with title 'Question3'
Then questions list item with title 'Question1' is selected
And questions list item with title 'Question3' is selected
But questions list item with title 'Question2' is not selected

Scenario: Question could be deselected
Given questions related to 'Objective1' are present in database
| Title     |
| Question1 |
| Question2 |
| Question3 |
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001'
And mouse hover element of questions list with title 'Question1'
And click on select questions list item with title 'Question1'
And mouse hover element of questions list with title 'Question2'
And click on select questions list item with title 'Question2'
And mouse hover element of questions list with title 'Question3'
And click on select questions list item with title 'Question3'
And mouse hover element of questions list with title 'Question1'
And click on select questions list item with title 'Question1'
And mouse hover element of questions list with title 'Question2'
And click on select questions list item with title 'Question2'
Then questions list item with title 'Question1' is not selected
And questions list item with title 'Question2' is not selected
But questions list item with title 'Question3' is selected

Scenario: Edit question action of questions list navigates to question's editing page 
Given questions related to 'Objective1' are present in database
| Title     | Id                               |
| Question1 | 00000000000000000000000000000001 |
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001'
And mouse hover element of questions list with title 'Question1'
And click on open question with title 'Question1'
Then browser navigates to url 'http://localhost:5656/#objective/00000000000000000000000000000001/question/00000000000000000000000000000001'


#Scenario: Back action of questions list navigates to objectives list page 
#Given questions related to 'Objective1' are present in database
#| Title     |
#| Question1 |
#When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001'
#And click on back from questions list
#Then browser navigates to url 'http://localhost:5656/#objectives'
