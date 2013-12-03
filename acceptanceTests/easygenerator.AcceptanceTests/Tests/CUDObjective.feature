@CUDObjective
Feature: CUDObjective
	As an author I can define by creating new Learning Objective
	 what learner's behavior and how will be changed after getting Experience that will include this Learning Objective,
	  so I do not create content not related to the learning objectives. 


Background:
Given clear data context
#When open page by url 'http://localhost:5656/signout'
#When open page by url 'http://localhost:5656/signin'
#And sign in as 'test' user on sign in page
#Then browser navigates to url 'http://localhost:5656/'


Scenario: Add objective action on objective list page navigates to create objective view
When open page by url 'http://localhost:5656/#objectives'
And press add new objective button on objective list page
Then browser navigates to url 'http://localhost:5656/#objective/create'

Scenario: Edit objective title text block is active when open create objective view
When open page by url 'http://localhost:5656/#objective/create'
Then edit title text block is active on create view

Scenario: Edit objective title text block is empty when open create objective view
When open page by url 'http://localhost:5656/#objective/create'
Then edit title text block is empty on create view

Scenario: Buttons CreateAndEdit and CreateAndNew are disabled if title text is empty on create objective view
When open page by url 'http://localhost:5656/#objective/create'
Then buttons CreateAndEdit and CreateAndNew are enabled false on create view
When input 'text' into title edit area on create view
And clear edit area on create view
Then buttons CreateAndEdit and CreateAndNew are enabled false on create view

Scenario: Buttons CreateAndEdit and CreateAndNew are enabled if title text is not empty on create objective view
When open page by url 'http://localhost:5656/#objective/create'
And input 'text' into title edit area on create view
Then buttons CreateAndEdit and CreateAndNew are enabled true on create view

Scenario: Back action on create objective view navigates back to objectives list page
When open page by url 'http://localhost:5656/#objective/create'
And click back button on create view
Then browser navigates to url 'http://localhost:5656/#objectives'

Scenario: Max allowed chars count is shown in edit title text block on create view from the beginning
When open page by url 'http://localhost:5656/#objective/create'
Then max chars count '255' is shown in chars counter on create view

Scenario: correct input chars count and max chars count are shown in edit title text block on create view
When open page by url 'http://localhost:5656/#objective/create'
And input 'text' into title edit area on create view
Then chars count '4' is shown in chars counter on create view
And max chars count '255' is shown in chars counter on create view

Scenario: Not possible to save more than 255 charracters in title text on create view
When open page by url 'http://localhost:5656/#objective/create'
And input 'WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW WWW' into title edit area on create view
Then chars count '256' is shown in chars counter on create view
And buttons CreateAndEdit and CreateAndNew are enabled false on create view
And title text block marked with error on create view
And chars counter marked with error on create view

Scenario: Changes are not saved if go back from create view
Given objectives are present in database
| Title      | Id |
| Objective1 | 00000000000000000000000000000001  |
When open page by url 'http://localhost:5656/#objective/create'
And input 'text' into title edit area on create view
And click back button on create view
Then browser navigates to url 'http://localhost:5656/#objectives'
And objectives tiles list contains only items with data
| Title      |
| Objective1 |

Scenario: Action CreateAndEdit navigates to newly created objective
Given objectives are present in database
| Title      | Id |
| Objective1 | 00000000000000000000000000000001  |
| Objective2 | 00000000000000000000000000000002  |
| Objective3 | 00000000000000000000000000000003  |
When open page by url 'http://localhost:5656/#objective/create'
And input 'Objective4' into title edit area on create view
And click on create and edit button on create view
Then browser navigates to url that contains 'http://localhost:5656/#objective/'
And 'Objective4' title is shown in objective page header
#And 'Learning objectives' text is shown in back to objectives list link

Scenario: Action CreateAndNew saves changes to newly created objective and navigates to new create objective view
When open page by url 'http://localhost:5656/#objective/create'
And input 'Objective1' into title edit area on create view
And click on create and new button on create view
Then browser navigates to url 'http://localhost:5656/#objective/create'
When click back button on create view
Then browser navigates to url 'http://localhost:5656/#objectives'
And objectives tiles list contains only items with data
| Title      |
| Objective1 |

Scenario: Several objectives can be created via CreateAndNew action
When open page by url 'http://localhost:5656/#objective/create'
And input 'Objective3' into title edit area on create view
And click on create and new button on create view
And input 'Objective1' into title edit area on create view
And click on create and new button on create view
And input 'Objective2' into title edit area on create view
And click on create and new button on create view
And click back button on create view
Then browser navigates to url 'http://localhost:5656/#objectives'
And objectives tiles list contains only items with data
| Title      |
| Objective1 |
| Objective2 |
| Objective3 |

Scenario: Special symbols could be entered into title edit area on create view and saved
When open page by url 'http://localhost:5656/#objective/create'
And input '~`!@#$%^&*()_+-={[]}:;"'|\<,.>/?' into title edit area on create view
And click on create and edit button on create view
Then browser navigates to url that contains 'http://localhost:5656/#objective/'
And '~`!@#$%^&*()_+-={[]}:;"'|\<,.>/?' title is shown in objective page header

Scenario: It is possible to edit objective title on objective page
Given objectives are present in database
| Title      | Id |
| Objective1 | 00000000000000000000000000000001  |
When open page by url 'http://localhost:5656/#objectives'
When open page by url 'http://localhost:5656/#objective/00000000000000000000000000000001'
And edit objective title with new text 'Objective2' on objective page
And click on home link
And open page by url 'http://localhost:5656/#objectives'
Then objectives tiles list contains only items with data
| Title      |
| Objective2 |

Scenario: Not possible to make existing objective title empty
Given objectives are present in database
| Title      | Id |
| Objective1 | 00000000000000000000000000000001  |
When open page by url 'http://localhost:5656/#objectives'
When open page by url 'http://localhost:5656/#objective/00000000000000000000000000000001'
And clear header title text field on objective page
Then title text block marked with error on objective page
And chars counter marked with error on objective page
When click on home link
And open page by url 'http://localhost:5656/#objectives'
Then objectives tiles list contains only items with data
| Title      |
| Objective1 |

Scenario: Delete objective button becomes available after objective was selected
Given objectives are present in database
| Title      | Id |
| Objective1 | 00000000000000000000000000000001  |
| Objective2 | 00000000000000000000000000000002  |
When open page by url 'http://localhost:5656/#objectives'
And mouse hover element of objectives list with title 'Objective2'
And select objective list item with title 'Objective2'
Then delete button is displayed true on objectives list page

Scenario: Delete objective button is not available if there is no selected objectives
Given objectives are present in database
| Title      | Id |
| Objective1 | 00000000000000000000000000000001  |
| Objective2 | 00000000000000000000000000000002  |
When open page by url 'http://localhost:5656/#objectives'
Then delete button is displayed false on objectives list page
When mouse hover element of objectives list with title 'Objective2'
And select objective list item with title 'Objective2'
And select objective list item with title 'Objective2'
Then delete button is displayed false on objectives list page

Scenario: Selected objective can be deleted
Given objectives are present in database
| Title      | Id |
| Objective1 | 00000000000000000000000000000001  |
| Objective2 | 00000000000000000000000000000002  |
| Objective3 | 00000000000000000000000000000003  |
When open page by url 'http://localhost:5656/#objectives'
And mouse hover element of objectives list with title 'Objective2'
And select objective list item with title 'Objective2'
And click on delete button on objectives list page
Then objectives tiles list contains only items with data
| Title      |
| Objective1 |
| Objective3 |
When refresh page
Then objectives tiles list contains only items with data
| Title      |
| Objective1 |
| Objective3 |

Scenario: Objective can not be deleted if it contains questions
Given objectives are present in database
| Title      | Id |
| Objective1 | 00000000000000000000000000000001  |
Given questions related to 'Objective1' are present in database
| Title     | Id |
| Question1 | 00000000000000000000000000000001  |
When open page by url 'http://localhost:5656/#objectives'
And mouse hover element of objectives list with title 'Objective1'
And select objective list item with title 'Objective1'
And click on delete button on objectives list page
Then error notification is displayed true on objectives list page
And objectives tiles list contains only items with data
| Title      |
| Objective1 |

