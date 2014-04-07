using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Caching;
using System.Web.Helpers;
using System.Web.Mvc;

namespace easygenerator.Web.Components.ActionResults
{
    public class ImageResult : ActionResult
    {
        public ImageResult()
        {

        }

        public ImageResult(string path, int? width = null, int? height = null)
        {
            FilePath = path;
            Width = width;
            Height = height;
        }

        public string FilePath { get; private set; }
        public int? Width { get; private set; }
        public int? Height { get; private set; }


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
                    var scale = image.Width > Width || image.Height > Height ? Math.Min((float)Width / image.Size.Width, (float)Height / image.Size.Height) : 1;

                    var thumbnail = image.GetThumbnailImage((int)(image.Size.Width * scale), (int)(image.Size.Height * scale), () => false, IntPtr.Zero);
                    using (var stream = new MemoryStream())
                    {
                        thumbnail.Save(stream, image.RawFormat);
                        new FileContentResult(stream.ToArray(), ContentTypeForFilePath()).ExecuteResult(context);
                    }
                }
            }
            catch
            {
                new EmptyResult().ExecuteResult(context);
            }

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