using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ImageMagick;

namespace easygenerator.Infrastructure.ImageProcessors
{
    public class ImageResizer : IImageResizer
    {
        public virtual byte[] ResizeImage(string path, int width, int height, bool scaleBySmallerSide)
        {
            using (var image = Image.FromFile(path))
            {
                using (var stream = new MemoryStream())
                {
                    var scale = GetScaleRate(image.Width, image.Height, width, height, scaleBySmallerSide);
                    if (scale != 1)
                    {
                        var newWidth = (int)(image.Width * scale);
                        var newHeight = (int)(image.Height * scale);

                        using (var thumbnailBitmap = new Bitmap(newWidth, newHeight))
                        {
                            using (var thumbnailGraph = Graphics.FromImage(thumbnailBitmap))
                            {
                                thumbnailGraph.CompositingQuality = CompositingQuality.HighQuality;
                                thumbnailGraph.SmoothingMode = SmoothingMode.HighQuality;
                                thumbnailGraph.InterpolationMode = InterpolationMode.HighQualityBicubic;

                                var imageRectangle = new Rectangle(0, 0, newWidth, newHeight);
                                thumbnailGraph.DrawImage(image, imageRectangle);

                                thumbnailBitmap.Save(stream, image.RawFormat);
                            }
                        }
                    }
                    else
                    {
                        image.Save(stream, image.RawFormat);
                    }
                    return stream.ToArray();
                }
            }

        }

        private float GetScaleRate(int imageWidth, int imageHeight, int resultWidth, int resultHeight, bool scaleBySmallerSide)
        {
            float widthRatio = (float)resultWidth / imageWidth;
            float heightRatio = (float)resultHeight / imageHeight;
            float scaleRate = 1;
            if (scaleBySmallerSide)
            {
                if (imageWidth > resultWidth && imageHeight > resultHeight)
                {
                    scaleRate = Math.Max(widthRatio, heightRatio);
                }
            }
            else
            {
                if (imageWidth > resultWidth || imageHeight > resultHeight)
                {
                    scaleRate = Math.Min(widthRatio, heightRatio);
                }
            }
            return scaleRate;
        }
    }
}
