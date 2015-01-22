using easygenerator.Infrastructure;
using easygenerator.Infrastructure.ImageProcessors;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Configuration;
using System.Globalization;
using System.IO;

namespace easygenerator.Web.Storage
{
    public interface IStorage
    {
        string GetFilePath(string fileName);
        string GetCachedImagePath(string imageFilename, int width, int height, bool scaleBySmallerSide);
        string MapFilePath(string fileName);
        bool FileExists(string fileName);
        long GetMaxFileSize();
    }

    public class Storage : IStorage
    {
        private readonly HttpRuntimeWrapper _httpRuntimeWrapper;
        private readonly ConfigurationReader _configurationReader;
        private readonly PhysicalFileManager _physicalFileManager;
        private readonly IImageResizer _imageResizer;

        private string FilesStoragePath
        {
            get
            {
                return Path.IsPathRooted(_configurationReader.FileStorageConfiguration.Path)
                    ? _configurationReader.FileStorageConfiguration.Path
                    : Path.Combine(_httpRuntimeWrapper.GetDomainAppPath(), _configurationReader.FileStorageConfiguration.Path);
            }
        }

        private const string cacheFolderName = "cache";

        public Storage(HttpRuntimeWrapper httpRuntimeWrapper, ConfigurationReader configurationReader, PhysicalFileManager physicalFileManager, IImageResizer imageResizer)
        {
            _httpRuntimeWrapper = httpRuntimeWrapper;
            _configurationReader = configurationReader;
            _physicalFileManager = physicalFileManager;
            _imageResizer = imageResizer;
        }

        public string GetFilePath(string fileName)
        {
            return Path.Combine(FilesStoragePath, fileName[0].ToString(CultureInfo.InvariantCulture), fileName);
        }

        public string GetCachedImagePath(string imageFilename, int width, int height, bool scaleBySmallerSide)
        {
            var imageId = Path.GetFileNameWithoutExtension(imageFilename).ToLower();
            var imageExtension = Path.GetExtension(imageFilename).ToLower();
            var imageArticle = scaleBySmallerSide ? "s" : "b";

            var cachedImageFilename = string.Format("{0}_{1}_{2}_{3}{4}", imageId, width, height, imageArticle, imageExtension);

            var cachedImageFilepath = Path.Combine(FilesStoragePath, cacheFolderName, imageId.Substring(0, 1), imageId, cachedImageFilename);

            if (!FileExists(cachedImageFilepath))
            {
                var directoryName = Path.GetDirectoryName(cachedImageFilepath);
                _physicalFileManager.CreateDirectory(directoryName);

                var imageFilepath = GetFilePath(imageFilename);
                byte[] image = _imageResizer.ResizeImage(imageFilepath, width, height, scaleBySmallerSide);

                _physicalFileManager.WriteToFile(cachedImageFilepath, image);
            }

            return cachedImageFilepath;
        }

        public string MapFilePath(string fileName)
        {
            var filePath = GetFilePath(fileName);

            var directoryName = Path.GetDirectoryName(filePath);
            _physicalFileManager.CreateDirectory(directoryName);

            return filePath;
        }

        public bool FileExists(string fileName)
        {
            var filePath = GetFilePath(fileName);

            return _physicalFileManager.FileExists(filePath);
        }

        public long GetMaxFileSize()
        {
            return _configurationReader.FileStorageConfiguration.MaximumFileSize;
        }
    }
}