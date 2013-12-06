@Explanations
Feature: Explanations
	As an author I can Add Explanation, so I can divide needed content into more than one solid part.
    As an author I can Delete Explanation, so I do not keep not needed parts of content.

Background:
Given clear data context 
Given objectives are present in database
| Title      | Id                               |
| Objective1 | 00000000000000000000000000000001 |
Given questions related to 'Objective1' are present in database
| Title      | Id                               |
| Question11 | 00000000000000000000000000000001 |
Given explanations related to 'Question11' of 'Objective1' are present in database
| Explanation   |
| Explanation11 |
| Explanation12 |
| Explanation13 |
#When open page by url 'http://localhost:5656/signout'
#When open page by url 'http://localhost:5656/signin'
#And sign in as 'test' user on sign in page
#Then browser navigates to url 'http://localhost:5656/'

Scenario: New explanation could be added by entering new explanation text
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And input text 'Explanation14' into new explanation text field
And click on collapse answer options
Then explanations list contains only items with data
| Explanation   |
| Explanation11 |
| Explanation12 |
| Explanation13 |
| Explanation14 |

Scenario: Explanation becomes saved and not selected on collapse explanation
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And input text 'Explanation14' into new explanation text field
And click on collapse explanations
And click on collapse explanations
Then explanations list contains only items with data
| Explanation   |
| Explanation11 |
| Explanation12 |
| Explanation13 |
| Explanation14 |
And explanation delete button is enabled false for explanation with text 'Explanation11'
And explanation delete button is enabled false for explanation with text 'Explanation12'
And explanation delete button is enabled false for explanation with text 'Explanation13'
And explanation delete button is enabled false for explanation with text 'Explanation14'

Scenario: Explanation text could be edited
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And input text 'Explanation14' into explanation text field 'Explanation12'
And click on collapse answer options
Then explanations list contains only items with data
| Explanation   |
| Explanation11 |
| Explanation14 |
| Explanation13 |

Scenario: Delete button should be enabled if hover explanation element
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And mouse hover element of explanation with text 'Explanation12'
Then explanation delete button is enabled true for explanation with text 'Explanation12'

Scenario: Delete buttons are not enabled for inactive explanation elements
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And mouse hover element of explanation with text 'Explanation12'
Then explanation delete button is enabled true for explanation with text 'Explanation12'
And explanation delete button is enabled false for explanation with text 'Explanation11'
And explanation delete button is enabled false for explanation with text 'Explanation13'

Scenario: Delete button should be enabled if edit explanation element
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And click explanation text field 'Explanation12'
Then explanation delete button is enabled true for explanation with text 'Explanation12'


Scenario: Explanation could be deleted
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And mouse hover element of explanation with text 'Explanation12'
And click on delete explanation 'Explanation12'
And mouse hover element of explanation with text 'Explanation11'
And click on delete explanation 'Explanation11'
Then explanations list contains only items with data
| Explanation    |
| Explanation13  |

Scenario: Explanation should be deleted if all content will be deleted from it
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And input text ' ' into explanation text field 'Explanation12'
And click on collapse answer options
Then explanations list contains only items with data
| Explanation   |
| Explanation11 |
| Explanation13 |


Scenario: Explanation can't be saved with empty text
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And input text ' ' into new explanation text field
And click on collapse answer options
Then explanations list contains only items with data
| Explanation   |
| Explanation11 |
| Explanation12 |
| Explanation13 |

Scenario: Changes to explanation data are not lost when user go out from current question page
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And input text 'Explanation14' into explanation text field 'Explanation12'
And click on home link
Then browser navigates to url 'http://localhost:5656/#'
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
Then explanations list contains only items with data
| Explanation   |
| Explanation11 |
| Explanation14 |
| Explanation13 |

Scenario: Changes to explanation list are not lost when user go out from current question page
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And input text 'Explanation14' into new explanation text field
And click on collapse answer options
And mouse hover element of explanation with text 'Explanation11'
And click on delete explanation 'Explanation11'
#And sleep 1000 milliseconds
And refresh page
Then explanations list contains only items with data
| Explanation   |
| Explanation12 |
| Explanation13 |
| Explanation14 |

Scenario: Explanation could contain special symbols
Given explanations related to 'Question11' of 'Objective1' are present in database
| Explanation                          |
| ~`!@#$%^&*()_+-={[]}:;"'\|\\<,.>/?№ё |
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
Then explanations list contains only items with data
| Explanation                          |
| ~`!@#$%^&*()_+-={[]}:;"'\|\\<,.>/?№ё |

Scenario: New explanation with special symbols could be added by entering new explanation text
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And input text '~`!@#$%^&*()_+-={[]}:;"'|\<,.>/?' into new explanation text field
And click on collapse answer options
And refresh page
Then explanations list contains only items with data
| Explanation                        |
| Explanation11                      |
| Explanation12                      |
| Explanation13                      |
| ~`!@#$%^&*()_+-={[]}:;"'\|\\<,.>/? |

Scenario: All explanations can be made visible using scroll
Given explanations related to 'Question11' of 'Objective1' are present in database
| Explanation   |
| Explanation11 |
| Explanation12 |
| Explanation13 |
| Explanation14 |
| Explanation15 |
| Explanation16 |
When open page by url 'http://localhost:5656/#/objective/00000000000000000000000000000001/question/00000000000000000000000000000001'
And browser window width and height is set to 1024 and 600
And scroll new explanation button into the view
Then new explanation button is visible

