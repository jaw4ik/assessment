@ListOfObjectives
Feature: ListOfObjectives
	As an author I want to see list of previously created Learning Objectives, so I could select certain Learning Objective to start working with related content.

Background: 

Given clear data context


Scenario: All objectives should be present in list
Given objectives are present in database
| Title      |
| Objective1 |
| Objective2 |
| Objective3 |
When open page by url 'http://localhost:5656/#objectives'
Then objectives tiles list contains items with data 
| Title      |
| Objective1 |
| Objective2 |
| Objective3 |

Scenario: Objectives list item name could contain special symbols
Given objectives are present in database
| Title      |
| ~`!@#$%^&*()_+-={[]}:;"'\|\\<,.>/?№ё |
When open page by url 'http://localhost:5656/#objectives'
Then objectives tiles list contains items with data 
| Title                                |
| ~`!@#$%^&*()_+-={[]}:;"'\|\\<,.>/?№ё |

Scenario: Objectives are sorted by title ascending by default
Given objectives are present in database
| Title       |
| Objective_a |
| objective_b |
| a_Objective |
| Objective_z |
| 1_Objective |
| _Objective  |
When open page by url 'http://localhost:5656/#objectives'
Then objectives tiles list consists of ordered items
| Title       |
| 1_Objective |
| _Objective  |
| a_Objective |
| Objective_a |
| objective_b |
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
When open page by url 'http://localhost:5656/#objectives'
When I switch objectives list order to 'ascending'
And I switch objectives list order to 'descending'
Then objectives tiles list consists of ordered items
| Title       |
| Objective_z |
| Objective_a |
| a_Objective |
| _Objective  |
| 1_Objective |
And objectives list order switch is set to 'descending'

Scenario: Objectives are sorted by title ascending if set ascending order
Given objectives are present in database
| Title       |
| Objective_a |
| a_Objective |
| Objective_z |
| 1_Objective |
| _Objective  |
When open page by url 'http://localhost:5656/#objectives'
When I switch objectives list order to 'descending'
And I switch objectives list order to 'ascending'
Then objectives tiles list consists of ordered items
| Title       |
| 1_Objective |
| _Objective  |
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
When open page by url 'http://localhost:5656/#objectives'
When mouse hover element of objectives list with title 'Objective2'
And select objective list item with title 'Objective2'
Then objective list item with title 'Objective2' is selected
But objective list item with title 'Objective1' is not selected
And objective list item with title 'Objective3' is not selected

Scenario: Objective could be deselected
Given objectives are present in database
| Title      |
| Objective1 |
| Objective2 |
| Objective3 |
When open page by url 'http://localhost:5656/#objectives'
When mouse hover element of objectives list with title 'Objective1'
And select objective list item with title 'Objective1'
And mouse hover element of objectives list with title 'Objective2'
And select objective list item with title 'Objective2'
And mouse hover element of objectives list with title 'Objective3'
And select objective list item with title 'Objective3'
And mouse hover element of objectives list with title 'Objective1'
And select objective list item with title 'Objective1'
And mouse hover element of objectives list with title 'Objective2'
And select objective list item with title 'Objective2'
Then objective list item with title 'Objective1' is not selected
But objective list item with title 'Objective2' is not selected
And objective list item with title 'Objective3' is selected

Scenario: No objectives are selected by default in objectives list
Given objectives are present in database
| Title      |
| Objective1 |
| Objective2 |
| Objective3 |
When open page by url 'http://localhost:5656/#objectives'
Then objective list item with title 'Objective2' is not selected
And objective list item with title 'Objective1' is not selected
And objective list item with title 'Objective3' is not selected


Scenario Outline: Objectives list columns count should depend on screen width
Given objectives are present in database
| Title      |
| Objective1 |
| Objective2 |
| Objective3 |
| Objective4 |
| Objective5 |
When open page by url 'http://localhost:5656/#objectives'
When browser window width and height is set to <window width> and 600 
Then objectives list is displayed in <columns count> columns
Examples: 
| window width | columns count |
| 650          | 1             |
| 800          | 2             |
| 1200         | 3             |
| 1600         | 3             |


Scenario: All elements of objectives list can be made visible using scroll
Given objectives are present in database
| Title      |
| Objective1 |
| Objective2 |
| Objective3 |
| Objective4 |
| Objective5 |
When open page by url 'http://localhost:5656/#objectives'
When browser window width and height is set to 600 and 600
And scroll objective with title 'Objective5' into the view
Then element of objectives list with title 'Objective5' is visible

@NotFirefox
Scenario: Actions open and select are enabled if hover item of objectives list
Given objectives are present in database
| Title      |
| Objective1 |
| Objective2 |
| Objective3 |
When open page by url 'http://localhost:5656/#objectives'
When mouse hover element of objectives list with title 'Objective1'
Then Action open is enabled true for objectives list item with title 'Objective1'
And Action select is enabled true for objectives list item with title 'Objective1'


@NotFirefox
Scenario: Open action of objectives list item navigates to objective's editing page 
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
When open page by url 'http://localhost:5656/#objectives'
When mouse hover element of objectives list with title 'Objective1'
And click open objective list item with title 'Objective1'
Then browser navigates to url 'http://localhost:5656/#objective/1'


Scenario: Navigation works using tab navigation to expiriences from objectives list
When open page by url 'http://localhost:5656/#/objectives'
And click on tab expiriences link on objectives
Then browser navigates to url 'http://localhost:5656/#experiences' 




