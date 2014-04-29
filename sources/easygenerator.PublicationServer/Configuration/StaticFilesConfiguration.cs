using easygenerator.PublicationServer.Extensions;
using Microsoft.Owin;
using Microsoft.Owin.Extensions;
using Microsoft.Owin.FileSystems;
using Microsoft.Owin.StaticFiles;
using Owin;

namespace easygenerator.PublicationServer.Configuration
{
    public static class StaticFilesConfiguration
    {
        public static void Configure(IAppBuilder appBuilder)
        {
            appBuilder.UseStaticFiles("/content");

            var fileServerOptions = new FileServerOptions()
            {
                FileSystem = new PhysicalFileSystem(".\\courses"),
                RequestPath = new PathString(@""),
                EnableDefaultFiles = true
            };
            fileServerOptions.StaticFileOptions.DisableCache();
            appBuilder.UseFileServer(fileServerOptions);

            appBuilder.UseStageMarker(PipelineStage.Authenticate);
        }
    }
}
