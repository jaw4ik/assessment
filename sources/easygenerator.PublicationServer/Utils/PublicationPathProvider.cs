using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;

namespace easygenerator.PublicationServer.Utils
{
    public class PublicationPathProvider
    {
        private const string UploadedPackagesFolderName = "UploadedPackages";
        private const string StorageFolderName = "courses";
        private const string SearchContentFolder = "searchcontent";

        public virtual string GetFilePathForUploadedPackage(Guid courseId)
        {
            return Path.Combine(CurrentDirectory, UploadedPackagesFolderName, $"{courseId}.zip");
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

        public bool IsPathToFolder(string path)
        {
            return Path.GetExtension(path) == string.Empty;
        }

        private string CurrentDirectory => AppDomain.CurrentDomain.BaseDirectory;

        public string GetPrivatePublicationSubDirectoryPath(string requestPath)
        {
            var publicationFolder = GetPublicationFolderNameFromRequestPath(requestPath);
            Guid folderGuid;
            if (Guid.TryParse(publicationFolder, out folderGuid))
            {
                return requestPath.Replace(publicationFolder,
                    $"{publicationFolder[0]}/{publicationFolder}");
            }
            return requestPath;
        }

        public string GetPublicationFolderNameFromRequestPath(string requestPath)
        {
            if (!String.IsNullOrEmpty(requestPath))
            {
                string[] segments = requestPath.Split(new[] { '/' }, StringSplitOptions.RemoveEmptyEntries);
                if (segments.Length > 0)
                {
                    return segments[0];
                }
            }
            return null;
        }

        public virtual string GetPublicationPublicPath(string title)
        {
            var titleWithOutSpecialCharacters = new string(title.Where(c => char.IsLetterOrDigit(c) || char.IsWhiteSpace(c) || c == '-').ToArray());
            titleWithOutSpecialCharacters = Regex.Replace(titleWithOutSpecialCharacters, "[\\s]+", "-");
            return $"{new Random().Next(10000, 100000)}-{titleWithOutSpecialCharacters}";
        }
    }
}
