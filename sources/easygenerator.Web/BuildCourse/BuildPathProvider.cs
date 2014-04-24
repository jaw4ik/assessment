using System.IO;
using easygenerator.Web.Components;

namespace easygenerator.Web.BuildCourse
{
    public class BuildPathProvider
    {
        private string BuildPath { get; set; }
        private string WebsitePath { get; set; }
        private string TemplatesPath { get; set; }
        private string DownloadPath { get; set; }
        private string PublishPath { get; set; }

        public BuildPathProvider(HttpRuntimeWrapper httpRuntimeWrapper)
        {
            BuildPath = Path.Combine(Path.GetTempPath(), "eg", "build");
            WebsitePath = httpRuntimeWrapper.GetDomainAppPath();
            TemplatesPath = Path.Combine(WebsitePath, "Templates");
            DownloadPath = Path.Combine(WebsitePath, "Download");
            PublishPath = Path.Combine(WebsitePath, "PublishedPackages");
        }

        public virtual string GetBuildDirectoryName(string buildId)
        {
            return Path.Combine(BuildPath, buildId);
        }

        #region Build Content

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

        #endregion

        public virtual string GetTemplateDirectoryName(string templateName)
        {
            return Path.Combine(TemplatesPath, templateName);
        }

        public virtual string GetDownloadPath()
        {
            return DownloadPath;
        }

        public virtual string GetBuildPackageFileName(string buildId)
        {
            return Path.Combine(DownloadPath, buildId + ".zip");
        }

        public virtual string GetPublishFolderPath(string courseId)
        {
            return Path.Combine(PublishPath, courseId);
        }

        public virtual string GetPublishedResourcePath(string resourcePath)
        {
            return Path.Combine(PublishPath, resourcePath);
        }

        public virtual string GetBuildedPackagePath(string packagePath)
        {
            return Path.Combine(DownloadPath, packagePath);
        }
    }
}