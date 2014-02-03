using System;
using System.Collections.Generic;
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
            //ApplyCaching(context);

            if (Height.HasValue && Width.HasValue)
            {
                try
                {
                    var content = new WebImage(FilePath)
                        .Resize(Width.Value, Height.Value, true, true)
                        .Crop(1, 1)
                        .GetBytes();

                    new FileContentResult(content, ContentTypeForFilePath()).ExecuteResult(context);
                }
                catch
                {
                    new HttpNotFoundResult().ExecuteResult(context);
                }
            }
            else
            {
                new FilePathResult(FilePath, ContentTypeForFilePath()).ExecuteResult(context);
            }
        }


        //protected void ApplyCaching(ControllerContext context)
        //{
        //    var response = context.HttpContext.Response;
        //    response.Cache.SetCacheability(HttpCacheability.Public);
        //    response.Cache.SetExpires(Cache.NoAbsoluteExpiration);
        //    response.Cache.SetLastModifiedFromFileDependencies();
        //}

        protected string ContentTypeForFilePath()
        {
            switch (Path.GetExtension(FilePath))
            {
                case ".png": return "image/png";
                case ".jpg": return "image/jpeg";
                case ".jpeg": return "image/jpeg";
                case ".gif": return "image/gif";
                default:
                    throw new NotSupportedException();
            }
        }
    }
}