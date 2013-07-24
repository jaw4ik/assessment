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
