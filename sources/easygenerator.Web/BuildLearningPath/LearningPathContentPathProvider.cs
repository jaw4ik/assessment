using easygenerator.Web.Components;
using System.IO;

namespace easygenerator.Web.BuildLearningPath
{
    public class LearningPathContentPathProvider
    {
        private string ContentDirectoryName { get; set; }
        private string WebsitePath { get; set; }

        public LearningPathContentPathProvider(HttpRuntimeWrapper httpRuntimeWrapper)
        {
            WebsitePath = httpRuntimeWrapper.GetDomainAppPath();
            ContentDirectoryName = "data";
        }

        public virtual string GetContentDirectoryName(string buildDirectory)
        {
            return Path.Combine(buildDirectory, ContentDirectoryName);
        }

        public virtual string GetLearningPathModelFileName(string buildDirectory)
        {
            return Path.Combine(GetContentDirectoryName(buildDirectory), "data.json");
        }

        public virtual string GetSettingsFileName(string buildDirectory)
        {
            return Path.Combine(buildDirectory, "settings.js");
        }

        public virtual string GetLearningPathTemplatePath()
        {
            return Path.Combine(WebsitePath, "BuildLearningPath", "Template");
        }

        public virtual string GetEntityDirectoryName(string buildDirectory, string entityId)
        {
            return Path.Combine(GetContentDirectoryName(buildDirectory), entityId);
        }

        public virtual string GetEntityLink(string entityId)
        {
            return ContentDirectoryName + "/" + entityId;
        }
    }
}