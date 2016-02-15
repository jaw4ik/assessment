using easygenerator.Infrastructure;
using easygenerator.Infrastructure.ImageProcessors;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Configuration;
using System.Globalization;
using System.IO;

namespace easygenerator.Web.Storage
{
    public interface IImageStorage
    {
        string GetImagePath(string imageFilename, int width, int height, bool scaleBySmallerSide);
        string GetCachedImagePath(string imageFilename);
    }

    public class ImageStorage : IImageStorage
    {
        private readonly HttpRuntimeWrapper _httpRuntimeWrapper;
        private readonly ConfigurationReader _configurationReader;
        private readonly PhysicalFileManager _physicalFileManager;
        private readonly IStorage _storage;
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

        public ImageStorage(HttpRuntimeWrapper httpRuntimeWrapper, ConfigurationReader configurationReader, PhysicalFileManager physicalFileManager, IStorage storage, IImageResizer imageResizer)
        {
            _httpRuntimeWrapper = httpRuntimeWrapper;
            _configurationReader = configurationReader;
            _physicalFileManager = physicalFileManager;
            _storage = storage;
            _imageResizer = imageResizer;
        }

        public string GetImagePath(string imageFilename, int width, int height, bool scaleBySmallerSide)
        {
            var thumbnailPath = GetThumbnailPath(imageFilename, width, height, scaleBySmallerSide);

            if (!_storage.FileExists(thumbnailPath))
            {
                using (Locker.Lock(thumbnailPath))
                {
                    if (!_storage.FileExists(thumbnailPath))
                    {
                        var imageFilepath = _storage.GetFilePath(imageFilename);

                        CreateThumbnail(imageFilepath, thumbnailPath, width, height, scaleBySmallerSide);
                    }
                }
            }

            return thumbnailPath;
        }

        public string GetCachedImagePath(string imageFilename)
        {
            var imageId = Path.GetFileNameWithoutExtension(imageFilename).ToLower();
            return Path.Combine(FilesStoragePath, cacheFolderName, imageId.Substring(0, 1), imageId);
        }

        private string GetThumbnailPath(string sourceImageFilename, int width, int height, bool scaleBySmallerSide)
        {
            var imageId = Path.GetFileNameWithoutExtension(sourceImageFilename).ToLower();
            var imageExtension = Path.GetExtension(sourceImageFilename).ToLower();
            var imageArticle = scaleBySmallerSide ? "s" : "b";

            var cachedImageFilename = string.Format("{0}_{1}_{2}_{3}{4}", imageId, width, height, imageArticle, imageExtension);

            return Path.Combine(FilesStoragePath, cacheFolderName, imageId.Substring(0, 1), imageId, cachedImageFilename);
        }

        private void CreateThumbnail(string sourceImagePath, string destinationImagePath, int width, int height, bool scaleBySmallerSide)
        {
            var directoryName = Path.GetDirectoryName(destinationImagePath);
            _physicalFileManager.CreateDirectory(directoryName);

            byte[] image = _imageResizer.ResizeImage(sourceImagePath, width, height, scaleBySmallerSide);
            _physicalFileManager.WriteToFile(destinationImagePath, image);
        }

    }
}