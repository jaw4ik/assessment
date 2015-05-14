using System;
using System.IO;
using System.Web.Mvc;

namespace easygenerator.Web.Components.ActionResults
{
    public class ImageResult : ActionResult
    {
        public ImageResult(string path)
        {
            FilePath = path;
        }

        public string FilePath { get; private set; }

        public override void ExecuteResult(ControllerContext context)
        {
            try
            {
                new FilePathResult(FilePath, ContentTypeForFilePath()).ExecuteResult(context);
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