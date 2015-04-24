using Microsoft.Owin.StaticFiles;

namespace easygenerator.PublicationServer.Extensions
{
    public static class StaticFileOptionsExtensions
    {
        public static void DisableCache(this StaticFileOptions fileOptions)
        {
            fileOptions.OnPrepareResponse = fileResponseContext =>
            {
                fileResponseContext.OwinContext.Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
                fileResponseContext.OwinContext.Response.Headers["Pragma"] = "no-cache";
                fileResponseContext.OwinContext.Response.Headers["Expires"] = "0";
            };
        }
    }
}
