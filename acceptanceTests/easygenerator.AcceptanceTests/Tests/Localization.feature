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
	| nlNl         | Leerdoel           |
	| nlBe         | Learning objective |
	| En           | Learning objective |
	| De           | Lernziel           |
	| deDe         | Lernziel           |
	| sl,deDe      | Lernziel           |

Scenario Template: Localization is changed if change user settings
	When open page by url 'http://localhost:5656'
	And open user settings
	And select language '<language>' in user settings
	And click save user settings
	Then objectives list page header text is '<text>'
	Scenarios: 
	| language    | text               |
	| Netherlands | Leerdoel           |
	| English     | Learning objective |
	| German      | Lernziel           |