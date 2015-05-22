using ImageMagick;
using System;

namespace easygenerator.Infrastructure.ImageProcessors
{
    public class MagickImageResizer : IImageResizer
    {
        public static void Configure(string cacheDirectory)
        {
            if (!String.IsNullOrEmpty(cacheDirectory))
            {
                MagickAnyCPU.CacheDirectory = cacheDirectory;
            }
        }

        public byte[] ResizeImage(string path, int width, int height, bool scaleBySmallerSide)
        {
            try
            {
                using (var image = new MagickImage(path))
                {
                    image.Resize(width, height, scaleBySmallerSide);
                    return image.ToByteArray();
                }
            }
            catch (MagickException e)
            {
                throw new InvalidOperationException("Error while processing image: " + path, e);
            }
            catch (ArgumentException e)
            {
                throw new ArgumentException("Wrong path: " + path, e);
            }
        }

    }

    public static class MagickImageExtensions
    {
        private static bool ScaleByWidth(int width, int height, bool scaleBySmallerSide)
        {
            return (scaleBySmallerSide && width < height) ||
                   (!scaleBySmallerSide && width > height);
        }

        public static void Resize(this MagickImage image, int width, int height, bool scaleBySmallerSide)
        {
            if (ScaleByWidth(image.Width, image.Height, scaleBySmallerSide))
            {
                if (image.Width > width)
                {
                    image.Resize(width, 0);
                }
            }
            else
            {
                if (image.Height > height)
                {
                    image.Resize(0, height);
                }
            }
        }
    }
}
