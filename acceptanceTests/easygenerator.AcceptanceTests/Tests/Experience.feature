@Experience
Feature: Experience
	As an author I can see Title, list of related objectives and assigned Template name  of open Experience,
	so I can check if the current experience is ready for publishing.

Background:
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
| Experience2 | 2  |

Scenario: All related objectives should be present in list
Given objectives are present in database
| Title       | Id |
| Objective11 | 1  |
| Objective12 | 2  |
| Objective21 | 3  |
| Objective22 | 4  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11 | 1  |
| Objective12 | 2  |
Given objectives are linked to experiance 'Experience2'
| Title       | Id |
| Objective21 | 3  |
| Objective22 | 4  |
When open page by url 'http://localhost:5656/#/experience/2'
Then related objectives list contains only items with data
| Title       |
| Objective21 |
| Objective22 |

Scenario: Objectives list item name could contain special symbols
Given objectives are present in database
| Title                                | Id |
| ~`!@#$%^&*()_+-={[]}:;"'\|\\<,.>/?№ё | 1  |
Given objectives are linked to experiance 'Experience1'
| Title                                | Id |
| ~`!@#$%^&*()_+-={[]}:;"'\|\\<,.>/?№ё | 1  |
When open page by url 'http://localhost:5656/#/experience/1'
Then related objectives list contains only items with data
| Title                                |
| ~`!@#$%^&*()_+-={[]}:;"'\|\\<,.>/?№ё |

@NotFirefox
Scenario: Actions open and select are enabled if hover item of objectives list
Given objectives are present in database
| Title       | Id |
| Objective11 | 1  |
| Objective12 | 2  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11 | 1  |
| Objective12 | 2  |
When open page by url 'http://localhost:5656/#/experience/1'
When mouse hover element of related objectives list with title 'Objective11'
Then Action open is enabled true for related objectives list item with title 'Objective11'
And Action select is enabled true for related objectives list item with title 'Objective11'


Scenario: Question count is shown for each related objective list item
Given objectives are present in database
| Title       | Id |
| Objective11 | 1  |
| Objective12 | 2  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11 | 1  |
| Objective12 | 2  |
Given questions related to 'Objective11' are present in database
| Title      | Id |
| Question11 | 1  |
| Question12 | 2  |
Given questions related to 'Objective12' are present in database
| Title      | Id |
| Question21 | 1  |
When open page by url 'http://localhost:5656/#/experience/1'
Then question count for related objective item with title 'Objective11' is '2'
And question count for related objective item with title 'Objective12' is '1'

