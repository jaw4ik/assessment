@ObjectivesList
Feature: ListOfObjectives
	As an author I want to see list of previously created Learning Objectives, so I could select certain Learning Objective to start working with related content.

Background: 
When open page by url 'http://localhost:5656'

Scenario: All objectives should be present in list
Given objectives are present in database
| Title      |
| Objective1 |
| Objective2 |
| Objective3 |
Then objectives tiles list contains items with data 
| Title      |
| Objective1 |
| Objective2 |
| Objective3 |


Scenario: Objectives are sorted by title ascending by default
Given objectives are present in database
| Title       |
| Objective_a |
| a_Objective |
| Objective_z |
| 1_Objective |
| _Objective  |
Then objectives tiles list consists of ordered items
| Title       |
| _Objective  |
| 1_Objective |
| a_Objective |
| Objective_a |
| Objective_z |
And objectives list order switch is set to 'ascending'


Scenario: Objectives are sorted by title descending if set descending order
Given objectives are present in database
| Title       |
| Objective_a |
| a_Objective |
| Objective_z |
| 1_Objective |
| _Objective  |
When I switch objectives list order to 'ascending'
And I switch objectives list order to 'descending'
Then objectives tiles list consists of ordered items
| Title       |
| Objective_z |
| Objective_a |
| a_Objective |
| 1_Objective |
| _Objective  |
And objectives list order switch is set to 'descending'

Scenario: Objectives are sorted by title ascending if set ascending order
Given objectives are present in database
| Title       |
| Objective_a |
| a_Objective |
| Objective_z |
| 1_Objective |
| _Objective  |
When I switch objectives list order to 'descending'
And I switch objectives list order to 'ascending'
Then objectives tiles list consists of ordered items
| Title       |
| _Objective  |
| 1_Objective |
| a_Objective |
| Objective_a |
| Objective_z |
And objectives list order switch is set to 'ascending'

Scenario: Selected objective should be highlited after selecting
Given objectives are present in database
| Title      |
| Objective1 |
| Objective2 |
| Objective3 |
When click on objective list item with title 'Objective2'
Then objective list item with title 'Objective2' is selected
But objective list item with title 'Objective1' is not selected
And objective list item with title 'Objective3' is not selected

Scenario: Selected objective changed if click other objective
Given objectives are present in database
| Title      |
| Objective1 |
| Objective2 |
| Objective3 |
When click on objective list item with title 'Objective1'
And click on objective list item with title 'Objective2'
Then objective list item with title 'Objective2' is selected
But objective list item with title 'Objective1' is not selected
And objective list item with title 'Objective3' is not selected


Scenario: No objectives are selected by default in objectives list
Given objectives are present in database
| Title      |
| Objective1 |
| Objective2 |
| Objective3 |
Then objective list item with title 'Objective2' is not selected
And objective list item with title 'Objective1' is not selected
And objective list item with title 'Objective3' is not selected


Scenario Outline: Columns count should depend on screen width
Given objectives are present in database
| Title      |
| Objective1 |
| Objective2 |
| Objective3 |
| Objective4 |
| Objective5 |
When browser window width and height is set to <window width> and 600 
Then objectives list is displayed in <columns count> columns
Examples: 
| window width | columns count |
| 400          | 1             |
| 800          | 2             |
| 1024         | 3             |
| 1920         | 6             |


Scenario: All elements of objectives list can be made visible using scroll
Given objectives are present in database
| Title      |
| Objective1 |
| Objective2 |
| Objective3 |
| Objective4 |
| Objective5 |
When browser window width and height is set to 400 and 300
And scroll browser window to the bottom
Then last element of objectives list is visible


Scenario: Actions open and select are enabled if hover item of objectives list
Given objectives are present in database
| Title      |
| Objective1 |
| Objective2 |
| Objective3 |
When mouse hover element of objectives list with title 'Objective1'
Then Action open is enabled true for objectives list item with title 'Objective1'
And Action select is enabled true for objectives list item with title 'Objective1'


Scenario: Open action of objectives list item navigates to objective's editing page 
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
When mouse hover element of objectives list with title 'Objective1'
And click on objective list item with title 'Objective1'
Then browser navigates to url "http://localhost:666/objective/1"




