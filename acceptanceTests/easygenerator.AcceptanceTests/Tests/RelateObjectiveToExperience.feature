@RelateObjectiveToExperience
Feature: RelateObjectiveToExperience
	As an author I want to update Experience by including/excluding learning objectives,
	 so I can form learner's Experience more properly and build Experience only with needed Learning objectives.

Scenario: Objective can be included to experience on experience page
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
When open page by url 'http://localhost:5656/#/experience/1'
And click on include button on experience page
And mouse hover element of related objectives list with title 'Objective1'
And select related objective list item with title 'Objective1'
And click on finish button on experience page
Then related objectives list contains only items with data
| Title      |
| Objective1 |

Scenario: Objective can be excluded from experience on experience page
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
| Objective2 | 2  |
Given objectives are linked to experiance 'Experience1'
| Title      | Id |
| Objective1 | 1  |
| Objective2 | 2  |
When open page by url 'http://localhost:5656/#/experience/1'
And mouse hover element of related objectives list with title 'Objective1'
And select related objective list item with title 'Objective1'
And click on exclude button on experience page
Then related objectives list contains only items with data
| Title      |
| Objective2 |

Scenario: Exclude button is disabled if there are no selected objectives
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
| Objective2 | 2  |
Given objectives are linked to experiance 'Experience1'
| Title      | Id |
| Objective1 | 1  |
| Objective2 | 2  |
When open page by url 'http://localhost:5656/#/experience/1'
Then exclude button is enabled false on experience page
When mouse hover element of related objectives list with title 'Objective1'
And select related objective list item with title 'Objective1'
And select related objective list item with title 'Objective1'
Then exclude button is enabled false on experience page

Scenario: Exclude button is enabled if one or more objectives are selected
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
| Objective2 | 2  |
Given objectives are linked to experiance 'Experience1'
| Title      | Id |
| Objective1 | 1  |
| Objective2 | 2  |
When open page by url 'http://localhost:5656/#/experience/1'
And mouse hover element of related objectives list with title 'Objective1'
And select related objective list item with title 'Objective1'
Then exclude button is enabled true on experience page
When mouse hover element of related objectives list with title 'Objective2'
And select related objective list item with title 'Objective2'
Then exclude button is enabled true on experience page

Scenario: More than one objective can be included to experience at a time
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
| Objective2 | 2  |
| Objective3 | 3  |
When open page by url 'http://localhost:5656/#/experience/1'
And click on include button on experience page
And mouse hover element of related objectives list with title 'Objective1'
And select related objective list item with title 'Objective1'
And mouse hover element of related objectives list with title 'Objective3'
And select related objective list item with title 'Objective3'
And click on finish button on experience page
Then related objectives list contains only items with data
| Title      |
| Objective1 |
| Objective3 |

Scenario: More than one objective can be excluded from experience at a time
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
| Objective2 | 2  |
| Objective3 | 3  |
Given objectives are linked to experiance 'Experience1'
| Title      | Id |
| Objective1 | 1  |
| Objective2 | 2  |
| Objective3 | 3  |
When open page by url 'http://localhost:5656/#/experience/1'
And mouse hover element of related objectives list with title 'Objective1'
And select related objective list item with title 'Objective1'
And mouse hover element of related objectives list with title 'Objective3'
And select related objective list item with title 'Objective3'
And click on exclude button on experience page
Then related objectives list contains only items with data
| Title      |
| Objective2 |

Scenario: Objectives already included to experience are not shown in include list
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
| Objective2 | 2  |
| Objective3 | 3  |
| Objective4 | 4  |
Given objectives are linked to experiance 'Experience1'
| Title      | Id |
| Objective1 | 1  |
| Objective3 | 3  |
When open page by url 'http://localhost:5656/#/experience/1'
And click on include button on experience page
Then related objectives list contains only items with data
| Title      |
| Objective2 |
| Objective4 |

Scenario: Excluded objectives are not shown again after go out and back to experience view
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
| Objective2 | 2  |
| Objective3 | 3  |
Given objectives are linked to experiance 'Experience1'
| Title      | Id |
| Objective1 | 1  |
| Objective2 | 2  |
| Objective3 | 3  |
When open page by url 'http://localhost:5656/#/experience/1'
And mouse hover element of related objectives list with title 'Objective1'
And select related objective list item with title 'Objective1'
And mouse hover element of related objectives list with title 'Objective3'
And select related objective list item with title 'Objective3'
And click on exclude button on experience page
Then related objectives list contains only items with data
| Title      |
| Objective2 |
When click on back to experiences
And mouse hover element of publications list with title 'Experience1'
And click open publication list item with title 'Experience1'
Then browser navigates to url 'http://localhost:5656/#experience/1'
And related objectives list contains only items with data
| Title      |
| Objective2 |

Scenario: Included objectives are not shown after go back to include list again
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
| Objective2 | 2  |
| Objective3 | 3  |
| Objective4 | 4  |
When open page by url 'http://localhost:5656/#/experience/1'
And click on include button on experience page
And mouse hover element of related objectives list with title 'Objective1'
And select related objective list item with title 'Objective1'
And mouse hover element of related objectives list with title 'Objective3'
And select related objective list item with title 'Objective3'
And click on finish button on experience page
Then related objectives list contains only items with data
| Title      |
| Objective1 |
| Objective3 |
When click on include button on experience page
Then related objectives list contains only items with data
| Title      |
| Objective2 |
| Objective4 |

Scenario: Objectives already included to one experience can be included to another experience
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
| Experience2 | 2  |
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
| Objective2 | 2  |
| Objective3 | 3  |
Given objectives are linked to experiance 'Experience1'
| Title      | Id |
| Objective1 | 1  |
| Objective2 | 2  |
When open page by url 'http://localhost:5656/#/experience/2'
And click on include button on experience page
Then related objectives list contains only items with data
| Title      |
| Objective1 |
| Objective2 |
| Objective3 |
When mouse hover element of related objectives list with title 'Objective2'
And select related objective list item with title 'Objective2'
And mouse hover element of related objectives list with title 'Objective3'
And select related objective list item with title 'Objective3'
And click on finish button on experience page
Then related objectives list contains only items with data
| Title      |
| Objective2 |
| Objective3 |
When click on back to experiences
And mouse hover element of publications list with title 'Experience1'
And click open publication list item with title 'Experience1'
Then browser navigates to url 'http://localhost:5656/#experience/1'
And related objectives list contains only items with data
| Title      |
| Objective1 |
| Objective2 |

Scenario: Objectives excluded from one experience are not excluded from another experience
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
| Experience2 | 2  |
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
| Objective2 | 2  |
| Objective3 | 3  |
Given objectives are linked to experiance 'Experience1'
| Title      | Id |
| Objective1 | 1  |
| Objective2 | 2  |
Given objectives are linked to experiance 'Experience2'
| Title      | Id |
| Objective2 | 2  |
| Objective3 | 3  |
When open page by url 'http://localhost:5656/#/experience/2'
When mouse hover element of related objectives list with title 'Objective2'
And select related objective list item with title 'Objective2'
And click on exclude button on experience page
Then related objectives list contains only items with data
| Title      |
| Objective3 |
When click on back to experiences
And mouse hover element of publications list with title 'Experience1'
And click open publication list item with title 'Experience1'
Then browser navigates to url 'http://localhost:5656/#experience/1'
And related objectives list contains only items with data
| Title      |
| Objective1 |
| Objective2 |

Scenario: Experience can not be deleted if it has related objectives
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
Given objectives are linked to experiance 'Experience1'
| Title      | Id |
| Objective1 | 1  |
When open page by url 'http://localhost:5656/#experiences'
And mouse hover element of publications list with title 'Experience1'
And select publication list item with title 'Experience1'
And click on delete button on experiences list page
Then error notification is displayed true on experiences list page
And publications tiles list consists of ordered items
| Title       |
| Experience1 |

Scenario: Objective can not be deleted if it is included to some experience
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
Given objectives are present in database
| Title      | Id |
| Objective1 | 1  |
Given objectives are linked to experiance 'Experience1'
| Title      | Id |
| Objective1 | 1  |
When open page by url 'http://localhost:5656/#objectives'
And mouse hover element of objectives list with title 'Objective1'
And select objective list item with title 'Objective1'
And click on delete button on objectives list page
Then error notification is displayed true on objectives list page
And objectives tiles list consists of ordered items
| Title      |
| Objective1 |

