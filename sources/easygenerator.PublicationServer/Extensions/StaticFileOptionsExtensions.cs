using System.IO;
using System.Linq;
using Microsoft.Owin.StaticFiles;

namespace easygenerator.PublicationServer.Extensions
{
    public static class StaticFileOptionsExtensions
    {
        private static readonly string[] fontExtensions = { ".eot", ".svg", ".ttf", ".woff", ".woff2" };

        public static void DisableCache(this StaticFileOptions fileOptions)
        {
            fileOptions.OnPrepareResponse = fileResponseContext =>
            {
                var fileName = fileResponseContext.File.Name;
                var fileExtension = Path.GetExtension(fileName);
                if (fontExtensions.All(ext => ext != fileExtension))
                {
                    fileResponseContext.OwinContext.Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
                    fileResponseContext.OwinContext.Response.Headers["Pragma"] = "no-cache";
                    fileResponseContext.OwinContext.Response.Headers["Expires"] = "0";
                }
            };
        }
    }
}
