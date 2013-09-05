@AnswerOptions
Feature: AnswerOptions
	As an author I want to add new or delete existing Answer Option of current open Question, so I could define list of them for this Question. 


Background:
Given clear data context
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
Given questions related to 'Objective1' are present in database
| Title      | Id |
| Question11 | 1  |
Given answer options related to 'Question11' of 'Objective1' are present in database
| Text           | isCorrect |
| AnswerOption11 | true      |
| AnswerOption12 | false     |
| AnswerOption13 | true      |


Scenario: New answer option could be added by entering new answer text
When open page by url 'http://localhost:5656/#/objective/1/question/1'
And input text 'AnswerOption14' into new answer option text field
And click on collapse explanations
Then answer options list contains only items with data
| Text           |
| AnswerOption11 |
| AnswerOption12 |
| AnswerOption13 |
| AnswerOption14 |

Scenario: New answer option could be marked as correct
When open page by url 'http://localhost:5656/#/objective/1/question/1'
And input text 'AnswerOption14' into new answer option text field
And click on correct answer option for active answer
And click on collapse explanations
Then correct answer option is set to 'true' for 'AnswerOption14'

Scenario: Any answer option correctness could be toggled
When open page by url 'http://localhost:5656/#/objective/1/question/1'
And click on correct answer option for 'AnswerOption11'
And click on correct answer option for 'AnswerOption12'
And click on collapse explanations
Then correct answer option is set to 'false' for 'AnswerOption11'
And correct answer option is set to 'true' for 'AnswerOption12'

Scenario: Answer option text could be edited
When open page by url 'http://localhost:5656/#/objective/1/question/1'
And input text 'AnswerOption14' into answer option text field 'AnswerOption12'
And click on collapse explanations
Then answer options list contains only items with data
| Text           |
| AnswerOption11 |
| AnswerOption14 |
| AnswerOption13 |

Scenario: Answer option can't be saved with empty text
When open page by url 'http://localhost:5656/#/objective/1/question/1'
And input text ' ' into new answer option text field
And click on collapse explanations
Then answer options list contains only items with data
| Text           |
| AnswerOption11 |
| AnswerOption12 |
| AnswerOption13 |



Scenario: Changes to answer option data are not lost when user go out from current question page
When open page by url 'http://localhost:5656/#/objective/1/question/1'
And click on correct answer option for 'AnswerOption11'
And input text 'AnswerOption14' into answer option text field 'AnswerOption12'
And click on back to objective on question page
And mouse hover element of questions list with title 'Question11'
And click on open question with title 'Question11'
Then answer options list contains only items with data
| Text           |
| AnswerOption11 |
| AnswerOption14 |
| AnswerOption13 |
And correct answer option is set to 'false' for 'AnswerOption11'

Scenario: Answer option becomes saved and not selected on collapse answer options
When open page by url 'http://localhost:5656/#/objective/1/question/1'
And input text 'AnswerOption14' into new answer option text field
And click on collapse answer options
And click on collapse answer options
Then answer options list contains only items with data
| Text           |
| AnswerOption11 |
| AnswerOption12 |
| AnswerOption13 |
| AnswerOption14 |
And answer option delete button is enabled false for answer option with text 'AnswerOption11'
And answer option delete button is enabled false for answer option with text 'AnswerOption12'
And answer option delete button is enabled false for answer option with text 'AnswerOption13'
And answer option delete button is enabled false for answer option with text 'AnswerOption14'

Scenario: Delete button should be enabled if hover answer option element
When open page by url 'http://localhost:5656/#/objective/1/question/1'
And mouse hover element of answer options with text 'AnswerOption12'
Then answer option delete button is enabled true for answer option with text 'AnswerOption12'

Scenario: Delete buttons are not enabled for inactive answer option elements
When open page by url 'http://localhost:5656/#/objective/1/question/1'
And mouse hover element of answer options with text 'AnswerOption12'
Then answer option delete button is enabled true for answer option with text 'AnswerOption12'
And answer option delete button is enabled false for answer option with text 'AnswerOption11'
And answer option delete button is enabled false for answer option with text 'AnswerOption13'

Scenario: Delete button should be enabled if edit answer option element
When open page by url 'http://localhost:5656/#/objective/1/question/1'
And click answer option text field 'AnswerOption12'
Then answer option delete button is enabled true for answer option with text 'AnswerOption12'

Scenario: Answer option could be deleted
When open page by url 'http://localhost:5656/#/objective/1/question/1'
And mouse hover element of answer options with text 'AnswerOption12'
And click on delete answer option 'AnswerOption12'
And mouse hover element of answer options with text 'AnswerOption11'
And click on delete answer option 'AnswerOption11'
Then answer options list contains only items with data
| Text           |
| AnswerOption13 |

Scenario: Answer option should be deleted if all content will be deleted from it
When open page by url 'http://localhost:5656/#/objective/1/question/1'
And input text ' ' into answer option text field 'AnswerOption12'
And click on collapse explanations
Then answer options list contains only items with data
| Text           |
| AnswerOption11 |
| AnswerOption13 |

Scenario: Answer option could contain special symbols
Given answer options related to 'Question11' of 'Objective1' are present in database
| Text                                 |
| ~`!@#$%^&*()_+-={[]}:;"'\|\\<,.>/?№ё |
When open page by url 'http://localhost:5656/#/objective/1/question/1'
Then answer options list contains only items with data
| Text                                 |
| ~`!@#$%^&*()_+-={[]}:;"'\|\\<,.>/?№ё |

Scenario: New answer option with special symbols could be added by entering new answer option text
When open page by url 'http://localhost:5656/#/objective/1/question/1'
And input text '~`!@#$%^&*()_+-={[]}:;"'|\<,.>/?№ё' into new answer option text field
And click on collapse explanations
And click on back to objective on question page
And mouse hover element of questions list with title 'Question11'
And click on open question with title 'Question11'
Then answer options list contains only items with data
| Text                                 |
| AnswerOption11                       |
| AnswerOption12                       |
| AnswerOption13                       |
| ~`!@#$%^&*()_+-={[]}:;"'\|\\<,.>/?№ё |

