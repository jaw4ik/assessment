@CUDQuestion
Feature: CUDQuestion
	As an author I can define(create new/ update existing/ delete existing) Questions
	 that a learner has to be able to answer correctly
	 in order to prove that he has reached specific Learning Objective
	  or system could decide if a learner needs to go through more Explanations.

Background:
Given clear data context


Scenario: Add question action on objective page navigates to create question view
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
When open page by url 'http://localhost:5656/#objective/1'
And press add new question button on objective page
Then browser navigates to url 'http://localhost:5656/#objective/1/question/create'

Scenario: Create new question button on question page navigates to create question view
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
Given questions related to 'Objective1' are present in database
| Title     | Id |
| Question1 | 1  |
When open page by url 'http://localhost:5656/#objective/1/question/1'
And click create new question button on question page
Then browser navigates to url 'http://localhost:5656/#objective/1/question/create'

Scenario: Create new question text on question page navigates to create question view
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
Given questions related to 'Objective1' are present in database
| Title     | Id |
| Question1 | 1  |
When open page by url 'http://localhost:5656/#objective/1/question/1'
And click on create new question text on question page
Then browser navigates to url 'http://localhost:5656/#objective/1/question/create'

Scenario: Edit question title text block is active when open create question view
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
When open page by url 'http://localhost:5656/#objective/1/question/create'
Then edit title text block is active on create view

Scenario: Edit question title text block is empty when open create question view
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
When open page by url 'http://localhost:5656/#objective/1/question/create'
Then edit title text block is empty on create view

Scenario: Buttons CreateAndEdit and CreateAndNew are disabled if title text is empty on create question view
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
When open page by url 'http://localhost:5656/#objective/1/question/create'
Then buttons CreateAndEdit and CreateAndNew are enabled false on create view
When input 'text' into title edit area on create view
And clear edit area on create view
Then buttons CreateAndEdit and CreateAndNew are enabled false on create view

Scenario: Buttons CreateAndEdit and CreateAndNew are enabled if title text is not empty on create question view
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
When open page by url 'http://localhost:5656/#objective/1/question/create'
And input 'text' into title edit area on create view
Then buttons CreateAndEdit and CreateAndNew are enabled true on create view

Scenario: Back action on create question view navigates back to related objective
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
| Objective2 | 2  |
| Objective3 | 3  |
When open page by url 'http://localhost:5656/#objective/2/question/create'
And click back button on create view
Then browser navigates to url 'http://localhost:5656/#objective/2'

Scenario: Max allowed chars count is shown in edit title text block on create view from the beginning
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
When open page by url 'http://localhost:5656/#objective/1/question/create'
Then max chars count '255' is shown in chars counter on create view

Scenario: correct input chars count and max chars count are shown in edit title text block on create view
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
When open page by url 'http://localhost:5656/#objective/1/question/create'
And input 'text' into title edit area on create view
Then chars count '4' is shown in chars counter on create view
And max chars count '255' is shown in chars counter on create view

Scenario: Not possible to save more than 255 charracters in title text on create view
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
When open page by url 'http://localhost:5656/#objective/1/question/create'
And input 'WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW WWW' into title edit area on create view
Then chars count '256' is shown in chars counter on create view
And buttons CreateAndEdit and CreateAndNew are enabled false on create view
And title text block marked with error on create view
And chars counter marked with error on create view

Scenario: Changes are not saved if go back from create view
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
Given questions related to 'Objective1' are present in database
| Title     | Id |
| Question1 | 1  |
When open page by url 'http://localhost:5656/#objective/1/question/create'
And input 'text' into title edit area on create view
And click back button on create view
Then browser navigates to url 'http://localhost:5656/#objective/1'
And questions list consists of ordered items
| Title     |
| Question1 |

Scenario: Action CreateAndEdit navigates to newly created question related to current objective
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
| Objective2 | 2  |
| Objective3 | 3  |
Given questions related to 'Objective2' are present in database
| Title     | Id |
| Question1 | 1  |
| Question2 | 2  |
| Question3 | 3  |
When open page by url 'http://localhost:5656/#objective/2/question/create'
And input 'Question4' into title edit area on create view
And click on create and edit button on create view
Then browser navigates to url that contains 'http://localhost:5656/#objective/2/question/'
And 'Question4' title is shown in question page header
And 'Objective2' title is shown in back to objective link

Scenario: Action CreateAndNew saves changes to newly created question related to current objective and navigates to new create question view
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
| Objective2 | 2  |
| Objective3 | 3  |
Given questions related to 'Objective2' are present in database
| Title     | Id |
| Question1 | 1  |
| Question2 | 2  |
| Question3 | 3  |
When open page by url 'http://localhost:5656/#objective/2/question/create'
And input 'Question4' into title edit area on create view
And click on create and new button on create view
Then browser navigates to url 'http://localhost:5656/#objective/2/question/create'
When click back button on create view
Then browser navigates to url 'http://localhost:5656/#objective/2'
And questions list consists of ordered items
| Title     |
| Question1 |
| Question2 |
| Question3 |
| Question4 |

Scenario: Several questions related to current objective can be created via CreateAndNew action
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
| Objective2 | 2  |
| Objective3 | 3  |
When open page by url 'http://localhost:5656/#objective/2/question/create'
And input 'Question3' into title edit area on create view
And click on create and new button on create view
And input 'Question1' into title edit area on create view
And click on create and new button on create view
And input 'Question2' into title edit area on create view
And click on create and new button on create view
And click back button on create view
Then browser navigates to url 'http://localhost:5656/#objective/2'
And questions list consists of ordered items
| Title     |
| Question1 |
| Question2 |
| Question3 |

Scenario: Special symbols could be entered into title edit area on create view and saved
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
When open page by url 'http://localhost:5656/#objective/1/question/create'
And input '~`!@#$%^&*()_+-={[]}:;"'|\<,.>/?№ё' into title edit area on create view
And click on create and edit button on create view
Then browser navigates to url that contains 'http://localhost:5656/#objective/1/question/'
And '~`!@#$%^&*()_+-={[]}:;"'|\<,.>/?№ё' title is shown in question page header

