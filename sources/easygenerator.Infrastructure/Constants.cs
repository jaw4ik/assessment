﻿namespace easygenerator.Infrastructure
{
    public static class Constants
    {
        public const string EmailValidationRegexp = @"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,6})+)$";

        public class Errors
        {
            public const string ExperienceNotFoundError = "Experience is not found";
            public const string ObjectiveNotFoundError = "Objective is not found";
            public const string QuestionNotFoundError = "Question is not found";
            public const string AnswerNotFoundError = "Answer is not found";
            public const string LearningObjectNotFoundError = "Learning Object is not found";
            public const string HelpHintNotFoundError = "Help Hint is not found";

            public const string ExperienceNotFoundResourceKey = "experienceNotFoundError";
            public const string ObjectiveNotFoundResourceKey = "objectiveNotFoundError";
            public const string QuestionNotFoundResourceKey = "questionNotFoundError";
            public const string AnswerNotFoundResourceKey = "answerNotFoundError";
            public const string LearningObjectNotFoundResourceKey = "learningObjectNotFoundError";
            public const string HelpHintNotFoundResourceKey = "helpHintNotFoundError";
        }

        public class HelpHintNames
        {
            public const string ExperiencesHelpHintKey = "experiences";
            public const string ExperienceHelpHintKey = "experience";
            public const string CreateExperienceHelpHintKey = "createExperience";

            public const string LearningObjectivesHelpHintKey = "objectives";
            public const string LearningObjectiveHelpHintKey = "objective";
            public const string CreateLearningObjectiveHelpHintKey = "createObjective";

            public const string QuestionHelpHintKey = "question";
            public const string CreateQuestionHelpHintKey = "createQuestion";
        }
    }
}
