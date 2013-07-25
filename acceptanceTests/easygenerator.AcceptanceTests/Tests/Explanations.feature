@Explanations
Feature: Explanations
	As an author I can Add Explanation, so I can divide needed content into more than one solid part.
    As an author I can Delete Explanation, so I do not keep not needed parts of content.

Background: 
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
Given questions related to 'Objective1' are present in database
| Title      | Id |
| Question11 | 1  |
Given explanations related to 'Question11' of 'Objective1' are present in database
| Explanation   |
| Explanation11 |
| Explanation12 |
| Explanation13 |

Scenario: New explanation could be added by entering new explanation text
When open page by url 'http://localhost:5656/#/objective/1/question/1'
And input text 'Explanation14' into new explanation text field
And click on collapse answer options
Then explanations list contains only items with data
| Explanation   |
| Explanation11 |
| Explanation12 |
| Explanation13 |
| Explanation14 |

Scenario: Explanation text could be edited
When open page by url 'http://localhost:5656/#/objective/1/question/1'
And input text 'Explanation14' into explanation text field 'Explanation12'
And click on collapse answer options
Then answer options list contains only items with data
| Explanation   |
| Explanation11 |
| Explanation14 |
| Explanation13 |

Scenario: Explanation could be deleted
When open page by url 'http://localhost:5656/#/objective/1/question/1'
And mouse hover element of explanation with text 'Explanation12'
And click on delete explanation 'Explanation12'
And mouse hover element of explanation with text 'Explanation11'
And click on delete explanation 'Explanation11'
Then explanations list contains only items with data
| Explanation    |
| Explanation13  |

Scenario: Explanation can't be saved with empty text
When open page by url 'http://localhost:5656/#/objective/1/question/1'
And input text ' ' into new explanation text field
And click on collapse answer options
Then explanations list contains only items with data
| Explanation   |
| Explanation11 |
| Explanation12 |
| Explanation13 |

Scenario: Changes to explanation data are not lost when user go out from current question page
When open page by url 'http://localhost:5656/#/objective/1/question/1'
And input text 'Explanation14' into explanation text field 'Explanation12'
And click on back to objective
And mouse hover element of questions list with title 'Question11'
And click on open question with title 'Question11'
Then explanations list contains only items with data
| Explanation   |
| Explanation11 |
| Explanation14 |
| Explanation13 |


