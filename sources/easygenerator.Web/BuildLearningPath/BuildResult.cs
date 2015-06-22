namespace easygenerator.Web.BuildLearningPath
{
    public class BuildResult
    {
        public bool Success { get; private set; }
        public string PackageUrl { get; private set; }

        public BuildResult(bool success, string packageUrl)
        {
            Success = success;
            PackageUrl = packageUrl;
        }
    }
}