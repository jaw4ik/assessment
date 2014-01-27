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

        public virtual string GetCourseIntroductionContentFileName(string buildId)
        {
            return Path.Combine(GetContentDirectoryName(buildId), "content" + ".html");
        }

        public virtual string GetTemplateDirectoryName(string templateName)
        {
            return Path.Combine(TemplatesPath, templateName);
        }

        public virtual string GetObjectiveDirectoryName(string buildId, string objectiveId)
        {
            return Path.Combine(GetContentDirectoryName(buildId), objectiveId);
        }

        public virtual string GetQuestionDirectoryName(string buildId, string objectiveId, string questionId)
        {
            return Path.Combine(GetObjectiveDirectoryName(buildId, objectiveId), questionId);
        }

        public virtual string GetLearningContentFileName(string buildId, string objectiveId, string questionId, string learningContentId)
        {
            return Path.Combine(GetQuestionDirectoryName(buildId, objectiveId, questionId), learningContentId + ".html");
        }

        public virtual string GetQuestionContentFileName(string buildId, string objectiveId, string questionId)
        {
            return Path.Combine(GetQuestionDirectoryName(buildId, objectiveId, questionId), "content" + ".html");
        }

        public virtual string GetDataFileName(string buildId)
        {
            return Path.Combine(GetContentDirectoryName(buildId), "data.js");
        }

        public virtual string GetSettingsFileName(string buildId)
        {
            return Path.Combine(GetBuildDirectoryName(buildId), "settings.js");
        }

        public virtual string GetPublishSettingsFileName(string buildId)
        {
            return Path.Combine(GetBuildDirectoryName(buildId), "publishSettings.js");
        }

        public virtual string GetBuildPackageFileName(string buildId)
        {
            return Path.Combine(DownloadPath, buildId + ".zip");
        }

        public virtual string GetContentDirectoryName(string buildId)
        {
            return Path.Combine(BuildPath, buildId, "content");
        }

        public virtual string GetDownloadPath()
        {
            return DownloadPath;
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