using ImageMagick;

namespace easygenerator.Infrastructure.ImageProcessors
{
    public class MagickAnyCPUWrapper
    {
        public virtual string CacheDirectory
        {
            set { MagickAnyCPU.CacheDirectory = value; }
        }
    }
}
