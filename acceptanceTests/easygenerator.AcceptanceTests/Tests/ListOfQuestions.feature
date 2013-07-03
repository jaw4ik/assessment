Feature: ListOfQuestions
	As an author I can see list of previously created Questions related to selected Learning Objective, so I can select one for editing.

Background: 
When open page by url 'http://localhost:5656'
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |

Scenario: All questions should be present in list
Given questions related to 'Objective1' are present in database
| Title     |
| Question1 |
| Question2 |
| Question3 |
When click on objective list item with title 'Objective1'
Then questions list contains items with data 
| Title     |
| Question1 |
| Question2 |
| Question3 |

Scenario: Questions are sorted by title ascending by default
Given questions related to 'Objective1' are present in database
| Title      |
| Question_a |
| a_Question |
| Question_z |
| 1_Question |
| _Question  |
When click on objective list item with title 'Objective1'
Then questions list consists of ordered items
| Title      |
| _Question  |
| 1_Question |
| a_Question |
| Question_a |
| Question_z |
And questions list order switch is set to 'ascending'


Scenario: Questions are sorted by title descending if set descending order
Given questions related to 'Objective1' are present in database
| Title      |
| Question_a |
| a_Question |
| Question_z |
| 1_Question |
| _Question  |
When click on objective list item with title 'Objective1'
And I switch questions list order to 'ascending'
And I switch questions list order to 'descending'
Then questions list consists of ordered items
| Title      |
| Question_z |
| Question_a |
| a_Question |
| 1_Question |
| _Question  |
And questions list order switch is set to 'descending'

Scenario: Questions are sorted by title ascending if set ascending order
Given questions related to 'Objective1' are present in database
| Title      |
| Question_a |
| a_Question |
| Question_z |
| 1_Question |
| _Question  |
When click on objective list item with title 'Objective1'
And I switch questions list order to 'descending'
And I switch questions list order to 'ascending'
Then questions list consists of ordered items
| Title      |
| _Question  |
| 1_Question |
| a_Question |
| Question_a |
| Question_z |
And questions list order switch is set to 'ascending'

Scenario: Question should be highlited on mouse hover
Given questions related to 'Objective1' are present in database
| Title     |
| Question1 |
| Question2 |
| Question3 |
When click on objective list item with title 'Objective1'
And mouse hover on questions list item with title 'Question2'
Then questions list item with title ''Question2' is highlited
But questions list item with title ''Question1' is not highlited
And questions list item with title ''Question3' is not highlited

Scenario: Selected question should be highlited after selecting
Given questions related to 'Objective1' are present in database
| Title     |
| Question1 |
| Question2 |
| Question3 |
When click on objective list item with title 'Objective1'
And click on questions list item with title 'Question2'
Then questions list item with title ''Question2' is highlited
But questions list item with title ''Question1' is not highlited
And questions list item with title ''Question3' is not highlited

Scenario: Related content is shown for selected question
Given questions related to 'Objective1' are present in database
| Title     |
| Question1 |
| Question2 |
| Question3 |
Given answers related to 'Question1' are present in database
| Title   |
| Answer1 |
| Answer2 |
| Answer3 |
When click on objective list item with title 'Objective1'
And click on questions list item with title 'Question1'
Then answers list is visible
And answers list contains items with data
| Title   |
| Answer1 |
| Answer2 |
| Answer3 |

Scenario: Selected question changed if click other question
Given questions related to 'Objective1' are present in database
| Title     |
| Question1 |
| Question2 |
| Question3 |
When click on objective list item with title 'Objective1'
And click on questions list item with title 'Question1'
And click on questions list item with title 'Question2'
Then questions list item with title 'Question2' is selected
But questions list item with title 'Question1' is not selected
And questions list item with title 'Question3' is not selected

Scenario: No questions are selected by default in questions list
Given questions related to 'Objective1' are present in database
| Title      |
| Question1  |
| Question2  |
| Question3  |
When click on objective list item with title 'Objective1'
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
When click on objective list item with title 'Objective1'
And browser window width and height is set to 400 and 300
And scroll browser window to the bottom
Then last element of questions list is visible

Scenario: Actions add content and edit are enabled if hover item of questions list
Given questions related to 'Objective1' are present in database
| Title      |
| Question1 |
| Question2 |
| Question3 |
When click on objective list item with title 'Objective1'
And mouse hover on questions list item with title 'Question2'
Then Action add content is enabled true for questions list item with title 'Question2'
And Action edit is enabled true for questions list item with title 'Question2'

Scenario: Actions add content and edit should remain enabled after selecting item of questions list
Given questions related to 'Objective1' are present in database
| Title      |
| Question1 |
| Question2 |
| Question3 |
When click on objective list item with title 'Objective1'
And click on questions list item with title 'Question2'
And mouse hover on questions list item with title 'Question3'
Then Action add content is enabled true for questions list item with title 'Question2'
And Action edit is enabled true for questions list item with title 'Question2'
And Action add content is enabled true for questions list item with title 'Question3'
And Action edit is enabled true for questions list item with title 'Question3'

Scenario: Edit question action of questions list navigates to question's editing page 
Given questions related to 'Objective1' are present in database
| Title      | Id |
| Question1  | 1  |
When click on objective list item with title 'Objective1'
And mouse hover element of questions list with title 'Question1'
And click on edit question
Then browser navigates to url "http://localhost:5656/#/objective/1/question/1"


Scenario: Back action of questions list navigates to objectives list page 
Given questions related to 'Objective1' are present in database
| Title     |
| Question1 |
When click on objective list item with title 'Objective1'
And click on back from questions list
Then browser navigates to url "http://localhost:5656/#/"
