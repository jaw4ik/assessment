using System;
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
            return Path.Combine(CurrentDirectory, StorageFolderName, courseId);
        }

        public virtual string GetStaticViewLocation(string viewName)
        {
            return Path.Combine(CurrentDirectory, "content\\html", viewName);
        }

        private string CurrentDirectory
        {
            get { return AppDomain.CurrentDomain.BaseDirectory; }
        }
    }
}
