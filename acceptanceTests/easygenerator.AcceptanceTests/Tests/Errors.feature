Feature: Errors
	Erorrs 400 and 404 should be processed

Scenario Outline: Correct error pages should be opened for 
When open page by url '<url>'
Then browser navigates to url '<expectedUrl>'
And page contains element with text '<pageText>'
Examples: 
| Test name               | url                                                        | expectedUrl                 | pageText    |
| Home page bad request   | http://localhost:5656/#/bla                                | http://localhost:5656/#/    | Bad request |
| Objective bad request   | http://localhost:5656/#/objective/asd                      | http://localhost:5656/#/403 | Bad request |
| Objective not found     | http://localhost:5656/#/objective/1000                     | http://localhost:5656/#/404 | Not found   |
| Publication bad request | http://localhost:5656/#/publications/asd                   | http://localhost:5656/#/403 | Bad request |
| Publication not found   | http://localhost:5656/#/publications/1000                  | http://localhost:5656/#/404 | Not found   |
| Question bad request    | http://localhost:5656/#/objective/0/question/aad           | http://localhost:5656/#/403 | Bad request |
| Question not found      | http://localhost:5656/#/objective/0/question/1000          | http://localhost:5656/#/404 | Not found   |
| Answer bad request      | http://localhost:5656/#/objective/0/question/0/answer/asd  | http://localhost:5656/#/403 | Bad request |
| Answer not found        | http://localhost:5656/#/objective/0/question/0/answer/1000 | http://localhost:5656/#/404 | Not found   |

