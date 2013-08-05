@ExperiencesList
Feature: ListOfPublications
	As an author I want to see list of previously created Publications,
	so I could correct needed settings and perform publication once more without defining all the settings each time. 


Scenario: All publications should be present in list
Given publications are present in database
| Title        |
| Publication1 |
| Publication2 |
| Publication3 |
When open page by url 'http://localhost:5656/#/experiences'
Then publications tiles list contains items with data 
| Title        |
| Publication1 |
| Publication2 |
| Publication3 |


Scenario: Publications list item name could contain special symbols
Given publications are present in database
| Title      |
| ~`!@#$%^&*()_+-={[]}:;"'\|\\<,.>/?№ё |
When open page by url 'http://localhost:5656/#/experiences'
Then publications tiles list contains items with data 
| Title                                |
| ~`!@#$%^&*()_+-={[]}:;"'\|\\<,.>/?№ё |

Scenario: Publications are sorted by title ascending by default
Given publications are present in database
| Title         |
| Publication_a |
| a_Publication |
| Publication_z |
| 1_Publication |
| _Publication  |
When open page by url 'http://localhost:5656/#/experiences'
Then publications tiles list consists of ordered items
| Title         |
| 1_Publication |
| _Publication  |
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
| _Publication  |
| 1_Publication |
When open page by url 'http://localhost:5656/#/experiences'
And I switch publications list order to 'ascending'
And I switch publications list order to 'descending'
Then publications tiles list consists of ordered items
| Title         |
| Publication_z |
| Publication_a |
| a_Publication |
| _Publication  |
| 1_Publication |
And publications list order switch is set to 'descending'

Scenario: Publications are sorted by title ascending if set ascending order
Given publications are present in database
| Title         |
| Publication_a |
| a_Publication |
| Publication_z |
| 1_Publication |
| _Publication  |
When open page by url 'http://localhost:5656/#/experiences'
And I switch publications list order to 'descending'
And I switch publications list order to 'ascending'
Then publications tiles list consists of ordered items
| Title         |
| 1_Publication |
| _Publication  |
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
When open page by url 'http://localhost:5656/#/experiences'
And mouse hover element of publications list with title 'Publication2'
And select publication list item with title 'Publication2'
Then publication list item with title 'Publication2' is selected
But publication list item with title 'Publication1' is not selected
And publication list item with title 'Publication3' is not selected

Scenario: Publication could be deselected
Given publications are present in database
| Title        |
| Publication1 |
| Publication2 |
| Publication3 |
When open page by url 'http://localhost:5656/#/experiences'
And mouse hover element of publications list with title 'Publication1'
And select publication list item with title 'Publication1'
And mouse hover element of publications list with title 'Publication2'
And select publication list item with title 'Publication2'
And mouse hover element of publications list with title 'Publication3'
And select publication list item with title 'Publication3'
And mouse hover element of publications list with title 'Publication1'
And select publication list item with title 'Publication1'
And mouse hover element of publications list with title 'Publication2'
And select publication list item with title 'Publication2'
Then publication list item with title 'Publication1' is not selected
But publication list item with title 'Publication2' is not selected
And publication list item with title 'Publication3' is selected

Scenario: No publications are selected by default in publications list
Given publications are present in database
| Title        |
| Publication1 |
| Publication2 |
| Publication3 |
When open page by url 'http://localhost:5656/#/experiences'
Then publication list item with title 'Publication2' is not selected
And publication list item with title 'Publication1' is not selected
And publication list item with title 'Publication3' is not selected


Scenario Outline: Publications list columns count should depend on screen width
Given publications are present in database
| Title        |
| Publication1 |
| Publication2 |
| Publication3 |
| Publication4 |
| Publication5 |
When open page by url 'http://localhost:5656/#/experiences'
And browser window width and height is set to <window width> and 600 
Then publications list is displayed in <columns count> columns
Examples: 
| window width | columns count |
| 640          | 1             |
| 800          | 2             |
| 1200         | 3             |
| 1600         | 3             |


Scenario: All elements of publications list can be made visible using scroll
Given publications are present in database
| Title        |
| Publication1 |
| Publication2 |
| Publication3 |
| Publication4 |
| Publication5 |
When open page by url 'http://localhost:5656/#/experiences'
And browser window width and height is set to 600 and 600
And scroll publication with title 'Publication5' into the view
Then element with title 'Publication5' of publications list is visible


@NotFirefox
Scenario: Actions open and select are enabled if hover item of publications list
Given publications are present in database
| Title        |
| Publication1 |
| Publication2 |
| Publication3 |
When open page by url 'http://localhost:5656/#/experiences'
And mouse hover element of publications list with title 'Publication1'
Then Action open is enabled true for publications list item with title 'Publication1'
And Action select is enabled true for publications list item with title 'Publication1'
And Action build is enabled true for publications list item with title 'Publication1'


Scenario: Open action of publications list item navigates to publication's editing page 
Given publications are present in database
| Title        | Id |
| Publication1 | 1  |
When open page by url 'http://localhost:5656/#/experiences'
And mouse hover element of publications list with title 'Publication1'
And click open publication list item with title 'Publication1'
Then browser navigates to url 'http://localhost:5656/#/experience/1'

Scenario: Navigation works using tab navigation to objectives
When open page by url 'http://localhost:5656/#/experiences'
And click on tab objectives link on expiriences list page
Then browser navigates to url 'http://localhost:5656/#/objectives'

Scenario: Temp
When unzip puckage to tmp
And open page by url 'http://ctest.corp.ism-ukraine.com/tmp/'
Then browser navigates to url 'http://ctest.corp.ism-ukraine.com/tmp/'
