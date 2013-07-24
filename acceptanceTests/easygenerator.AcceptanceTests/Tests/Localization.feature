@Localization
Feature: Localization

@Localization_Test
Scenario Template: Localization of browser should be applied to course by default
	Given browser localizatiom is set to '<localization>'
	When open page by url 'http://localhost:5656'
	Then objectives list page header text is '<text>'
	Scenarios: 
	| localization | text               |
	| Nl           | Leerdoel           |
	| nl-Nl         | Leerdoel           |
	| nl-Be         | Learning objective |
	| En           | Learning objective |
	| De           | Lernziel           |
	| de-De         | Lernziel           |
	| sl,de-De      | Lernziel           |

Scenario Template: Localization is changed if change user settings
	#When open page by url 'http://localhost:5656'
	#And open user settings
	When open page by url 'http://localhost:5656/#/user'
	And select language '<language>' in user settings
	And click save user settings
	Then objectives list page header text is '<text>'
	Scenarios: 
	| language    | text               |
	| Netherlands | Leerdoel           |
	| English     | Learning objective |
	| German      | Lernziel           |