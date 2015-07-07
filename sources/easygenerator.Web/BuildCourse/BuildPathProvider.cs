using System.IO;
using easygenerator.Web.Components;

namespace easygenerator.Web.BuildCourse
{
    public class BuildPathProvider
    {
        private string BuildPath { get; set; }
        private string WebsitePath { get; set; }
        private string DownloadPath { get; set; }

        public BuildPathProvider(HttpRuntimeWrapper httpRuntimeWrapper)
        {
            BuildPath = Path.Combine(Path.GetTempPath(), "eg", "build");
            WebsitePath = httpRuntimeWrapper.GetDomainAppPath();
            DownloadPath = Path.Combine(WebsitePath, "Download");
        }

        public virtual string GetBuildDirectoryName(params string[] buildIds)
        {
            var subPath = Path.Combine(buildIds);
            return Path.Combine(BuildPath, subPath);
        }

        public virtual string GetDownloadPath()
        {
            return DownloadPath;
        }

        public virtual string GetBuildPackageFileName(string buildId)
        {
            return Path.Combine(DownloadPath, buildId + ".zip");
        }

        public virtual string GetBuildedPackagePath(string packagePath)
        {
            return Path.Combine(DownloadPath, packagePath);
        }
    }
}