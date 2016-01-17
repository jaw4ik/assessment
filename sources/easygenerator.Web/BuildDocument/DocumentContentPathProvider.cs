using System.IO;

namespace easygenerator.Web.BuildDocument
{
    public class DocumentContentPathProvider
    {
        public virtual string GetContentFileName(string buildDirectory)
        {
            return Path.Combine(buildDirectory, "content.html");
        }
        public virtual string GetDataFileName(string buildDirectory)
        {
            return Path.Combine(buildDirectory, "data.js");
        }
    }
}