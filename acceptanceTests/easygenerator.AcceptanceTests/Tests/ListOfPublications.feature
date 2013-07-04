Feature: ListOfPublications
	As an author I want to see list of previously created Publications,
	so I could correct needed settings and perform publication once more without defining all the settings each time. 

Background: 
When open page by url 'http://localhost:5656/#/publications'

Scenario: All publications should be present in list
Given publications are present in database
| Title        |
| Publication1 |
| Publication2 |
| Publication3 |
Then publications tiles list contains items with data 
| Title        |
| Publication1 |
| Publication2 |
| Publication3 |


Scenario: Publications are sorted by title ascending by default
Given publications are present in database
| Title         |
| Publication_a |
| a_Publication |
| Publication_z |
| 1_Publication |
| _Publication  |
Then publications tiles list consists of ordered items
| Title         |
| _Publication  |
| 1_Publication |
| a_Publication |
| Publication_a |
| Publication_z |
And publications list order switch is set to 'ascending'


Scenario: Publications are sorted by title descending if set descending order
Given publications are present in database
| Title         |
| Publication_a |
| a_Publication |
| Publication_z |
| 1_Publication |
| _Publication  |
When I switch publications list order to 'ascending'
And I switch publications list order to 'descending'
Then publications tiles list consists of ordered items
| Title         |
| Publication_z |
| Publication_a |
| a_Publication |
| 1_Publication |
| _Publication  |
And publications list order switch is set to 'descending'

Scenario: Publications are sorted by title ascending if set ascending order
Given publications are present in database
| Title         |
| Publication_a |
| a_Publication |
| Publication_z |
| 1_Publication |
| _Publication  |
When I switch publications list order to 'descending'
And I switch publications list order to 'ascending'
Then publications tiles list consists of ordered items
| Title         |
| _Publication  |
| 1_Publication |
| a_Publication |
| Publication_a |
| Publication_z |
And publications list order switch is set to 'ascending'

Scenario: Selected publication should be highlited after selecting
Given publications are present in database
| Title        |
| Publication1 |
| Publication2 |
| Publication3 |
When click on publication list item with title 'Publication2'
Then publication list item with title 'Publication2' is selected
But publication list item with title 'Publication1' is not selected
And publication list item with title 'Publication3' is not selected

Scenario: Selected publication changed if click other publication
Given publications are present in database
| Title        |
| Publication1 |
| Publication2 |
| Publication3 |
When click on publication list item with title 'Publication1'
And click on publication list item with title 'Publication2'
Then publication list item with title 'Publication2' is selected
But publication list item with title 'Publication1' is not selected
And publication list item with title 'Publication3' is not selected


Scenario: No publications are selected by default in publications list
Given publications are present in database
| Title        |
| Publication1 |
| Publication2 |
| Publication3 |
Then publication list item with title 'Publication2' is not selected
And publication list item with title 'Publication1' is not selected
And publication list item with title 'Publication3' is not selected


Scenario Outline: Columns count should depend on screen width
Given publications are present in database
| Title        |
| Publication1 |
| Publication2 |
| Publication3 |
| Publication4 |
| Publication5 |
When browser window width and height is set to <window width> and 600 
Then publications list is displayed in <columns count> columns
Examples: 
| window width | columns count |
| 400          | 1             |
| 800          | 2             |
| 1024         | 3             |
| 1920         | 6             |


Scenario: All elements of publications list can be made visible using scroll
Given publications are present in database
| Title        |
| Publication1 |
| Publication2 |
| Publication3 |
| Publication4 |
| Publication5 |
When browser window width and height is set to 400 and 300
And scroll browser window to the bottom
Then last element of publications list is visible


Scenario: Actions open and select are enabled if hover item of publications list
Given publications are present in database
| Title        |
| Publication1 |
| Publication2 |
| Publication3 |
When mouse hover element of publications list with title 'Publication1'
Then Action open is enabled true for publications list item with title 'Publication1'
And Action select is enabled true for publications list item with title 'Publication1'


Scenario: Open action of publications list item navigates to publication's editing page 
Given publications are present in database
| Title        | Id |
| Publication1 | 1  |
When mouse hover element of publications list with title 'Publication1'
And click on publication list item with title 'Publication1'
Then browser navigates to url "http://localhost:5656/#/publication/1"




