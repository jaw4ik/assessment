using System.IO;

namespace easygenerator.Web.BuildExperience
{
    public class BuildPathProvider
    {
        private string BuildPath { get; set; }
        private string WebsitePath { get; set; }
        private string TemplatesPath { get; set; }
        private string DownloadPath { get; set; }

        public BuildPathProvider(HttpRuntimeWrapper httpRuntimeWrapper)
        {
            BuildPath = Path.Combine(Path.GetTempPath(), "eg", "build");
            WebsitePath = httpRuntimeWrapper.GetDomainAppPath();
            TemplatesPath = Path.Combine(WebsitePath, "Templates");
            DownloadPath = Path.Combine(WebsitePath, "Download");
        }

        public virtual string GetBuildDirectoryName(string buildId)
        {
            return Path.Combine(BuildPath, buildId);
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

        public virtual string GetExplanationFileName(string buildId, string objectiveId, string questionId, string explanationId)
        {
            return Path.Combine(GetQuestionDirectoryName(buildId, objectiveId, questionId), explanationId + ".html");
        }

        public virtual string GetDataFileName(string buildId)
        {
            return Path.Combine(GetContentDirectoryName(buildId), "data.js");
        }

        public virtual string GetBuildPackageFileName(string buildId)
        {
            return Path.Combine(DownloadPath, buildId + ".zip");
        }

        public virtual string GetContentDirectoryName(string buildId)
        {
            return Path.Combine(BuildPath, buildId, "content");
        }
    }
}