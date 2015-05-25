using ImageMagick;
using System;

namespace easygenerator.Infrastructure.ImageProcessors
{
    public class MagickImageResizerConfigurator
    {
        private readonly PhysicalFileManager _fileManager;
        public MagickImageResizerConfigurator(PhysicalFileManager fileManager)
        {
            _fileManager = fileManager;
        }

        public virtual void Configure(string cacheDirectory)
        {
            if (!String.IsNullOrEmpty(cacheDirectory))
            {
                if (!_fileManager.DirectoryExists(cacheDirectory))
                {
                    _fileManager.CreateDirectory(cacheDirectory);
                }
                MagickAnyCPU.CacheDirectory = cacheDirectory;
            }
        }
    }
}
