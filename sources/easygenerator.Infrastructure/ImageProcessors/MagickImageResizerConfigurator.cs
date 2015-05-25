using System;

namespace easygenerator.Infrastructure.ImageProcessors
{
    public class MagickImageResizerConfigurator
    {
        private readonly PhysicalFileManager _fileManager;
        private readonly MagickAnyCPUWrapper _magickAnyCpuWrapper;

        public MagickImageResizerConfigurator(PhysicalFileManager fileManager, MagickAnyCPUWrapper magickAnyCpuWrapper)
        {
            _fileManager = fileManager;
            _magickAnyCpuWrapper = magickAnyCpuWrapper;
        }

        public virtual void Configure(string cacheDirectory)
        {
            if (!String.IsNullOrEmpty(cacheDirectory))
            {
                if (!_fileManager.DirectoryExists(cacheDirectory))
                {
                    _fileManager.CreateDirectory(cacheDirectory);
                }
                _magickAnyCpuWrapper.CacheDirectory = cacheDirectory;
            }
        }
    }
}
