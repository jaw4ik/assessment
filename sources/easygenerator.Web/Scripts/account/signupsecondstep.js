function SignUpSecondStepModel() {
    var howManyPeopleAnswer = ko.observable('Choose answer'),
        authoringCourseAnswer = ko.observable('Choose answer'),
        authorCourseNowAnswer = ko.observable('Choose answer');
    
    return {
        howManyPeopleAnswer: howManyPeopleAnswer,
        authoringCourseAnswer: authoringCourseAnswer,
        authorCourseNowAnswer: authorCourseNowAnswer
    };
}