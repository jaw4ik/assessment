﻿using System;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.IO;
using System.Web.Mvc;

namespace easygenerator.Web.Components.ActionResults
{
    public class ImageResult : ActionResult
    {
        public ImageResult()
        {

        }

        public ImageResult(string path, int? width = null, int? height = null, bool? scaleBySmallerSide = false)
        {
            FilePath = path;
            Width = width;
            Height = height;
            ScaleBySmallerSide = scaleBySmallerSide;
        }

        public string FilePath { get; private set; }
        public int? Width { get; private set; }
        public int? Height { get; private set; }
        public bool? ScaleBySmallerSide { get; private set; }


        public override void ExecuteResult(ControllerContext context)
        {
            if (!Height.HasValue || !Width.HasValue)
            {
                new FilePathResult(FilePath, ContentTypeForFilePath()).ExecuteResult(context);
                return;
            }

            try
            {
                using (var image = Image.FromFile(FilePath))
                {
                    using (var stream = new MemoryStream())
                    {
                        var scale = GetScaleRate(image.Width, image.Height, Width.Value, Height.Value,
                            ScaleBySmallerSide.HasValue && ScaleBySmallerSide.Value);
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
                        new FileContentResult(stream.ToArray(), ContentTypeForFilePath()).ExecuteResult(context);
                    }
                }
            }
            catch
            {
                new EmptyResult().ExecuteResult(context);
            }

        }

        protected float GetScaleRate(int imageWidth, int imageHeight, int resultWidth, int resultHeight, bool scaleBySmallerSide)
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

        protected string ContentTypeForFilePath()
        {
            switch (Path.GetExtension(FilePath).ToLower())
            {
                case ".png": return "image/png";
                case ".jpg": return "image/jpeg";
                case ".jpeg": return "image/jpeg";
                case ".gif": return "image/gif";
                case ".bmp": return "image/bmp";
                default:
                    throw new NotSupportedException();
            }
        }

    }
}