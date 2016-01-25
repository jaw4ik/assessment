using System;
using System.IO;

namespace easygenerator.PublicationServer
{
    public class PublicationPathProvider
    {
        private const string UploadedPackagesFolderName = "UploadedPackages";
        private const string StorageFolderName = "courses";
        private const string SearchContentFolder = "searchcontent";
        private const string ContentFolder = "content";

        public virtual string GetFilePathForUploadedPackage(Guid courseId)
        {
            return Path.Combine(CurrentDirectory, UploadedPackagesFolderName, string.Format("{0}.zip", courseId));
        }

        public virtual string GetUploadedPackagesFolderPath()
        {
            return Path.Combine(CurrentDirectory, UploadedPackagesFolderName);
        }

        public virtual string GetPublishedPackageFolderPath(Guid courseId)
        {
            var courseIdStr = courseId.ToString();
            return Path.Combine(CurrentDirectory, StorageFolderName, courseIdStr[0].ToString(), courseIdStr);
        }

        public virtual string GetPublishedPackagePath(Guid courseId, string resourceName)
        {
            return Path.Combine(GetPublishedPackageFolderPath(courseId), resourceName);
        }

        public virtual string GetSearchContentResourcePath(Guid courseId, string resourceName)
        {
            return Path.Combine(GetPublishedPackageFolderPath(courseId), SearchContentFolder, resourceName);
        }

        public virtual string GetStaticViewLocation(string viewName)
        {
            return Path.Combine(CurrentDirectory, "content\\html", viewName);
        }

        private string CurrentDirectory
        {
            get { return AppDomain.CurrentDomain.BaseDirectory; }
        }

        public string GetPublicationSubDirectoryPath(string requestPath)
        {
            var publicationFolder = GetPublicationFolderNameFromRequestPath(requestPath);
            if (publicationFolder != null)
            {
                return requestPath.Replace(publicationFolder,
                    string.Format("{0}/{1}", publicationFolder[0], publicationFolder));
            }
            return requestPath;
        }

        private string GetPublicationFolderNameFromRequestPath(string requestPath)
        {
            if (!String.IsNullOrEmpty(requestPath))
            {
                string[] segments = requestPath.Split(new[] { '/' }, StringSplitOptions.RemoveEmptyEntries);
                if (segments.Length > 0)
                {

                    var folderName = segments[0];
                    var folderGuid = new Guid();

                    if (Guid.TryParse(folderName, out folderGuid))
                    {
                        return folderName;
                    }
                }
            }
            return null;
        }
    }
}
