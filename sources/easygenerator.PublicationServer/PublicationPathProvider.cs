﻿using System;
using System.IO;

namespace easygenerator.PublicationServer
{
    public class PublicationPathProvider
    {
        private const string UploadedPackagesFolderName = "UploadedPackages";
        private const string StorageFolderName = "courses";

        public virtual string GetFilePathForUploadedPackage(string courseId)
        {
            return Path.Combine(CurrentDirectory, UploadedPackagesFolderName, string.Format("{0}.zip", courseId));
        }

        public virtual string GetUploadedPackagesFolderPath()
        {
            return Path.Combine(CurrentDirectory, UploadedPackagesFolderName);
        }

        public virtual string GetPublishedPackageFolderPath(string courseId)
        {
            return Path.Combine(CurrentDirectory, StorageFolderName, courseId[0].ToString(), courseId);
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
