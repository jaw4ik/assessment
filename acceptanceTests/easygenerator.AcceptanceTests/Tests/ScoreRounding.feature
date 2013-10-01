@Errors
Feature: ScoreRounding
	In order to avoid silly mistakes
	As a math idiot
	I want to be told the sum of two numbers


Scenario: Score rounding
Given clear data context 
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
Given objectives are present in database
| Title       | Id |
| Objective11 | 1  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11 | 1  |


Given questions related to 'Objective11' are present in database
| Title      | Id |
| Question11 | 1  |
| Question12 | 2  |
Given answer options related to 'Question11' of 'Objective11' are present in database
| Text            | isCorrect |
| AnswerOption000 | true      |
| AnswerOption001 | false     |
| AnswerOption002 | false     |
| AnswerOption003 | false     |
| AnswerOption004 | false     |
| AnswerOption005 | false     |
| AnswerOption006 | false     |
| AnswerOption007 | false     |
| AnswerOption008 | false     |
| AnswerOption009 | false     |
| AnswerOption010 | false     |
| AnswerOption011 | false     |
| AnswerOption012 | false     |
| AnswerOption013 | false     |
| AnswerOption014 | false     |
| AnswerOption015 | false     |
| AnswerOption016 | false     |
| AnswerOption017 | false     |
| AnswerOption018 | false     |
| AnswerOption019 | false     |
| AnswerOption020 | false     |
| AnswerOption021 | false     |
| AnswerOption022 | false     |
| AnswerOption023 | false     |
| AnswerOption024 | false     |
| AnswerOption025 | false     |
| AnswerOption026 | false     |
| AnswerOption027 | false     |
| AnswerOption028 | false     |
| AnswerOption029 | false     |
| AnswerOption030 | false     |
| AnswerOption031 | false     |
| AnswerOption032 | false     |
| AnswerOption033 | false     |
| AnswerOption034 | false     |
| AnswerOption035 | false     |
| AnswerOption036 | false     |
| AnswerOption037 | false     |
| AnswerOption038 | false     |
| AnswerOption039 | false     |
| AnswerOption040 | false     |
| AnswerOption041 | false     |
| AnswerOption042 | false     |
| AnswerOption043 | false     |
| AnswerOption044 | false     |
| AnswerOption045 | false     |
| AnswerOption046 | false     |
| AnswerOption047 | false     |
| AnswerOption048 | false     |
| AnswerOption049 | false     |
| AnswerOption050 | false     |
| AnswerOption051 | false     |
| AnswerOption052 | false     |
| AnswerOption053 | false     |
| AnswerOption054 | false     |
| AnswerOption055 | false     |
| AnswerOption056 | false     |
| AnswerOption057 | false     |
| AnswerOption058 | false     |
| AnswerOption059 | false     |
| AnswerOption060 | false     |
| AnswerOption061 | false     |
| AnswerOption062 | false     |
| AnswerOption063 | false     |
| AnswerOption064 | false     |
| AnswerOption065 | false     |
| AnswerOption066 | false     |
| AnswerOption067 | false     |
| AnswerOption068 | false     |
| AnswerOption069 | false     |
| AnswerOption070 | false     |
| AnswerOption071 | false     |
| AnswerOption072 | false     |
| AnswerOption073 | false     |
| AnswerOption074 | false     |
| AnswerOption075 | false     |
| AnswerOption076 | false     |
| AnswerOption077 | false     |
| AnswerOption078 | false     |
| AnswerOption079 | false     |
| AnswerOption080 | false     |
| AnswerOption081 | false     |
| AnswerOption082 | false     |
| AnswerOption083 | false     |
| AnswerOption084 | false     |
| AnswerOption085 | false     |
| AnswerOption086 | false     |
| AnswerOption087 | false     |
| AnswerOption088 | false     |
| AnswerOption089 | false     |
| AnswerOption090 | false     |
| AnswerOption091 | false     |
| AnswerOption092 | false     |
| AnswerOption093 | false     |
| AnswerOption094 | false     |
| AnswerOption095 | false     |
| AnswerOption096 | false     |
| AnswerOption097 | false     |
| AnswerOption098 | false     |
| AnswerOption099 | false     |
| AnswerOption001 | false     |
| AnswerOption002 | false     |
| AnswerOption003 | false     |
| AnswerOption004 | false     |
| AnswerOption005 | false     |
| AnswerOption006 | false     |
| AnswerOption007 | false     |
| AnswerOption008 | false     |
| AnswerOption009 | false     |
| AnswerOption010 | false     |
| AnswerOption011 | false     |
| AnswerOption012 | false     |
| AnswerOption013 | false     |
| AnswerOption014 | false     |
| AnswerOption015 | false     |
| AnswerOption016 | false     |
| AnswerOption017 | false     |
| AnswerOption018 | false     |
| AnswerOption019 | false     |
| AnswerOption020 | false     |
| AnswerOption021 | false     |
| AnswerOption022 | false     |
| AnswerOption023 | false     |
| AnswerOption024 | false     |
| AnswerOption025 | false     |
| AnswerOption026 | false     |
| AnswerOption027 | false     |
| AnswerOption028 | false     |
| AnswerOption029 | false     |
| AnswerOption030 | false     |
| AnswerOption031 | false     |
| AnswerOption032 | false     |
| AnswerOption033 | false     |
| AnswerOption034 | false     |
| AnswerOption035 | false     |
| AnswerOption036 | false     |
| AnswerOption037 | false     |
| AnswerOption038 | false     |
| AnswerOption039 | false     |
| AnswerOption040 | false     |
| AnswerOption041 | false     |
| AnswerOption042 | false     |
| AnswerOption043 | false     |
| AnswerOption044 | false     |
| AnswerOption045 | false     |
| AnswerOption046 | false     |
| AnswerOption047 | false     |
| AnswerOption048 | false     |
| AnswerOption049 | false     |
| AnswerOption050 | false     |
| AnswerOption051 | false     |
| AnswerOption052 | false     |
| AnswerOption053 | false     |
| AnswerOption054 | false     |
| AnswerOption055 | false     |
| AnswerOption056 | false     |
| AnswerOption057 | false     |
| AnswerOption058 | false     |
| AnswerOption059 | false     |
| AnswerOption060 | false     |
| AnswerOption061 | false     |
| AnswerOption062 | false     |
| AnswerOption063 | false     |
| AnswerOption064 | false     |
| AnswerOption065 | false     |
| AnswerOption066 | false     |
| AnswerOption067 | false     |
| AnswerOption068 | false     |
| AnswerOption069 | false     |
| AnswerOption070 | false     |
| AnswerOption071 | false     |
| AnswerOption072 | false     |
| AnswerOption073 | false     |
| AnswerOption074 | false     |
| AnswerOption075 | false     |
| AnswerOption076 | false     |
| AnswerOption077 | false     |
| AnswerOption078 | false     |
| AnswerOption079 | false     |
| AnswerOption080 | false     |
| AnswerOption081 | false     |
| AnswerOption082 | false     |
| AnswerOption083 | false     |
| AnswerOption084 | false     |
| AnswerOption085 | false     |
| AnswerOption086 | false     |
| AnswerOption087 | false     |
| AnswerOption088 | false     |
| AnswerOption089 | false     |
| AnswerOption090 | false     |
Given answer options related to 'Question12' of 'Objective11' are present in database
| Text            | isCorrect |
| AnswerOption000 | true      |
| AnswerOption001 | false     |
| AnswerOption002 | false     |
| AnswerOption003 | false     |
| AnswerOption004 | false     |
| AnswerOption005 | false     |
| AnswerOption006 | false     |
| AnswerOption007 | false     |
| AnswerOption008 | false     |
| AnswerOption009 | false     |
| AnswerOption010 | false     |
| AnswerOption011 | false     |
| AnswerOption012 | false     |
| AnswerOption013 | false     |
| AnswerOption014 | false     |
| AnswerOption015 | false     |
| AnswerOption016 | false     |
| AnswerOption017 | false     |
| AnswerOption018 | false     |
| AnswerOption019 | false     |
| AnswerOption020 | false     |
| AnswerOption021 | false     |
| AnswerOption022 | false     |
| AnswerOption023 | false     |
| AnswerOption024 | false     |
| AnswerOption025 | false     |
| AnswerOption026 | false     |
| AnswerOption027 | false     |
| AnswerOption028 | false     |
| AnswerOption029 | false     |
| AnswerOption030 | false     |
| AnswerOption031 | false     |
| AnswerOption032 | false     |
| AnswerOption033 | false     |
| AnswerOption034 | false     |
| AnswerOption035 | false     |
| AnswerOption036 | false     |
| AnswerOption037 | false     |
| AnswerOption038 | false     |
| AnswerOption039 | false     |
| AnswerOption040 | false     |
| AnswerOption041 | false     |
| AnswerOption042 | false     |
| AnswerOption043 | false     |
| AnswerOption044 | false     |
| AnswerOption045 | false     |
| AnswerOption046 | false     |
| AnswerOption047 | false     |
| AnswerOption048 | false     |
| AnswerOption049 | false     |
| AnswerOption050 | false     |
| AnswerOption051 | false     |
| AnswerOption052 | false     |
| AnswerOption053 | false     |
| AnswerOption054 | false     |
| AnswerOption055 | false     |
| AnswerOption056 | false     |
| AnswerOption057 | false     |
| AnswerOption058 | false     |
| AnswerOption059 | false     |
| AnswerOption060 | false     |
| AnswerOption061 | false     |
| AnswerOption062 | false     |
| AnswerOption063 | false     |
| AnswerOption064 | false     |
| AnswerOption065 | false     |
| AnswerOption066 | false     |
| AnswerOption067 | false     |
| AnswerOption068 | false     |
| AnswerOption069 | false     |
| AnswerOption070 | false     |
| AnswerOption071 | false     |
| AnswerOption072 | false     |
| AnswerOption073 | false     |
| AnswerOption074 | false     |
| AnswerOption075 | false     |
| AnswerOption076 | false     |
| AnswerOption077 | false     |
| AnswerOption078 | false     |
| AnswerOption079 | false     |
| AnswerOption080 | false     |
| AnswerOption081 | false     |
| AnswerOption082 | false     |
| AnswerOption083 | false     |
| AnswerOption084 | false     |
| AnswerOption085 | false     |
| AnswerOption086 | false     |
| AnswerOption087 | false     |
| AnswerOption088 | false     |
| AnswerOption089 | false     |
| AnswerOption090 | false     |
| AnswerOption091 | false     |
| AnswerOption092 | false     |
| AnswerOption093 | false     |
| AnswerOption094 | false     |
| AnswerOption095 | false     |
| AnswerOption096 | false     |
| AnswerOption097 | false     |
| AnswerOption098 | false     |
| AnswerOption099 | false     |
| AnswerOption001 | false     |
| AnswerOption002 | false     |
| AnswerOption003 | false     |
| AnswerOption004 | false     |
| AnswerOption005 | false     |
| AnswerOption006 | false     |
| AnswerOption007 | false     |
| AnswerOption008 | false     |
| AnswerOption009 | false     |
| AnswerOption010 | false     |
| AnswerOption011 | false     |
| AnswerOption012 | false     |
| AnswerOption013 | false     |
| AnswerOption014 | false     |
| AnswerOption015 | false     |
| AnswerOption016 | false     |
| AnswerOption017 | false     |
| AnswerOption018 | false     |
| AnswerOption019 | false     |
| AnswerOption020 | false     |
| AnswerOption021 | false     |
| AnswerOption022 | false     |
| AnswerOption023 | false     |
| AnswerOption024 | false     |
| AnswerOption025 | false     |
| AnswerOption026 | false     |
| AnswerOption027 | false     |
| AnswerOption028 | false     |
| AnswerOption029 | false     |
| AnswerOption030 | false     |
| AnswerOption031 | false     |
| AnswerOption032 | false     |
| AnswerOption033 | false     |
| AnswerOption034 | false     |
| AnswerOption035 | false     |
| AnswerOption036 | false     |
| AnswerOption037 | false     |
| AnswerOption038 | false     |
| AnswerOption039 | false     |
| AnswerOption040 | false     |
| AnswerOption041 | false     |
| AnswerOption042 | false     |
| AnswerOption043 | false     |
| AnswerOption044 | false     |
| AnswerOption045 | false     |
| AnswerOption046 | false     |
| AnswerOption047 | false     |
| AnswerOption048 | false     |
| AnswerOption049 | false     |
| AnswerOption050 | false     |
| AnswerOption051 | false     |
| AnswerOption052 | false     |
| AnswerOption053 | false     |
| AnswerOption054 | false     |
| AnswerOption055 | false     |
| AnswerOption056 | false     |
| AnswerOption057 | false     |
| AnswerOption058 | false     |
| AnswerOption059 | false     |
| AnswerOption060 | false     |
| AnswerOption061 | false     |
| AnswerOption062 | false     |
| AnswerOption063 | false     |
| AnswerOption064 | false     |
| AnswerOption065 | false     |
| AnswerOption066 | false     |
| AnswerOption067 | false     |
| AnswerOption068 | false     |
| AnswerOption069 | false     |
| AnswerOption070 | false     |
| AnswerOption071 | false     |
| AnswerOption072 | false     |
| AnswerOption073 | false     |
| AnswerOption074 | false     |
| AnswerOption075 | false     |
| AnswerOption076 | false     |
| AnswerOption077 | false     |
| AnswerOption078 | false     |
| AnswerOption079 | false     |
| AnswerOption080 | false     |
| AnswerOption081 | false     |
| AnswerOption082 | false     |
| AnswerOption083 | false     |
| AnswerOption084 | false     |
| AnswerOption085 | false     |
| AnswerOption086 | false     |
| AnswerOption087 | false     |
| AnswerOption088 | false     |
| AnswerOption089 | false     |
| AnswerOption090 | false     |
Given explanations related to 'Question11' of 'Objective11' are present in database
| Explanation   |
| Explanation11 |
| Explanation12 |
Given explanations related to 'Question12' of 'Objective11' are present in database
| Explanation   |
| Explanation21 |
| Explanation22 |

And open page by url 'http://localhost:5656/#/experiences'
And mouse hover element of publications list with title 'Experience1'
And click build publication list item with title 'Experience1'
And mouse hover element of publications list with title 'Experience1'
And click download publication list item with title 'Experience1'
And unzip '1' package to 'tmp'

When open page by url 'http://localhost:5656/Templates/tmp'
And toggle expand package objective item with title 'Objective11'
And click package question list item 'Question11' of 'Objective11'
And click on submit button on package question page
And click on back to objectives link on package feedback page
And click package question list item 'Question12' of 'Objective11'
And click on submit button on package question page
Then question progress score '99%' is shown on package feedback page

Scenario: Score rounding 2
Given clear data context 
Given publications are present in database
| Title       | Id |
| Experience1 | 1  |
Given objectives are present in database
| Title       | Id |
| Objective11 | 1  |
Given objectives are linked to experiance 'Experience1'
| Title       | Id |
| Objective11 | 1  |


Given questions related to 'Objective11' are present in database
| Title      | Id |
| Question11 | 1  |
| Question12 | 2  |
Given answer options related to 'Question11' of 'Objective11' are present in database
| Text            | isCorrect |
| AnswerOption000 | true      |
| AnswerOption001 | false     |
Given answer options related to 'Question12' of 'Objective11' are present in database
| Text            | isCorrect |
| AnswerOption000 | true      |
| AnswerOption001 | false     |
Given explanations related to 'Question11' of 'Objective11' are present in database
| Explanation   |
| Explanation11 |
| Explanation12 |
Given explanations related to 'Question12' of 'Objective11' are present in database
| Explanation   |
| Explanation21 |
| Explanation22 |

And open page by url 'http://localhost:5656/#/experiences'
And mouse hover element of publications list with title 'Experience1'
And click build publication list item with title 'Experience1'
And mouse hover element of publications list with title 'Experience1'
And click download publication list item with title 'Experience1'
And unzip '1' package to 'tmp'

When open page by url 'http://localhost:5656/Templates/tmp'
And toggle expand package objective item with title 'Objective11'
And click package question list item 'Question11' of 'Objective11'
And click on submit button on package question page
And click on back to objectives link on package feedback page
And click package question list item 'Question12' of 'Objective11'
And click on submit button on package question page
Then question progress score '50%' is shown on package feedback page


