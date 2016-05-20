using System;
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

        public virtual string GetSectionDirectoryName(string buildDirectory, string sectionId)
        {
            return Path.Combine(GetContentDirectoryName(buildDirectory), sectionId);
        }

        public virtual string GetQuestionDirectoryName(string buildDirectory, string sectionId, string questionId)
        {
            return Path.Combine(GetSectionDirectoryName(buildDirectory, sectionId), questionId);
        }

        public virtual string GetLearningContentFileName(string buildDirectory, string sectionId, string questionId, string learningContentId)
        {
            return Path.Combine(GetQuestionDirectoryName(buildDirectory, sectionId, questionId), learningContentId + ".html");
        }

        public virtual string GetQuestionContentFileName(string buildDirectory, string sectionId, string questionId)
        {
            return Path.Combine(GetQuestionDirectoryName(buildDirectory, sectionId, questionId), "content" + ".html");
        }

        public virtual string GetCorrectFeedbackContentFileName(string buildDirectory, string sectionId, string questionId)
        {
            return Path.Combine(GetQuestionDirectoryName(buildDirectory, sectionId, questionId), "correctFeedback" + ".html");
        }

        public virtual string GetIncorrectFeedbackContentFileName(string buildDirectory, string sectionId, string questionId)
        {
            return Path.Combine(GetQuestionDirectoryName(buildDirectory, sectionId, questionId), "incorrectFeedback" + ".html");
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

        public virtual string GetIncludedMediaDirectoryPath(string buildDirectory)
        {
            return Path.Combine(buildDirectory, "media");
        }

        public virtual string GetIncludedFontsDirectoryPath(string buildDirectory)
        {
            return Path.Combine(buildDirectory, "fonts");
        }

        public virtual string GetNewImageWebPath(string absoluteImageFilePath)
        {
            return Path.Combine("media", Path.GetFileName(absoluteImageFilePath)).Replace("\\", "/");
        }

        public virtual string GetFontWebPath(string fontFilePath)
        {
            return Path.Combine("fonts", Path.GetFileName(fontFilePath)).Replace("\\", "/");
        }

        public virtual string GetNewImagePath(string mediaPath, string imageUrl)
        {
            return Path.Combine(mediaPath, Guid.NewGuid() + Path.GetExtension(new Uri(imageUrl).AbsolutePath));
        }


        public virtual string GetFontsStylesheetFilePath(string buildDirectory)
        {
            return Path.Combine(buildDirectory, "css", "fonts.css");
        }
    }
}