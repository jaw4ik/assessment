@RelateObjectiveToExperience
Feature: RelateObjectiveToExperience
	As an author I want to update Experience by including/excluding learning objectives,
	 so I can form learner's Experience more properly and build Experience only with needed Learning objectives.


Background: 
Given clear data context
Given publications are present in database
| Title       | Id |
| Experience1 | 00000000000000000000000000000001  |
| Experience2 | 00000000000000000000000000000002  |
When open page by url 'http://localhost:5656/signout'
When open page by url 'http://localhost:5656/signin'
And sign in as 'test' user on sign in page
Then browser navigates to url 'http://localhost:5656/'

Scenario: Objective can be included to experience on experience page
Given objectives are present in database
| Title      | Id |
| Objective1 | 00000000000000000000000000000001  |
When open page by url 'http://localhost:5656/#/experience/00000000000000000000000000000001'
And click on include button on experience page
And mouse hover element of related objectives list with title 'Objective1'
And select related objective list item with title 'Objective1'
And click on finish button on experience page
Then related objectives list contains only items with data
| Title      |
| Objective1 |

Scenario: Objective can be excluded from experience on experience page
Given objectives are present in database
| Title      | Id |
| Objective1 | 00000000000000000000000000000001  |
| Objective2 | 00000000000000000000000000000002  |
Given objectives are linked to experiance 'Experience1'
| Title      | Id |
| Objective1 | 00000000000000000000000000000001  |
| Objective2 | 00000000000000000000000000000002  |
When open page by url 'http://localhost:5656/#/experience/00000000000000000000000000000001'
And mouse hover element of related objectives list with title 'Objective1'
And select related objective list item with title 'Objective1'
And click on exclude button on experience page
Then related objectives list contains only items with data
| Title      |
| Objective2 |

Scenario: Exclude button is disabled if there are no selected objectives
Given objectives are present in database
| Title      | Id |
| Objective1 | 00000000000000000000000000000001  |
| Objective2 | 00000000000000000000000000000002  |
Given objectives are linked to experiance 'Experience1'
| Title      | Id |
| Objective1 | 00000000000000000000000000000001  |
| Objective2 | 00000000000000000000000000000002  |
When open page by url 'http://localhost:5656/#/experience/00000000000000000000000000000001'
Then exclude button is enabled false on experience page
When mouse hover element of related objectives list with title 'Objective1'
And select related objective list item with title 'Objective1'
And select related objective list item with title 'Objective1'
Then exclude button is enabled false on experience page

Scenario: Exclude button is enabled if one or more objectives are selected
Given objectives are present in database
| Title      | Id |
| Objective1 | 00000000000000000000000000000001  |
| Objective2 | 00000000000000000000000000000002  |
Given objectives are linked to experiance 'Experience1'
| Title      | Id |
| Objective1 | 00000000000000000000000000000001  |
| Objective2 | 00000000000000000000000000000002  |
When open page by url 'http://localhost:5656/#/experience/00000000000000000000000000000001'
And mouse hover element of related objectives list with title 'Objective1'
And select related objective list item with title 'Objective1'
Then exclude button is enabled true on experience page
When mouse hover element of related objectives list with title 'Objective2'
And select related objective list item with title 'Objective2'
Then exclude button is enabled true on experience page

Scenario: More than one objective can be included to experience at a time
Given objectives are present in database
| Title      | Id |
| Objective1 | 00000000000000000000000000000001  |
| Objective2 | 00000000000000000000000000000002  |
| Objective3 | 00000000000000000000000000000003  |
When open page by url 'http://localhost:5656/#/experience/00000000000000000000000000000001'
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
Given objectives are present in database
| Title      | Id |
| Objective1 | 00000000000000000000000000000001  |
| Objective2 | 00000000000000000000000000000002  |
| Objective3 | 00000000000000000000000000000003  |
Given objectives are linked to experiance 'Experience1'
| Title      | Id |
| Objective1 | 00000000000000000000000000000001  |
| Objective2 | 00000000000000000000000000000002  |
| Objective3 | 00000000000000000000000000000003  |
When open page by url 'http://localhost:5656/#/experience/00000000000000000000000000000001'
And mouse hover element of related objectives list with title 'Objective1'
And select related objective list item with title 'Objective1'
And mouse hover element of related objectives list with title 'Objective3'
And select related objective list item with title 'Objective3'
And click on exclude button on experience page
Then related objectives list contains only items with data
| Title      |
| Objective2 |

Scenario: Objectives already included to experience are not shown in include list
Given objectives are present in database
| Title      | Id |
| Objective1 | 00000000000000000000000000000001  |
| Objective2 | 00000000000000000000000000000002  |
| Objective3 | 00000000000000000000000000000003  |
| Objective4 | 00000000000000000000000000000004  |
Given objectives are linked to experiance 'Experience1'
| Title      | Id |
| Objective1 | 00000000000000000000000000000001  |
| Objective3 | 00000000000000000000000000000003  |
When open page by url 'http://localhost:5656/#/experience/00000000000000000000000000000001'
And click on include button on experience page
Then related objectives list contains only items with data
| Title      |
| Objective2 |
| Objective4 |

Scenario: Excluded objectives are not shown again after go out and back to experience view
Given objectives are present in database
| Title      | Id |
| Objective1 | 00000000000000000000000000000001  |
| Objective2 | 00000000000000000000000000000002  |
| Objective3 | 00000000000000000000000000000003  |
Given objectives are linked to experiance 'Experience1'
| Title      | Id |
| Objective1 | 00000000000000000000000000000001  |
| Objective2 | 00000000000000000000000000000002  |
| Objective3 | 00000000000000000000000000000003  |
When open page by url 'http://localhost:5656/#/experience/00000000000000000000000000000001'
And mouse hover element of related objectives list with title 'Objective1'
And select related objective list item with title 'Objective1'
And mouse hover element of related objectives list with title 'Objective3'
And select related objective list item with title 'Objective3'
And click on exclude button on experience page
Then related objectives list contains only items with data
| Title      |
| Objective2 |
When click on home link
And open page by url 'http://localhost:5656/#/experience/00000000000000000000000000000001'
Then related objectives list contains only items with data
| Title      |
| Objective2 |

Scenario: Included objectives are not shown after go back to include list again
Given objectives are present in database
| Title      | Id |
| Objective1 | 00000000000000000000000000000001  |
| Objective2 | 00000000000000000000000000000002  |
| Objective3 | 00000000000000000000000000000003  |
| Objective4 | 00000000000000000000000000000004  |
When open page by url 'http://localhost:5656/#/experience/00000000000000000000000000000001'
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
Given objectives are present in database
| Title      | Id |
| Objective1 | 00000000000000000000000000000001  |
| Objective2 | 00000000000000000000000000000002  |
| Objective3 | 00000000000000000000000000000003  |
Given objectives are linked to experiance 'Experience1'
| Title      | Id |
| Objective1 | 00000000000000000000000000000001  |
| Objective2 | 00000000000000000000000000000002  |
When open page by url 'http://localhost:5656/#/experience/00000000000000000000000000000002'
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
When click on home link
And open page by url 'http://localhost:5656/#/experience/00000000000000000000000000000001'
Then related objectives list contains only items with data
| Title      |
| Objective1 |
| Objective2 |

Scenario: Objectives excluded from one experience are not excluded from another experience
Given objectives are present in database
| Title      | Id |
| Objective1 | 00000000000000000000000000000001  |
| Objective2 | 00000000000000000000000000000002  |
| Objective3 | 00000000000000000000000000000003  |
Given objectives are linked to experiance 'Experience1'
| Title      | Id |
| Objective1 | 00000000000000000000000000000001  |
| Objective2 | 00000000000000000000000000000002  |
Given objectives are linked to experiance 'Experience2'
| Title      | Id |
| Objective2 | 00000000000000000000000000000002  |
| Objective3 | 00000000000000000000000000000003  |
When open page by url 'http://localhost:5656/#/experience/00000000000000000000000000000002'
When mouse hover element of related objectives list with title 'Objective2'
And select related objective list item with title 'Objective2'
And click on exclude button on experience page
Then related objectives list contains only items with data
| Title      |
| Objective3 |
When click on home link
And open page by url 'http://localhost:5656/#/experience/00000000000000000000000000000001'
Then related objectives list contains only items with data
| Title      |
| Objective1 |
| Objective2 |

Scenario: Experience can not be deleted if it has related objectives
Given objectives are present in database
| Title      | Id |
| Objective1 | 00000000000000000000000000000001  |
Given objectives are linked to experiance 'Experience1'
| Title      | Id |
| Objective1 | 00000000000000000000000000000001  |
When open page by url 'http://localhost:5656/#experiences'
And mouse hover element of publications list with title 'Experience1'
And select publication list item with title 'Experience1'
And click on delete button on experiences list page
Then error notification is displayed true on experiences list page
And publications tiles list consists of ordered items
| Title       |
| Experience1 |
| Experience2 |

Scenario: Objective can not be deleted if it is included to some experience
Given objectives are present in database
| Title      | Id |
| Objective1 | 00000000000000000000000000000001  |
Given objectives are linked to experiance 'Experience1'
| Title      | Id |
| Objective1 | 00000000000000000000000000000001  |
When open page by url 'http://localhost:5656/#objectives'
And mouse hover element of objectives list with title 'Objective1'
And select objective list item with title 'Objective1'
And click on delete button on objectives list page
Then error notification is displayed true on objectives list page
And objectives tiles list consists of ordered items
| Title      |
| Objective1 |

