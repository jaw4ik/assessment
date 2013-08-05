using System.IO.Compression;
using easygenerator.Infrastructure;

namespace easygenerator.Web.BuildExperience
{
    public class BuildPackageCreator
    {
        private PhysicalFileManager _fileManager;

        public BuildPackageCreator(PhysicalFileManager fileManager)
        {
            _fileManager = fileManager;
        }

        public virtual void CreatePackageFromFolder(string packageFolderPath, string destinationFileName)
        {
            _fileManager.DeleteFile(destinationFileName);
            ZipFile.CreateFromDirectory(packageFolderPath, destinationFileName);
        }
    }
}