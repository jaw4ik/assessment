@Localization
Feature: Localization

@Localization_Test

Scenario Template: Localization of browser should be applied to course by default
	Given clear data context
	Given browser localizatiom is set to '<localization>'
	When open page by url 'http://localhost:5656/launchtry'
	And click on tab objectives link on expiriences list page
	And sleep 500 milliseconds
	Then objectives list page header text is '<text>'
	Scenarios: 
	| localization | text                |
	| Nl           | Leerdoelen          |
	| nl-Nl        | Leerdoelen          |
	| nl-Be        | Learning objectives |
	| En           | Learning objectives |
	| De           | Lernziele           |
	| de-De        | Lernziele           |
	| sl,de-De     | Lernziele           |

Scenario Template: Localization is changed if change user settings
	#When open page by url 'http://localhost:5656'
	#And open user settings
	Given clear data context
	When open page by url 'http://localhost:5656/signout'
	And open page by url 'http://localhost:5656/signin'
	And sign in as 'test' user on sign in page
	Then browser navigates to url 'http://localhost:5656/'
	When open page by url 'http://localhost:5656/#/user'
	And select language '<language>' in user settings
	And click save user settings
	And click on tab objectives link on expiriences list page
	And sleep 500 milliseconds
	Then objectives list page header text is '<text>'
	Scenarios: 
	| language    | text                |
	| Netherlands | Leerdoelen          |
	| English     | Learning objectives |
	| German      | Lernziele           |