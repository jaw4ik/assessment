using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.Infrastructure
{
    public class Errors
    {
        public const string CourseNotFoundError = "Course is not found";
        public const string ObjectiveNotFoundError = "Objective is not found";
        public const string ObjectivesNotFoundError = "Objectives are not found";
        public const string QuestionNotFoundError = "Question is not found";
        public const string AnswerNotFoundError = "Answer is not found";
        public const string LearningContentNotFoundError = "Learning Content is not found";
        public const string HelpHintNotFoundError = "Help Hint is not found";
        public const string TemplateNotFoundError = "Template not found";
        public const string ObjectiveCannotBeDeleted = "Objective can not be deleted";
        public const string CoursePublishFailedError = "Failed. Try again.";

        public const string CourseNotFoundResourceKey = "courseNotFoundError";
        public const string ObjectiveNotFoundResourceKey = "objectiveNotFoundError";
        public const string ObjectivesNotFoundResourceKey = "objectivesNotFoundError";
        public const string QuestionNotFoundResourceKey = "questionNotFoundError";
        public const string AnswerNotFoundResourceKey = "answerNotFoundError";
        public const string LearningContentNotFoundResourceKey = "learningContentNotFoundError";
        public const string HelpHintNotFoundResourceKey = "helpHintNotFoundError";
        public const string ObjectiveCannotBeDeletedResourceKey = "objectiveCannnotBeDeleted";
        public const string CoursePublishFailedResourceKey = "publishFailed";

        public const string UpgradeToStarterPlanToUseScormResourceKey = "upgradeToStarterPlanToUseScorm";
    }
}
