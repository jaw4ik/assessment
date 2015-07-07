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

        public virtual string GetLearningPathTemplatePath()
        {
            return Path.Combine(WebsitePath, "BuildLearningPath", "Template");
        }

        public virtual string GetCourseDirectoryName(string buildDirectory, string courseId)
        {
            return Path.Combine(GetContentDirectoryName(buildDirectory), courseId);
        }

        public virtual string GetCourseLink(string courseId)
        {
            return ContentDirectoryName + "/" + courseId + "/index.html";
        }
    }
}