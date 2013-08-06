@PackageListOfObjectives
Feature: PackageListOfObjectives
	As a learner I can unzip downloaded package and open “index” file that is contained by this package,
	so I'm able to see the tree of objectives and related to them questions. 


Background: 
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
| Experience2 | 2  |
Given objectives related to 'Experience1' are present in database
| Title      | Id |
| Objective1 | 1  |
| Objective2 | 2  |

Given questions related to 'Objective1' are present in database
| Title     | Id |
| Question1 | 1  |
| Question2 | 2  |
Given answer options related to 'Question1' of 'Objective1' are present in database
| Text           | isCorrect |
| AnswerOption11 | true      |
| AnswerOption12 | false     |
Given answer options related to 'Question2' of 'Objective1' are present in database
| Text           | isCorrect |
| AnswerOption21 | true      |
| AnswerOption22 | false     |
Given explanations related to 'Question1' of 'Objective1' are present in database
| Explanation   |
| Explanation11 |
| Explanation12 |
Given explanations related to 'Question2' of 'Objective1' are present in database
| Explanation   |
| Explanation21 |
| Explanation22 |

Given questions related to 'Objective2' are present in database
| Title      | Id |
| Question21 | 1  |
| Question22 | 2  |
Given answer options related to 'Question21' of 'Objective2' are present in database
| Text            | isCorrect |
| AnswerOption211 | true      |
| AnswerOption212 | false     |
Given answer options related to 'Question22' of 'Objective2' are present in database
| Text            | isCorrect |
| AnswerOption221 | true      |
| AnswerOption222 | false     |
Given explanations related to 'Question21' of 'Objective2' are present in database
| Explanation    |
| Explanation211 |
| Explanation212 |
Given explanations related to 'Question22' of 'Objective2' are present in database
| Explanation    |
| Explanation221 |
| Explanation222 |

And open page by url 'http://localhost:5656/#/experiences'
And mouse hover element of publications list with title 'Experience1'
And click build publication list item with title 'Experience1'
And mouse hover element of publications list with title 'Experience1'
And click download publication list item with title 'Experience1'
And unzip '1.zip' package to 'tmp'

Scenario: All package objectives are present on page
When open page by url 'http://localhost:5656/Templates/tmp'
Then package objectives tiles list contains only items with data 
| Title      |
| Objective1 |
| Objective2 |

