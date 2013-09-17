@CUDExperience
Feature: CUDExperience
	As an author I can create new set of learner's experience settings and save it in form of Experience,
	 so I could build package with same set of settings several times if I need.
	As an author I can update set of learner's experience settings in existing Experience,
	 so I could build package with some specific setting adjusted.
	As an author I can delete exisitng Experience, so I do not keep not needed sets of settings.


Background:
Given clear data context


Scenario: Add experience action on experiences list page navigates to create experience view
When open page by url 'http://localhost:5656/#experiences'
And press add new experience button on experiences list page
Then browser navigates to url 'http://localhost:5656/#experience/create'

Scenario: Edit experience title text block is active when open create experience view
When open page by url 'http://localhost:5656/#experience/create'
Then edit title text block is active on create view

Scenario: Edit experience title text block is empty when open create experience view
When open page by url 'http://localhost:5656/#experience/create'
Then edit title text block is empty on create view

Scenario: Buttons CreateAndEdit and CreateAndNew are disabled if template is choosen but title text is empty on create experience view
When open page by url 'http://localhost:5656/#experience/create'
And choose default template on create experience view
Then buttons CreateAndEdit and CreateAndNew are enabled false on create view
When input 'text' into title edit area on create view
And clear edit area on create view
Then buttons CreateAndEdit and CreateAndNew are enabled false on create view

Scenario: Buttons CreateAndEdit and CreateAndNew are disabled if title text is not empty but template is not choosen on create experience view
When open page by url 'http://localhost:5656/#experience/create'
Then buttons CreateAndEdit and CreateAndNew are enabled false on create view
When input 'text' into title edit area on create view
Then buttons CreateAndEdit and CreateAndNew are enabled false on create view

Scenario: Buttons CreateAndEdit and CreateAndNew are enabled if template is choosen and title text is not empty on create experience view
When open page by url 'http://localhost:5656/#experience/create'
And choose default template on create experience view
And input 'text' into title edit area on create view
Then buttons CreateAndEdit and CreateAndNew are enabled true on create view

Scenario: Back action on create experience view navigates back to experiences list page
When open page by url 'http://localhost:5656/#experience/create'
And click back button on create view
Then browser navigates to url 'http://localhost:5656/#experiences'

Scenario: Max allowed chars count is shown in edit title text block on create view from the beginning
When open page by url 'http://localhost:5656/#experience/create'
Then max chars count '255' is shown in chars counter on create view

Scenario: correct input chars count and max chars count are shown in edit title text block on create view
When open page by url 'http://localhost:5656/#experience/create'
And input 'text' into title edit area on create view
Then chars count '4' is shown in chars counter on create view
And max chars count '255' is shown in chars counter on create view

Scenario: Not possible to save more than 255 charracters in title text on create view
When open page by url 'http://localhost:5656/#experience/create'
And choose default template on create experience view
And input 'WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW WWW' into title edit area on create view
Then chars count '256' is shown in chars counter on create view
And buttons CreateAndEdit and CreateAndNew are enabled false on create view
And title text block marked with error on create view
And chars counter marked with error on create view

Scenario: Changes are not saved if go back from create view
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
When open page by url 'http://localhost:5656/#experience/create'
And choose default template on create experience view
And input 'text' into title edit area on create view
And click back button on create view
Then browser navigates to url 'http://localhost:5656/#experiences'
And publications tiles list consists of ordered items
| Title       |
| Experience1 |

Scenario: Action CreateAndEdit navigates to newly created experience
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
| Experience2 | 2  |
| Experience3 | 3  |
When open page by url 'http://localhost:5656/#experience/create'
And choose default template on create experience view
And input 'Experience4' into title edit area on create view
And click on create and edit button on create view
Then browser navigates to url that contains 'http://localhost:5656/#experience/'
And 'Experience4' title is shown in experience page header
And 'Learning experiences' text is shown in back to experiences list link

Scenario: Action CreateAndNew saves changes to newly created experience and navigates to new create experience view
When open page by url 'http://localhost:5656/#experience/create'
And choose default template on create experience view
And input 'Experience1' into title edit area on create view
And click on create and new button on create view
Then browser navigates to url 'http://localhost:5656/#experience/create'
When click back button on create view
Then browser navigates to url 'http://localhost:5656/#experiences'
And publications tiles list consists of ordered items
| Title       |
| Experience1 |

Scenario: Several experiences can be created via CreateAndNew action
When open page by url 'http://localhost:5656/#experience/create'
And choose default template on create experience view
And input 'Experience3' into title edit area on create view
And click on create and new button on create view
And choose default template on create experience view
And input 'Experience1' into title edit area on create view
And click on create and new button on create view
And choose default template on create experience view
And input 'Experience2' into title edit area on create view
And click on create and new button on create view
And click back button on create view
Then browser navigates to url 'http://localhost:5656/#experiences'
And publications tiles list consists of ordered items
| Title       |
| Experience1 |
| Experience2 |
| Experience3 |

Scenario: Special symbols could be entered into title edit area on create view and saved
When open page by url 'http://localhost:5656/#experience/create'
And choose default template on create experience view
And input '~`!@#$%^&*()_+-={[]}:;"'|\<,.>/?№ё' into title edit area on create view
And click on create and edit button on create view
Then browser navigates to url that contains 'http://localhost:5656/#experience/'
And '~`!@#$%^&*()_+-={[]}:;"'|\<,.>/?№ё' title is shown in experience page header

Scenario: It is possible to edit experience title on experience page
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
When open page by url 'http://localhost:5656/#experience/1'
And edit experience title with new text 'Experience2' on experience page
And click on experience header title text on experience page
And sleep 1000 milliseconds
And click on back to experiences
Then publications tiles list consists of ordered items
| Title       |
| Experience2 |

Scenario: Not possible to make existing experience title empty
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
When open page by url 'http://localhost:5656/#experience/1'
And clear header title text field on experience page
Then title text block marked with error on experience page
And chars counter marked with error on experience page
When click on back to experiences
Then publications tiles list consists of ordered items
| Title       |
| Experience1 |

Scenario: Delete experience button becomes available after experience was selected
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
| Experience2 | 2  |
When open page by url 'http://localhost:5656/#experiences'
And mouse hover element of publications list with title 'Experience2'
And select publication list item with title 'Experience2'
Then delete button is displayed true on experiences list page

Scenario: Delete experience button is not available if there is no selected experiences
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
| Experience2 | 2  |
When open page by url 'http://localhost:5656/#experiences'
Then delete button is displayed false on experiences list page
When mouse hover element of publications list with title 'Experience2'
And select publication list item with title 'Experience2'
And select publication list item with title 'Experience2'
Then delete button is displayed false on experiences list page

Scenario: Selected experience can be deleted
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
| Experience2 | 2  |
| Experience3 | 3  |
When open page by url 'http://localhost:5656/#experiences'
And mouse hover element of publications list with title 'Experience2'
And select publication list item with title 'Experience2'
And click on delete button on experiences list page
Then publications tiles list consists of ordered items
| Title       |
| Experience1 |
| Experience3 |
When mouse hover element of publications list with title 'Experience1'
And click open publication list item with title 'Experience1'
And click on back to experiences
Then publications tiles list consists of ordered items
| Title       |
| Experience1 |
| Experience3 |


