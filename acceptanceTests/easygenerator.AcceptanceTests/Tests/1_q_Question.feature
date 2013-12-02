@Errors
Feature: 1_q_Question
	In order to avoid silly mistakes
	As a math idiot
	I want to be told the sum of two numbers



Scenario: Quick question test
Given clear data context 
Given objectives are present in database
| Title      | Id                               |
| Objective1 | 00000000000000000000000000000001 |
| Objective2 | 00000000000000000000000000000002 |
Given questions related to 'Objective1' are present in database
| Title      | Id                               |
| Question11 | 00000000000000000000000000000001 |
| Question12 | 00000000000000000000000000000002 |
| Question13 | 00000000000000000000000000000003 |
Given questions related to 'Objective2' are present in database
| Title       | Id |
| Question112 | 00000000000000000000000000000011  |
| Question113 | 00000000000000000000000000000013  |
Given answer options related to 'Question11' of 'Objective1' are present in database
| Text                                 | isCorrect |
| AnswerOption11                       | true      |
| AnswerOption12                       | false     |
| AnswerOption13                       | true      |
Given answer options related to 'Question12' of 'Objective1' are present in database
| Text           |
| AnswerOption21 |
| AnswerOption22 |
| AnswerOption23 |
Given explanations related to 'Question11' of 'Objective1' are present in database
| Explanation   |
| Explanation11 |
| Explanation12 |
| Explanation13 |
Given explanations related to 'Question12' of 'Objective1' are present in database
| Explanation   |
| Explanation21 |
| Explanation22 |
| Explanation23 |
When open page by url 'http://localhost:5656/signout'
When open page by url 'http://localhost:5656/signin'
And sign in as 'test' user on sign in page
Then browser navigates to url 'http://localhost:5656/'

# All answer options and explanations related to question are present on question page
#When refresh page
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000002'
Then answer options list contains only items with data
| Text           |
| AnswerOption21 |
| AnswerOption22 |
| AnswerOption23 |
And explanations list contains only items with data
| Explanation   |
| Explanation21 |
| Explanation22 |
| Explanation23 |

#Scenario: Related objective title is shown in back to objective link
#When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000002'
#Then 'Objective1' title is shown in back to objective link

# Related question title is shown in question page header
#When refresh page
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000002'
Then 'Question12' title is shown in question page header

# Correct indicators are shown for answer options on question page
#When refresh page
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
Then correct answer option is set to 'true' for 'AnswerOption11'
And correct answer option is set to 'false' for 'AnswerOption12'

#Scenario: Next and previous actions of question page navigate through questions of current objective
#When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
#And click on next question
#Then browser navigates to url 'http://localhost:5656/#objective/00000000000000000000000000000001/question/00000000000000000000000000000002'
#When click on next question
#Then browser navigates to url 'http://localhost:5656/#objective/00000000000000000000000000000001/question/00000000000000000000000000000003'
#When click on previous question
#Then browser navigates to url 'http://localhost:5656/#objective/00000000000000000000000000000001/question/00000000000000000000000000000002'

#Scenario: Previous question action is not available for first question
#When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
#Then previous question action is not available

#Scenario: Next question action is not available for last question
#When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000003'
#Then next question action is not available

# answer options block and explanations block are expanded by default
#When refresh page
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
Then answer options block is expanded
And explanations block is expanded

# Collapse answer options action on question page collapses answer options block
#When refresh page
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And click on collapse answer options
Then answer options block is collapsed
And explanations block is expanded

# Collapse explanations action on question page collapses explanations block
#When refresh page
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And click on collapse explanations
Then explanations block is collapsed
And answer options block is expanded

# Expand answer options action on question page expands answer option block
#When refresh page
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And click on collapse answer options
And click on collapse explanations
And click on expand answer options
Then answer options block is expanded
And explanations block is collapsed

# Expand explanations action on question page expands explanations block
#When refresh page
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And click on collapse answer options
And click on collapse explanations
And click on expand explanations options
Then explanations block is expanded
And answer options block is collapsed

#-----------------------------------------------------
#-----------------AnswerOptions-----------------------
#-----------------------------------------------------

# New answer option could be added by entering new answer text
#When refresh page
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And input text 'AnswerOption14' into new answer option text field
And click on collapse explanations
Then answer options list contains only items with data
| Text                                 |
| AnswerOption11                       |
| AnswerOption12                       |
| AnswerOption13                       |
| AnswerOption14                       |

# New answer option could be marked as correct
#When refresh page
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And input text 'AnswerOption15' into new answer option text field
And click on correct answer option for active answer
And click on collapse explanations
Then correct answer option is set to 'true' for 'AnswerOption15'

# Any answer option correctness could be toggled
#When refresh page
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And click on correct answer option for 'AnswerOption11'
And click on correct answer option for 'AnswerOption12'
And click on collapse explanations
Then correct answer option is set to 'false' for 'AnswerOption11'
And correct answer option is set to 'true' for 'AnswerOption12'

# Answer option text could be edited
#When refresh page
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And input text 'AnswerOption16' into answer option text field 'AnswerOption12'
And click on collapse explanations
Then answer options list contains only items with data
| Text                                 |
| AnswerOption11                       |
| AnswerOption16                       |
| AnswerOption13                       |
| AnswerOption14                       |
| AnswerOption15                       |

# Answer option can't be saved with empty text
#When refresh page
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And input text ' ' into new answer option text field
And click on collapse explanations
Then answer options list contains only items with data
| Text                                 |
| AnswerOption11                       |
| AnswerOption16                       |
| AnswerOption13                       |
| AnswerOption14                       |
| AnswerOption15                       |



# Changes to answer option data are not lost when user go out from current question page
#When refresh page
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And click on correct answer option for 'AnswerOption11'
And input text 'AnswerOption12' into answer option text field 'AnswerOption16'
And click on home link
And open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001'
And mouse hover element of questions list with title 'Question11'
And click on open question with title 'Question11'
Then answer options list contains only items with data
| Text                                 |
| AnswerOption11                       |
| AnswerOption12                       |
| AnswerOption13                       |
| AnswerOption14                       |
| AnswerOption15                       |
And correct answer option is set to 'true' for 'AnswerOption11'

# Answer option becomes saved and not selected on collapse answer options
#When refresh page
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And input text 'AnswerOption16' into new answer option text field
And click on collapse answer options
And click on collapse answer options
Then answer options list contains only items with data
| Text                                 |
| AnswerOption11                       |
| AnswerOption12                       |
| AnswerOption13                       |
| AnswerOption14                       |
| AnswerOption15                       |
| AnswerOption16                       |
And answer option delete button is enabled false for answer option with text 'AnswerOption11'
And answer option delete button is enabled false for answer option with text 'AnswerOption12'
And answer option delete button is enabled false for answer option with text 'AnswerOption13'
And answer option delete button is enabled false for answer option with text 'AnswerOption14'
And answer option delete button is enabled false for answer option with text 'AnswerOption15'
And answer option delete button is enabled false for answer option with text 'AnswerOption16'

# Delete button should be enabled if hover answer option element
#When refresh page
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And mouse hover element of answer options with text 'AnswerOption12'
Then answer option delete button is enabled true for answer option with text 'AnswerOption12'

# Delete buttons are not enabled for inactive answer option elements
#When refresh page
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And mouse hover element of answer options with text 'AnswerOption12'
Then answer option delete button is enabled true for answer option with text 'AnswerOption12'
And answer option delete button is enabled false for answer option with text 'AnswerOption11'
And answer option delete button is enabled false for answer option with text 'AnswerOption13'
And answer option delete button is enabled false for answer option with text 'AnswerOption14'
And answer option delete button is enabled false for answer option with text 'AnswerOption15'
And answer option delete button is enabled false for answer option with text 'AnswerOption16'

# Delete button should be enabled if edit answer option element
#When refresh page
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And click answer option text field 'AnswerOption12'
Then answer option delete button is enabled true for answer option with text 'AnswerOption12'

# Answer option could be deleted
#When refresh page
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And mouse hover element of answer options with text 'AnswerOption16'
And click on delete answer option 'AnswerOption16'
And mouse hover element of answer options with text 'AnswerOption14'
And click on delete answer option 'AnswerOption14'
And mouse hover element of answer options with text 'AnswerOption15'
And click on delete answer option 'AnswerOption15'
Then answer options list contains only items with data
| Text           |
| AnswerOption11 |
| AnswerOption12 |
| AnswerOption13 |

# Answer option should be deleted if all content will be deleted from it
#When refresh page
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And input text ' ' into answer option text field 'AnswerOption12'
And click on collapse explanations
Then answer options list contains only items with data
| Text           |
| AnswerOption11 |
| AnswerOption13 |

# New answer option with special symbols could be added by entering new answer option text
#When refresh page
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And input text '~`!@#$%^&*()_+-={[]}:;"'|\<,.>/?' into new answer option text field
And click on collapse explanations
And open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001'
And mouse hover element of questions list with title 'Question11'
And click on open question with title 'Question11'
Then answer options list contains only items with data
| Text                               |
| AnswerOption11                     |
| AnswerOption13                     |
| ~`!@#$%^&*()_+-={[]}:;"'\|\\<,.>/? |


#-------------------------------------------------------------------
#---------------LearningContent--------------------------------------
#-------------------------------------------------------------------


# New explanation could be added by entering new explanation text
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And input text 'Explanation14' into new explanation text field
And click on collapse answer options
Then explanations list contains only items with data
| Explanation   |
| Explanation11 |
| Explanation12 |
| Explanation13 |
| Explanation14 |

# Explanation becomes saved and not selected on collapse explanation
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And input text 'Explanation15' into new explanation text field
And click on collapse explanations
And click on collapse explanations
Then explanations list contains only items with data
| Explanation   |
| Explanation11 |
| Explanation12 |
| Explanation13 |
| Explanation14 |
| Explanation15 |
And explanation delete button is enabled false for explanation with text 'Explanation11'
And explanation delete button is enabled false for explanation with text 'Explanation12'
And explanation delete button is enabled false for explanation with text 'Explanation13'
And explanation delete button is enabled false for explanation with text 'Explanation14'
And explanation delete button is enabled false for explanation with text 'Explanation15'

# Explanation text could be edited
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And input text 'Explanation16' into explanation text field 'Explanation12'
And click on collapse answer options
Then explanations list contains only items with data
| Explanation   |
| Explanation11 |
| Explanation16 |
| Explanation13 |
| Explanation14 |
| Explanation15 |

# All explanations can be made visible using scroll
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And browser window width and height is set to 1024 and 600
And scroll new explanation button into the view
Then new explanation button is visible
When browser window maximize

# Delete button should be enabled if hover explanation element
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And mouse hover element of explanation with text 'Explanation13'
Then explanation delete button is enabled true for explanation with text 'Explanation13'

# Delete buttons are not enabled for inactive explanation elements
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And mouse hover element of explanation with text 'Explanation13'
Then explanation delete button is enabled true for explanation with text 'Explanation13'
And explanation delete button is enabled false for explanation with text 'Explanation11'
And explanation delete button is enabled false for explanation with text 'Explanation16'
And explanation delete button is enabled false for explanation with text 'Explanation14'
And explanation delete button is enabled false for explanation with text 'Explanation15'

# Delete button should be enabled if edit explanation element
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And click explanation text field 'Explanation13'
Then explanation delete button is enabled true for explanation with text 'Explanation13'


# Explanation could be deleted
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And mouse hover element of explanation with text 'Explanation16'
And click on delete explanation 'Explanation16'
And mouse hover element of explanation with text 'Explanation14'
And click on delete explanation 'Explanation14'
And mouse hover element of explanation with text 'Explanation15'
And click on delete explanation 'Explanation15'
Then explanations list contains only items with data
| Explanation    |
| Explanation11  |
| Explanation13  |

# Explanation should be deleted if all content will be deleted from it
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And input text ' ' into explanation text field 'Explanation11'
And click on collapse answer options
Then explanations list contains only items with data
| Explanation   |
| Explanation13 |


# Explanation can't be saved with empty text
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And input text ' ' into new explanation text field
And click on collapse answer options
Then explanations list contains only items with data
| Explanation   |
| Explanation13 |

# Changes to explanation data are not lost when user go out from current question page
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And input text 'Explanation11' into explanation text field 'Explanation13'
And click on home link
And open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
Then explanations list contains only items with data
| Explanation   |
| Explanation11 |

# Changes to explanation list are not lost when user go out from current question page
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And mouse hover element of explanation with text 'Explanation11'
And click on delete explanation 'Explanation11'
And input text 'Explanation14' into new explanation text field
And click on home link
And open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
Then explanations list contains only items with data
| Explanation   |
| Explanation14 |

# New explanation with special symbols could be added by entering new explanation text
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And input text '~`!@#$%^&*()_+-={[]}:;"'|\<,.>/?' into new explanation text field
And click on collapse answer options
And refresh page
Then explanations list contains only items with data
| Explanation                        |
| Explanation14                      |
| ~`!@#$%^&*()_+-={[]}:;"'\|\\<,.>/? |



