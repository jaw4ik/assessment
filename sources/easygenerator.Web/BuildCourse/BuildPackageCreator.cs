using System;
using System.IO;
using easygenerator.Infrastructure;
using Ionic.Zip;
using Ionic.Zlib;

namespace easygenerator.Web.BuildCourse
{
    public class BuildPackageCreator
    {
        private readonly PhysicalFileManager _fileManager;

        public BuildPackageCreator(PhysicalFileManager fileManager)
        {
            _fileManager = fileManager;
        }

        public virtual void CreatePackageFromFolder(string packageFolderPath, string destinationFileName)
        {
            ThrowIfSourceDirectoryIsInvalid(packageFolderPath);
            ThrowIfDestinationPackageIsInvalid(destinationFileName);

            _fileManager.DeleteFile(destinationFileName);
            DoCreateFromDirectory(packageFolderPath, destinationFileName);
        }

        private void DoCreateFromDirectory(string sourceDirectoryName, string destinationArchiveFileName)
        {
            using (var zipFile = new ZipFile())
            {
                zipFile.CompressionLevel = CompressionLevel.BestSpeed;
                zipFile.AddDirectory(sourceDirectoryName);
                zipFile.Save(destinationArchiveFileName);
            }
        }

        private void ThrowIfSourceDirectoryIsInvalid(string folderPath)
        {
            if (String.IsNullOrEmpty(folderPath))
            {
                throw new ArgumentException("Source directory path is invalid");
            }

            if (!_fileManager.DirectoryExists(folderPath))
            {
                throw new DirectoryNotFoundException("Source directory not found");
            }
        }

        private void ThrowIfDestinationPackageIsInvalid(string filePath)
        {
            if (String.IsNullOrEmpty(filePath))
            {
                throw new ArgumentException("Package file name is invalid");
            }
        }
    }
}