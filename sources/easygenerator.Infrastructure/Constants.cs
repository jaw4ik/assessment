namespace easygenerator.Infrastructure
{
    public static class Constants
    {
        public const string EmailValidationRegexp = @"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,6})+)$";

        public class Errors
        {
            public const string ExperienceNotFoundError = "Experience is not found";
            public const string ObjectiveNotFoundError = "Objective is not found";
            public const string ObjectivesNotFoundError = "Objectives are not found";
            public const string QuestionNotFoundError = "Question is not found";
            public const string AnswerNotFoundError = "Answer is not found";
            public const string LearningContentNotFoundError = "Learning Content is not found";
            public const string HelpHintNotFoundError = "Help Hint is not found";
            public const string ObjectiveCannotBeDeleted = "Objective can not be deleted";

            public const string ExperienceNotFoundResourceKey = "experienceNotFoundError";
            public const string ObjectiveNotFoundResourceKey = "objectiveNotFoundError";
            public const string ObjectivesNotFoundResourceKey = "objectivesNotFoundError";
            public const string QuestionNotFoundResourceKey = "questionNotFoundError";
            public const string AnswerNotFoundResourceKey = "answerNotFoundError";
            public const string LearningContentNotFoundResourceKey = "learningContentNotFoundError";
            public const string HelpHintNotFoundResourceKey = "helpHintNotFoundError";
            public const string ObjectiveCannotBeDeletedResourceKey = "objectiveCannnotBeDeleted";
        }

        public static class SessionConstants
        {
            public const string UserSignUpModel = "UserSignUpModel";
        }

        public class MailTemplates
        {
            public const string SignedUpUserTemplate = "SignedUpUserTemplate";
        }
    }
}
