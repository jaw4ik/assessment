@Localization_Test
Feature: Localization

Scenario Template: Localization of browser should be applied to course by default
	Given browser localizatiom is set to '<localization>'
	When open page by url 'http://localhost:5656'
	Then objectives list page header text is '<text>'
	Scenarios: 
	| localization | text                |
	| Nl           | Leerdoelen          |
	| En           | Learning objectives |
	| De           | Lernziele           |
