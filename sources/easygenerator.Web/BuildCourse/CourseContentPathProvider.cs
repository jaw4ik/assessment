using System.IO;

namespace easygenerator.Web.BuildCourse
{
    public class CourseContentPathProvider
    {
        public virtual string GetContentDirectoryName(string buildDirectory)
        {
            return Path.Combine(buildDirectory, "content");
        }

        public virtual string GetCourseIntroductionContentFileName(string buildDirectory)
        {
            return Path.Combine(GetContentDirectoryName(buildDirectory), "content" + ".html");
        }

        public virtual string GetObjectiveDirectoryName(string buildDirectory, string objectiveId)
        {
            return Path.Combine(GetContentDirectoryName(buildDirectory), objectiveId);
        }

        public virtual string GetQuestionDirectoryName(string buildDirectory, string objectiveId, string questionId)
        {
            return Path.Combine(GetObjectiveDirectoryName(buildDirectory, objectiveId), questionId);
        }

        public virtual string GetLearningContentFileName(string buildDirectory, string objectiveId, string questionId, string learningContentId)
        {
            return Path.Combine(GetQuestionDirectoryName(buildDirectory, objectiveId, questionId), learningContentId + ".html");
        }

        public virtual string GetQuestionContentFileName(string buildDirectory, string objectiveId, string questionId)
        {
            return Path.Combine(GetQuestionDirectoryName(buildDirectory, objectiveId, questionId), "content" + ".html");
        }

        public virtual string GetCorrectFeedbackContentFileName(string buildDirectory, string objectiveId, string questionId)
        {
            return Path.Combine(GetQuestionDirectoryName(buildDirectory, objectiveId, questionId), "correctFeedback" + ".html");
        }

        public virtual string GetIncorrectFeedbackContentFileName(string buildDirectory, string objectiveId, string questionId)
        {
            return Path.Combine(GetQuestionDirectoryName(buildDirectory, objectiveId, questionId), "incorrectFeedback" + ".html");
        }

        public virtual string GetDataFileName(string buildDirectory)
        {
            return Path.Combine(GetContentDirectoryName(buildDirectory), "data.js");
        }

        public virtual string GetSettingsFileName(string buildDirectory)
        {
            return Path.Combine(buildDirectory, "settings.js");
        }

        public virtual string GetPublishSettingsFileName(string buildDirectory)
        {
            return Path.Combine(buildDirectory, "publishSettings.js");
        }

        public virtual string GetIncludedModulesDirectoryPath(string buildDirectory)
        {
            return Path.Combine(buildDirectory, "includedModules");
        }
    }
}